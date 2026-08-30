import { LLMUsage, MetricResult } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
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

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Info of the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorInfo {
  /**
   * Name of the evaluator.
   */
  name: string;

  /**
   * Properties of the evaluator.
   */
  properties?: RPEProperties;
}

/**
 * An evaluator which takes a prompt and produces information passed
 * to a failure analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluator {
  /**
   * Evaluate a prompt.
   * @param input - Input for the evaluator.
   * @returns Evaluator output.
   */
  run(input: RPEEvaluatorInput): Promise<RPEEvaluatorOutput>;

  /**
   * Get the info of the evaluator.
   * @returns Info of the evaluator.
   */
  getInfo(): Promise<RPEEvaluatorInfo>;
}