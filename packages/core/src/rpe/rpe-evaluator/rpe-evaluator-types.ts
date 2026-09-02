import { LLMUsage, MetricResult } from '../../llm/index.js';
import { RPEResponse } from '../rpe-core/index.js';
import { RPEProperties } from '../rpe-info/index.js';
import { RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPECandidate, RPECandidateRef } from '../rpe-candidate/index.js';

/**
 * Input for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorInput {
  /**
   * Candidate to evaluate.
   */
  candidate: RPECandidate;

  /**
   * Dataset entry used to generate the response.
   */
  datasetEntry: RPEDatasetEntry;

  /**
   * Response to evaluate.
   */
  response: RPEResponse;

  /**
   * Expected response.
   */
  expectedResponse?: RPEResponse;
}

/**
 * Output for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorOutput {
  /**
   * Reference to the candidate that was evaluated.
   */
  candidateRef: RPECandidateRef;

  /**
   * Dataset entry used to generate the response.
   */
  datasetEntry: RPEDatasetEntry;

  /**
   * Response to evaluate.
   */
  response: RPEResponse;

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
 * An evaluator which takes a candidate and produces information passed
 * to a failure analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluator {
  /**
   * Evaluate a candidate.
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