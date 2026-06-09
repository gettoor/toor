import { LLMUsage } from '../llm/index.js';

/**
 * Model parameters for the LLM-as-a-judge.
 * @category LLM-as-a-judge
 */
export interface ModelParameters {
  /**
   * The temperature to use for the model.
   */
  temperature?: number;
}

/**
 * Output for the LLM-as-a-judge.
 * @category LLM-as-a-judge
 */
export interface Output<TResult> {
  /**
   * The result of the LLM-as-a-judge.
   */
  result: TResult;

  /**
   * The reasoning for the LLM-as-a-judge.
   */
  reasoning: string;

  /**
   * The usage for the LLM-as-a-judge.
   */
  usage: LLMUsage;
}