import { ToorError, InternalToorError } from '../../errors/index.js';
import {
  RPECandidateRef,
  candidateRefFromCandidate,
} from '../rpe-candidate/index.js';
import { 
  findCandidateById,
  RPEIteration,
  RPEIterationInProgress,
  RPEState,
} from '../rpe-state/index.js';
import { buildRPEInsightsInfo, RPEInsights } from '../rpe-insights/index.js';
import { RPEInput, RPEOutput } from './rpe-types.js';
import { RPEExecutorResponse } from '../rpe-executor/rpe-executor-types.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { 
  RPECandidateGeneratorCandidate,
} from '../rpe-candidate-generator/index.js';
import { RPECandidateSelector } from '../rpe-candidate-selector/index.js';
import {
  buildInputForDatasetEvaluation,
  evaluateDataset,
} from './dataset-evaluator.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { EvaluatorCandidateOutput } from './evaluator-types.js';
import { analyzeAggregatedEvaluations } from './analyzer.js';
import { generateCandidates } from './candidate-generator.js';
import { 
  toCandidateGeneratorOutputCandidate,
} from './candidate-generator-utils.js';
import { validateCandidates } from './candidate-validator.js';
import { RPERejectedCandidateRef } from './candidate-validator-types.js';

/**
 * Runs the Reflective Prompt Evolution (RPE) process.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE process.
 * @returns A promise that resolves when the RPE process is complete.
 */
