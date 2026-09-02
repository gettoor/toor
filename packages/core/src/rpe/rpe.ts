import { candidateRefFromCandidate } from './rpe-candidate/index.js';
import { 
  findCandidateById,
  RPEIteration,
  RPEIterationInProgress,
  RPEState,
} from './rpe-state/index.js';
import { RPEInsightsInfo } from './rpe-insights/index.js';
import { RPEInput, RPEOutput } from './rpe-types.js';
import { generateResponses } from './executor.js';
import { evaluateCandidateResponses } from './evaluator.js';
import { aggregateEvaluations } from './aggregator.js';
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
    candidates: [...input.seed],
    iterationNo: 0,
    iteration: {
      candidateRefs: input.seed.map(candidate => {
        return candidateRefFromCandidate(candidate);
      }),
    },
    iterationHistory: [],
  };
  let stopReason = '';
  
  while (true) {
    const iteration: RPEIterationInProgress = state.iteration;
    const iterationCandidates = iteration.candidateRefs.map(candidateRef => {
      return findCandidateById(state, candidateRef.candidateId);
    });

    // generate responses
    const { outputs: responses } = await generateResponses(
      iterationCandidates,
      input.trainingDataset,
      input.executor,
    );
    iteration.responses = responses;

    // evaluate responses
    const { evaluations } = await evaluateCandidateResponses(
      state,
      responses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    iteration.evaluations = evaluations;

    // aggregate evaluations
    const aggregatedEvaluations = await aggregateEvaluations(
      state,
      evaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    iteration.aggregatedEvaluations = aggregatedEvaluations;

    // should stop?
    const shouldStopAfterEvaluation = await input.stopAfterEvaluation?.(state);
    if (shouldStopAfterEvaluation?.stop) {
      stopReason = shouldStopAfterEvaluation.stopReason;
      break;
    }

    // analyze aggregated evaluations
    const analyses = await analyzeAggregatedEvaluations(
      state,
      aggregatedEvaluations,
      input.analyzer,
      input.analyzerParallelism,
    );
    iteration.analyses = analyses;

    // generate candidates
    const { candidates } = await generateCandidates(
      state,
      input.candidateGenerator,
    );
    iteration.candidates = candidates.map(candidate => ({
      candidateRef: candidateRefFromCandidate(candidate.candidate),
      changes: candidate.changes,
      usage: candidate.usage,
    }));
    state.candidates.push(...candidates.map(candidate => candidate.candidate));

    // generate candidate responses
    const { outputs: candidateResponses } = await generateResponses(
      candidates.map(candidate => candidate.candidate),
      input.trainingDataset,
      input.executor,
    );
    iteration.candidateResponses = candidateResponses;

    // evaluate candidates
    const {
      evaluations: candidateEvaluations,
    } = await evaluateCandidateResponses(
      state,
      candidateResponses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    iteration.candidateEvaluations = candidateEvaluations;

    // aggregate candidate evaluations
    const candidateAggregatedEvaluations = await aggregateEvaluations(
      state,
      candidateEvaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    iteration.candidateAggregatedEvaluations = candidateAggregatedEvaluations;

    // select candidates
    const { 
      candidateRefs: selectedCandidateRefs,
    } = await input.candidateSelector.run(state, {});
    iteration.selectedCandidateRefs = selectedCandidateRefs;

    // update history
    state.iterationHistory.push(iteration as RPEIteration);

    // should stop?
    const shouldStopAfterIteration = await input.stopAfterIteration(state);
    if (shouldStopAfterIteration.stop) {
      stopReason = shouldStopAfterIteration.stopReason;
      break;
    }

    state.iterationNo++;
    state.iteration = {
      candidateRefs: selectedCandidateRefs,
    };
  }

  return {
    candidates: state.iteration.candidateRefs.map(candidateRef => {
      return findCandidateById(state, candidateRef.candidateId);
    }),
    insights: {
      candidates: state.candidates,
      stopReason,
      iterationHistory: state.iterationHistory,
      info: await buildRPEInsightsInfo(input),
    },
  };
}

async function buildRPEInsightsInfo(
  input: RPEInput,
): Promise<RPEInsightsInfo> {
  return {
    executorInfo: await input.executor.getInfo(),
    evaluatorInfo: await input.evaluator.getInfo(),
    aggregatorInfo: await input.aggregator.getInfo(),
    analyzerInfo: await input.analyzer.getInfo(),
    candidateGeneratorInfo: await input.candidateGenerator.getInfo(),
    candidateSelectorInfo: await input.candidateSelector.getInfo(),
  };
}