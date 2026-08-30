import { promptRefFromPrompt } from './rpe-prompt/index.js';
import { 
  findPromptById,
  RPEIteration,
  RPEIterationInProgress,
  RPEState,
} from './rpe-state/index.js';
import { RPEInsightsInfo } from './rpe-insights/index.js';
import { RPEInput, RPEOutput } from './rpe-types.js';
import { generateResponses } from './executor.js';
import { evaluateResponses } from './evaluator.js';
import { aggregateEvaluations } from './aggregator.js';
import { analyzeAggregatedEvaluations } from './analyzer.js';
import { generatePrompts } from './prompt-generator.js';

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
    prompts: [...input.seed],
    iterationNo: 0,
    iteration: {
      promptRefs: input.seed.map(prompt => promptRefFromPrompt(prompt)),
    },
    iterationHistory: [],
  };
  let stopReason = '';
  
  while (true) {
    const iteration: RPEIterationInProgress = state.iteration;
    const prompts = iteration.promptRefs.map(promptRef => {
      return findPromptById(state, promptRef.promptId);
    });

    // generate responses
    const { outputs: responses } = await generateResponses(
      prompts,
      input.trainingDataset,
      input.executor,
    );
    iteration.responses = responses;

    // evaluate responses
    const { evaluations } = await evaluateResponses(
      state,
      responses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    iteration.evaluations = evaluations;
    console.log('------ evaluations ------');
    console.log(JSON.stringify(evaluations, null, 2));

    // aggregate evaluations
    const aggregatedEvaluations = await aggregateEvaluations(
      state,
      evaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    iteration.aggregatedEvaluations = aggregatedEvaluations;
    console.log('------ aggregated evaluations ------');
    console.log(JSON.stringify(aggregatedEvaluations, null, 2));

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
    console.log('------ analyses ------');
    console.log(JSON.stringify(analyses, null, 2));

    // generate prompt
    const { candidates } = await generatePrompts(
      state,
      aggregatedEvaluations,
      analyses,
      input.promptGenerator,
      input.promptGeneratorParallelism,
    );
    iteration.candidates = candidates.map(candidate => ({
      promptRef: promptRefFromPrompt(candidate.prompt),
      changes: candidate.changes,
      usage: candidate.usage,
    }));
    state.prompts.push(...candidates.map(candidate => candidate.prompt));
    console.log('------ candidates ------');
    console.log(JSON.stringify({ candidates }, null, 2));

    // generate candidate responses
    const { outputs: candidateResponses } = await generateResponses(
      candidates.map(candidate => candidate.prompt),
      input.trainingDataset,
      input.executor,
    );
    iteration.candidateResponses = candidateResponses;
    console.log('------ candidate responses ------');
    console.log(JSON.stringify(candidateResponses, null, 2));

    // evaluate candidates
    const { evaluations: candidateEvaluations } = await evaluateResponses(
      state,
      candidateResponses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    iteration.candidateEvaluations = candidateEvaluations;
    console.log('------ candidate evaluations ------');
    console.log(JSON.stringify(candidateEvaluations, null, 2));

    // aggregate candidate evaluations
    const candidateAggregatedEvaluations = await aggregateEvaluations(
      state,
      candidateEvaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    iteration.candidateAggregatedEvaluations = candidateAggregatedEvaluations;
    console.log('------ candidate aggregated evaluations ------');
    console.log(JSON.stringify(candidateAggregatedEvaluations, null, 2));

    // select prompts
    const { 
      promptRefs: selectedPromptRefs,
    } = await input.promptSelector.run(state, {});
    iteration.selectedPromptRefs = selectedPromptRefs;
    console.log('------ prompts ------');
    console.log(JSON.stringify(selectedPromptRefs, null, 2));

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
      promptRefs: selectedPromptRefs,
    };
  }

  return {
    prompts: state.iteration.promptRefs.map(promptRef => {
      return findPromptById(state, promptRef.promptId);
    }),
    insights: {
      prompts: state.prompts,
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
    promptGeneratorInfo: await input.promptGenerator.getInfo(),
    promptSelectorInfo: await input.promptSelector.getInfo(),
  };
}