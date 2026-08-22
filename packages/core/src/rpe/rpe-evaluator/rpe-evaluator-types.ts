import { MetricResult } from '../../llm/index.js';
import { RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPEPrompt, RPEPromptRef } from '../rpe-prompt/index.js';

/**
 * Input for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorInput {
  /**
   * Prompt to evaluate.
   */
  prompt: RPEPrompt;

  /**
   * Dataset entry used to generate the response.
   */
  datasetEntry: RPEDatasetEntry;

  /**
   * Response to evaluate.
   */
  response: string;

  /**
   * Expected response.
   */
  expectedResponse?: string;
}

/**
 * Output for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorOutput {
  /**
   * Reference to the prompt that was evaluated.
   */
  promptRef: RPEPromptRef;

  /**
   * Dataset entry used to generate the response.
   */
  datasetEntry: RPEDatasetEntry;

  /**
   * Response to evaluate.
   */
  response: string;

  /**
   * Score normalized to 0..1.
   */
  score: number;

  /**
   * Reasoning of the evaluation. Extremely important for the RPE process.
   * It can vary from a single sentence to a detailed explanation.
   */
  reasoning: string;

  /**
   * Metrics for the evaluation. Metric scores are normalized to 0..1.
   */
  metrics?: Record<string, MetricResult>;
}

/**
 * An evaluator which takes a prompt and produces information passed
 * to a failure analyzer.
 * @category Reflective Prompt Evolution
 */
export type RPEEvaluator = (
  input: RPEEvaluatorInput,
) => Promise<RPEEvaluatorOutput>;