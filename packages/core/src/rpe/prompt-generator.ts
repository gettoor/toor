import { InternalToorError, ToorError } from '../errors/index.js';
import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { findPromptById, RPEState } from './rpe-state/index.js';
import { RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from './rpe-analyzer/index.js';
import { RPEPromptGenerator } from './rpe-prompt-generator/index.js';
import { 
  DEFAULT_PROMPT_GENERATOR_PARALLELISM,
} from './prompt-generator-consts.js';
import { PromptGeneratorOutput } from './prompt-generator-types.js';

/**
 * Generates prompt candidates based on the original prompts,
 * the aggregations of the evaluations and the analyses of the prompts.
 * @category Reflective Prompt Evolution
 */
export async function generatePrompts(
  state: RPEState,
  aggregations: RPEAggregatorOutput[],
  analyses: RPEAnalyzerOutput[],
  generator: RPEPromptGenerator,
  parallelism?: number,
): Promise<PromptGeneratorOutput> {
  parallelism = parallelism ?? DEFAULT_PROMPT_GENERATOR_PARALLELISM;

  // tasks
  const tasks = aggregations.map(async (aggregation, index) => {
    const aggregationPromptId = aggregation.promptRef.promptId;

    // find analysis
    const analysis = analyses.find(analysis => {
      return analysis.promptRef.promptId === aggregationPromptId;
    });
    if (!analysis) {
      throw new InternalToorError(
        `Analysis not found for prompt during prompt generation: ` +
        `${ToorError.quote(aggregationPromptId)}`,
      );
    }

    // generate (candidate) prompt
    const { prompts } = await generator.run({
      prompt: findPromptById(state, aggregationPromptId),
      aggregation,
      analysis,
    });
    // return {
    //   ...output,
    //   prompt: {
    //     ...output.prompt,
    //     promptId: `i${state.iterationNo}p${index}`,
    //   },
    //   usage: output.usage,
    // }
    return prompts.map(prompt => ({
      prompt: {
        ...prompt.prompt,
        promptId: `i${state.iterationNo}p${index}`,
      },
      changes: prompt.changes,
      usage: prompt.usage,
    }));
  });

  // run tasks in parallel
  const outputs = await runParallelBatchesOrThrow(tasks, parallelism);
  return { candidates: outputs.flat() };
}