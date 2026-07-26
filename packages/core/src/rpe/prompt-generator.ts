import { InternalToorError, ToorError } from '../errors/index.js';
import { runParallelBatchesOrThrow } from '../concurrency/index.js';
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
  aggregations: RPEAggregatorOutput[],
  analyses: RPEAnalyzerOutput[],
  generator: RPEPromptGenerator,
  parallelism?: number,
): Promise<PromptGeneratorOutput> {
  parallelism = parallelism ?? DEFAULT_PROMPT_GENERATOR_PARALLELISM;

  // tasks
  const tasks = aggregations.map(aggregation => {
    const analysis = analyses.find(analysis => {
      return analysis.prompt.promptHash === aggregation.prompt.promptHash;
    });
    if (!analysis) {
      throw new InternalToorError(
        `Analysis not found for prompt during prompt generation: ` +
        `${ToorError.quote(aggregation.prompt.prompt)}`,
      );
    }
    return generator({
      prompt: aggregation.prompt,
      aggregation,
      analysis,
    });
  });

  // run tasks in parallel
  const outputs = await runParallelBatchesOrThrow(tasks, parallelism);
  return { candidates: outputs };
}