export async function optimize(
  input: RPEInput,
): Promise<RPEOutput> {
  const state: RPEState = {
    aggregatedEvaluations: [],
    candidates: [...input.seed],
    datasetEntries: [...input.dataset.entries],
    iterationNo: 1,
    iteration: {
      iterationNo: 1,
      candidateRefs: input.seed.map(candidate => {
        return candidateRefFromCandidate(candidate);
      }),
    },
    iterationHistory: [],
    metadata: {},
    finalCandidates: [],
  };
  const listeners = input.listeners ?? {};

  // An iteration might generate and select new candidates. Therefore, we need
  // to keep track of the last selected candidates.
  let lastSelectedCandidateRefs: RPECandidateRef[] = state.candidates.map(
    candidate => candidateRefFromCandidate(candidate)
  );
  let stopReason = '';

  // notify
  await listeners.processStarted?.(state);

  // initialize state
  if (input.initializeState) {
    await listeners.startingStateInitialization?.();
    await input.initializeState(state);
  }
  
  // run the RPE process
  while (true) {
    // notify
    await listeners.iterationStarted?.(state.iteration);

    // initialize iteration
    const iteration: RPEIterationInProgress = state.iteration;
    const iterationCandidates = lastSelectedCandidateRefs.map(candidateRef => {
      return findCandidateById(state, candidateRef.candidateId);
    });

    // update state before iteration
    await input.updateStateBeforeIteration?.(state);

    // evaluate training candidates on the training dataset
    const {
      aggregatedEvaluations: trainingAggregatedEvaluations,
    } = await evaluateDataset(
      state,
      {
        candidates: iterationCandidates,
        executorOutputProcessor: input.executorOutputProcessor,
        executor: input.trainingExecutor,
        evaluatorParallelism:
          input.trainingEvaluatorParallelism ?? DEFAULT_EVALUATOR_PARALLELISM,
        evaluator: input.trainingEvaluator,
        aggregatorParallelism:
          input.aggregatorParallelism ?? DEFAULT_AGGREGATOR_PARALLELISM,
        aggregator: input.aggregator,
        generatingResponses: async () => {
          await listeners.generatingTrainingResponses?.(iteration);
        },
        responsesGenerated: async (responses: RPEExecutorResponse[]) => {
          iteration.trainingResponses = responses;
          await listeners.trainingResponsesGenerated?.(iteration);
        },
        evaluatingResponses: async () => {
          await listeners.evaluatingTrainingResponses?.(iteration);
        },
        responsesEvaluated: async (evaluations: EvaluatorCandidateOutput[]) => {
          iteration.trainingEvaluations = evaluations;
          await listeners.trainingResponsesEvaluated?.(iteration);
        },
        aggregatedEvaluations: async () => {
          await listeners.aggregatingTrainingEvaluations?.(iteration);
        },
        evaluationsAggregated: async (
          aggregatedEvaluations: RPEAggregatorOutput[],
        ) => {
          iteration.trainingAggregatedEvaluations = aggregatedEvaluations;
          await listeners.trainingEvaluationsAggregated?.(iteration);
        },
      },
    );

    // analyze training aggregated evaluations
    await listeners.analyzingTrainingEvaluations?.(iteration);
    const trainingAnalyses = await analyzeAggregatedEvaluations(
      state,
      trainingAggregatedEvaluations,
      input.analyzer,
      input.analyzerParallelism,
    );
    iteration.trainingAnalyses = trainingAnalyses;
    await listeners.trainingEvaluationsAnalyzed?.(iteration);

    // generate candidates
    await listeners.generatingCandidates?.(iteration);
    const { candidates: generatedCandidates } = await generateCandidates(
      state,
      input.candidateGenerator,
    );
    await listeners.candidatesGenerated?.(iteration);

    // validate and evaluate candidates if there are any
    if (generatedCandidates.length > 0) {
      // keep generated candidates
      state.candidates.push(
        ...generatedCandidates.map(candidate => candidate.candidate),
      );

      // validate candidates
      const { validCandidates } = await validateCandidates(
        state,
        {
          candidates: generatedCandidates,
          candidateValidator: input.candidateValidator,
          parallelism: input.candidateValidatorParallelism,
          validatingCandidates: async () => {
            await listeners.validatingCandidates?.(iteration);
          },
          candidatesValidated: async (
            validCandidates: RPECandidateGeneratorCandidate[],
            rejectedCandidates: RPERejectedCandidateRef[],
          ) => {
            // valid (not rejected) candidates
            iteration.validCandidates = validCandidates.map(
              toCandidateGeneratorOutputCandidate,
            );

            // rejected candidates
            iteration.rejectedCandidates = rejectedCandidates.map(rejectedCandidate => {
              const generatedCandidate = generatedCandidates.find(generatedCandidate => {
                return generatedCandidate.candidate.candidateId ===
                  rejectedCandidate.candidateRef.candidateId;
              });
              if (!generatedCandidate) {
                throw new InternalToorError(
                  `Generated candidate not found for rejected candidate ` +
                  `${ToorError.quote(rejectedCandidate.candidateRef.candidateId)}`,
                );
              }
              return {
                candidate: toCandidateGeneratorOutputCandidate(generatedCandidate),
                reason: rejectedCandidate.reason,
              };
            });

            await listeners.candidatesValidated?.(iteration);
          },
        },
      );

      // evaluate candidates on the validation dataset
      const {
        aggregatedEvaluations: candidateAggregatedEvaluations
      } = await evaluateDataset(
        state,
        {
          candidates: validCandidates.map(candidate => candidate.candidate),
          ...buildInputForDatasetEvaluation(input),
          generatingResponses: async () => {
            await listeners.generatingValidationResponses?.(iteration);
          },
          responsesGenerated: async (responses: RPEExecutorResponse[]) => {
            iteration.candidateResponses = responses;
            await listeners.validationResponsesGenerated?.(iteration);
          },
          evaluatingResponses: async () => {
            await listeners.evaluatingValidationResponses?.(iteration);
          },
          responsesEvaluated: async (
            evaluations: EvaluatorCandidateOutput[],
          ) => {
            iteration.candidateEvaluations = evaluations;
            await listeners.validationResponsesEvaluated?.(iteration);
          },
          aggregatedEvaluations: async () => {
            await listeners.aggregatingValidationEvaluations?.(iteration);
          },
          evaluationsAggregated: async (
            aggregatedEvaluations: RPEAggregatorOutput[],
          ) => {
            iteration.candidateAggregatedEvaluations = aggregatedEvaluations;
            await listeners.validationEvaluationsAggregated?.(iteration);
          },
        },
      );
      state.aggregatedEvaluations.push(...candidateAggregatedEvaluations);

      // select candidates
      await listeners.selectingCandidates?.(iteration);
      const {
        candidateRefs: selectedCandidateRefs,
      } = await input.candidateSelector.run(state, {});
      iteration.selectedCandidateRefs = selectedCandidateRefs;
      lastSelectedCandidateRefs = selectedCandidateRefs;
      await listeners.candidatesSelected?.(iteration);
    }

    // update history
    const completedIteration = iteration as RPEIteration;
    state.iterationHistory.push(completedIteration);

    // notify
    await listeners.iterationCompleted?.(completedIteration);

    // should stop?
    const shouldStopAfterIteration = await input.stopAfterIteration(state);
    if (shouldStopAfterIteration.stop) {
      stopReason = shouldStopAfterIteration.stopReason;
      break;
    }

    // update state after iteration
    await input.updateStateAfterIteration?.(state);

    // update iteration
    state.iterationNo++;
    state.iteration = {
      iterationNo: state.iterationNo,
      candidateRefs: iteration.selectedCandidateRefs,
    };
  }

  // populate final candidates
  await populateFinalCandidates(state, input.finalCandidateSelector);

  // update state on finish
  await input.updateStateOnFinish?.(state);

  // build insights
  const insights: RPEInsights = {
    dataset: input.dataset,
    candidates: state.candidates,
    aggregatedEvaluations: state.aggregatedEvaluations,
    stopReason,
    iterationHistory: state.iterationHistory,
    finalCandidates: state.finalCandidates,
    info: await buildRPEInsightsInfo(input),
  };

  // notify
  await listeners.processCompleted?.(insights);

  return {
    finalCandidates: state.finalCandidates,
    insights,
  };
}

async function populateFinalCandidates(
  state: RPEState,
  candidateSelector: RPECandidateSelector,
): Promise<void> {
  // select
  const { candidateRefs } = await candidateSelector.run(state, {});
  const finalCandidates = candidateRefs.map(candidateRef => {
    return {
      candidateRef,
    };
  });

  // populate
  state.finalCandidates.push(...finalCandidates);
}