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
import { buildRPEInsightsInfo } from '../rpe-insights/index.js';
import { RPEInput, RPEOutput } from './rpe-types.js';
import { RPECandidateSelector } from '../rpe-candidate-selector/index.js';
import {
  buildInputForDatasetEvaluation,
  evaluateDataset,
} from './dataset-evaluator.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { analyzeAggregatedEvaluations } from './analyzer.js';
import { generateCandidates } from './candidate-generator.js';

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
    iterationNo: 0,
    iteration: {
      iterationNo: 0,
      candidateRefs: input.seed.map(candidate => {
        return candidateRefFromCandidate(candidate);
      }),
    },
    iterationHistory: [],
    metadata: {},
    finalCandidates: [],
  };

  // An iteration might generate and select new candidates. Therefore, we need
  // to keep track of the last selected candidates.
  let lastSelectedCandidateRefs: RPECandidateRef[] = state.candidates.map(
    candidate => candidateRefFromCandidate(candidate)
  );
  let stopReason = '';

  // initialize state
  await input.initializeState?.(state);
  
  // run the RPE process
  while (true) {
    console.log('iteration', state.iterationNo);

    const iteration: RPEIterationInProgress = state.iteration;
    const iterationCandidates = lastSelectedCandidateRefs.map(candidateRef => {
      return findCandidateById(state, candidateRef.candidateId);
    });

    // update state before iteration
    await input.updateStateBeforeIteration?.(state);

    // evaluate training candidates on the training dataset
    const {
      responses: trainingResponses,
      evaluations: trainingEvaluations,
      aggregatedEvaluations: trainingAggregatedEvaluations,
    } = await evaluateDataset(
      state,
      {
        candidates: iterationCandidates,
        executor: input.trainingExecutor,
        evaluatorParallelism:
          input.trainingEvaluatorParallelism ?? DEFAULT_EVALUATOR_PARALLELISM,
        evaluator: input.trainingEvaluator,
        aggregatorParallelism:
          input.aggregatorParallelism ?? DEFAULT_AGGREGATOR_PARALLELISM,
        aggregator: input.aggregator,
      },
    );
    iteration.trainingResponses = trainingResponses;
    iteration.trainingEvaluations = trainingEvaluations;
    iteration.trainingAggregatedEvaluations = trainingAggregatedEvaluations;

    // analyze training aggregated evaluations
    const trainingAnalyses = await analyzeAggregatedEvaluations(
      state,
      trainingAggregatedEvaluations,
      input.analyzer,
      input.analyzerParallelism,
    );
    iteration.trainingAnalyses = trainingAnalyses;

    // generate candidates
    const { candidates: generatedCandidates } = await generateCandidates(
      state,
      input.candidateGenerator,
    );

    // evaluate candidates if there are any
    if (generatedCandidates.length > 0) {
      // keep generated candidates
      iteration.generatedCandidates = generatedCandidates.map(
        generatedCandidate => {
          const { candidate, ...description } = generatedCandidate;
          return {
            candidateRef: candidateRefFromCandidate(candidate),
            ...description,
          };
        },
      );
      state.candidates.push(
        ...generatedCandidates.map(candidate => candidate.candidate),
      );

      // evaluate candidates on the validation dataset
      const {
        responses: candidateResponses,
        evaluations: candidateEvaluations,
        aggregatedEvaluations: candidateAggregatedEvaluations
      } = await evaluateDataset(
        state,
        {
          candidates: generatedCandidates.map(candidate => candidate.candidate),
          ...buildInputForDatasetEvaluation(input),
        },
      );
      iteration.candidateResponses = candidateResponses;
      iteration.candidateEvaluations = candidateEvaluations;
      iteration.candidateAggregatedEvaluations = candidateAggregatedEvaluations;
      state.aggregatedEvaluations.push(...candidateAggregatedEvaluations);

      // select candidates
      const {
        candidateRefs: selectedCandidateRefs,
      } = await input.candidateSelector.run(state, {});
      iteration.selectedCandidateRefs = selectedCandidateRefs;
      lastSelectedCandidateRefs = selectedCandidateRefs;
    }

    // update history
    state.iterationHistory.push(iteration as RPEIteration);

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

  return {
    candidates: lastSelectedCandidateRefs.map(candidateRef => {
      return findCandidateById(state, candidateRef.candidateId);
    }),
    insights: {
      dataset: input.dataset,
      candidates: state.candidates,
      aggregatedEvaluations: state.aggregatedEvaluations,
      stopReason,
      iterationHistory: state.iterationHistory,
      finalCandidates: state.finalCandidates,
      info: await buildRPEInsightsInfo(input),
    },
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