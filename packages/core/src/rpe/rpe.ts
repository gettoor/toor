import { RPEIteration, RPEState } from './rpe-state/index.js';
import { RPEInput, RPEOutput } from './rpe-types.js';
import { generateResponses } from './executor.js';
import { evaluateResponses } from './evaluator.js';
import { aggregateEvaluations } from './aggregator.js';
import { analyzeAggregatedEvaluations } from './analyzer.js';
import { generatePrompts } from './prompt-generator.js';

/**
 * Runs the Reflective Prompt Evolution (RPE) process.
 * @param input - Input for the RPE process.
 * @returns A promise that resolves when the RPE process is complete.
 * @category Reflective Prompt Evolution
 */
export async function optimize(
  input: RPEInput,
): Promise<RPEOutput> {
  const state: RPEState = {
    prompts: input.seed,
    iteration: {},
    iterationNo: 0,
    iterationHistory: [],
  };
  let stopReason = '';
  
  while (true) {
    // start new iteration
    state.iteration = {};

    // generate responses
    const { outputs: responses } = await generateResponses(
      state.prompts,
      input.trainingDataset,
      input.executor,
    );
    state.iteration.responses = responses;

    // evaluate responses
    const { evaluations } = await evaluateResponses(
      responses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    state.iteration.evaluations = evaluations;
    console.log('------ evaluations ------');
    console.log(JSON.stringify(evaluations, null, 2));

    // should stop?
    const shouldStopAfterEvaluation = await input.stopAfterEvaluation?.(state);
    if (shouldStopAfterEvaluation?.stop) {
      stopReason = shouldStopAfterEvaluation.stopReason;
      break;
    }

    // aggregate evaluations
    const aggregatedEvaluations = await aggregateEvaluations(
      evaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    state.iteration.aggregatedEvaluations = aggregatedEvaluations;
    console.log('------ aggregated evaluations ------');
    console.log(JSON.stringify(aggregatedEvaluations, null, 2));

    // analyze aggregated evaluations
    const analyses = await analyzeAggregatedEvaluations(
      aggregatedEvaluations,
      input.analyzer,
      input.analyzerParallelism,
    );
    state.iteration.analyses = analyses;
    console.log('------ analyses ------');
    console.log(JSON.stringify(analyses, null, 2));

    // generate prompt
    const { candidates } = await generatePrompts(
      aggregatedEvaluations,
      analyses,
      input.promptGenerator,
      input.promptGeneratorParallelism,
    );
    state.iteration.candidates = candidates;
    console.log('------ candidates ------');
    console.log(JSON.stringify({ candidates }, null, 2));

    // generate candidate responses
    const { outputs: candidateResponses } = await generateResponses(
      candidates.map(candidate => candidate.prompt),
      input.trainingDataset,
      input.executor,
    );
    state.iteration.candidateResponses = candidateResponses;
    console.log('------ candidate responses ------');
    console.log(JSON.stringify(candidateResponses, null, 2));

    // evaluate candidates
    const { evaluations: candidateEvaluations } = await evaluateResponses(
      candidateResponses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    state.iteration.candidateEvaluations = candidateEvaluations;
    console.log('------ candidate evaluations ------');
    console.log(JSON.stringify(candidateEvaluations, null, 2));

    // aggregate candidate evaluations
    const candidateAggregatedEvaluations = await aggregateEvaluations(
      candidateEvaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    state.iteration.candidateAggregatedEvaluations = candidateAggregatedEvaluations;
    console.log('------ candidate aggregated evaluations ------');
    console.log(JSON.stringify(candidateAggregatedEvaluations, null, 2));

    // select prompts
    const { prompts } = await input.promptSelector({ state });
    state.prompts = prompts;
    console.log('------ prompts ------');
    console.log(JSON.stringify(prompts, null, 2));

    // should stop?
    const shouldStopAfterIteration = await input.stopAfterIteration(state);
    if (shouldStopAfterIteration.stop) {
      stopReason = shouldStopAfterIteration.stopReason;
      break;
    }

    state.iterationNo++;
    state.iterationHistory.push(state.iteration as RPEIteration);
  }

  return {
    prompts: state.prompts,
    stopReason,
  };
}