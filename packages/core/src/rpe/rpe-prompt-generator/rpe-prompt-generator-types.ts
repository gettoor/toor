import { RPEPrompt } from '../rpe-prompt/index.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import { LLMUsage } from '../../llm/index.js';

/**
 * Input for the RPE prompt generator.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptGeneratorInput {
  /**
   * Original prompt.
   */
  prompt: RPEPrompt;

  /**
   * Aggregation of the evaluations.
   */
  aggregation: RPEAggregatorOutput;

  /**
   * Analysis of the prompt.
   */
  analysis: RPEAnalyzerOutput;
}

/**
 * Change made to the prompt.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptGeneratorChange {
  /**
   * Description of the change.
   */
  description: string;

  /**
   * Reasoning for the change.
   */
  reasoning: string;
}

/**
 * Output for the RPE prompt generator.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptGeneratorOutput {
  /**
   * New prompt.
   */
  prompt: Omit<RPEPrompt, 'promptId'>;

  /**
   * Changes made to the prompt.
   */
  changes: RPEPromptGeneratorChange[];

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Responsible for generating a new prompt based on the original prompt,
 * the aggregation of the evaluations and the analysis of the prompt.
 * @category Reflective Prompt Evolution
 */
export type RPEPromptGenerator = (
  input: RPEPromptGeneratorInput,
) => Promise<RPEPromptGeneratorOutput>;