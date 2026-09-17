import { RPEDataset } from '../rpe-dataset/index.js';
import { RPECandidate } from '../rpe-candidate/index.js';
import { RPEExecutor } from '../rpe-executor/index.js';
import { RPEEvaluator } from '../rpe-evaluator/index.js';
import { RPEAggregator } from '../rpe-aggregator/index.js';
import { RPEAnalyzer } from '../rpe-analyzer/index.js';
import { RPECandidateGenerator } from '../rpe-candidate-generator/index.js';
import { RPECandidateSelector } from '../rpe-candidate-selector/index.js';
import { RPEStopFunc } from '../rpe-stop/index.js';
import { RPEUpdateStateFunc } from '../rpe-state/index.js';
import { RPEInsights } from '../rpe-insights/index.js';

/**
 * Reflective Prompt Evolution (RPE) settings and configuration.
 * @category Reflective Prompt Evolution
 */
export interface RPEInput {
  /**
   * Initial candidates (seed candidates).
   */
  seed: RPECandidate[];

  /**
   * Dataset with all the dataset entries used in the RPE process.
   */
  dataset: RPEDataset;

  /**
   * Executor to use for the RPE. An executor is responsible for generating
   * responses to the candidates and dataset entries.
   */
  trainingExecutor: RPEExecutor;

  /**
   * Evaluator to use for the RPE. An evaluator is responsible for evaluating
   * the responses.
   */
  trainingEvaluator: RPEEvaluator;

  /**
   * Number of concurrent evaluators to use. Defaults to 1 that means
   * that the evaluators are run sequentially.
   */
  trainingEvaluatorParallelism?: number;

  /**
   * Number of concurrent aggregators to use. Defaults to 1 that means
   * that the aggregators are run sequentially.
   */
  aggregatorParallelism?: number;

  /**
   * Aggregator to use for the RPE. An aggregator is responsible for aggregating
   * the evaluations of a single candidate into a single evaluation.
   */
  aggregator: RPEAggregator;

  /**
   * Number of concurrent analyzers to use. Defaults to 1 that means
   * that the analyzers are run sequentially.
   */
  analyzerParallelism?: number;

  /**
   * Analyzer to use for the RPE. An analyzer is responsible for analyzing
   * the aggregated evaluations of a single candidate into a single analysis.
   */
  analyzer: RPEAnalyzer;

  /**
   * Candidate generator to use for the RPE. A candidate generator is
   * responsible for generating new candidates based on the aggregated
   * evaluations and analyses.
   */
  candidateGenerator: RPECandidateGenerator;

  /**
   * Executor to use for the generated candidates. Candidate must
   * never be evaluated against the training dataset not to overfit.
   */
  candidateExecutor: RPEExecutor;

  /**
   * Evaluator to use for the generated candidate responses. Candidate must
   * never be evaluated against the training dataset not to overfit.
   */
  candidateEvaluator: RPEEvaluator;

  /**
   * Number of concurrent candidate evaluators to use. Defaults to the same
   * as the one used for the original evaluators.
   */
  candidateEvaluatorParallelism?: number;

  /**
   * Aggregator to use for the generated candidate evaluations. Defaults to
   * the same aggregator as the one used for the original candidate evaluations.
   */
  candidateAggregator?: RPEAggregator;

  /**
   * Number of concurrent candidate aggregators to use. Defaults to the same
   * as the one used for the original aggregators.
   */
  candidateAggregatorParallelism?: number;

  /**
   * Candidate selector to use for the RPE. A candidate selector is responsible
   * for selecting the candidates to be used in the next iteration.
   */
  candidateSelector: RPECandidateSelector;

  /**
   * Function to determine if the optimization should stop after an iteration.
   */
  stopAfterIteration: RPEStopFunc;

  /**
   * Function to initialize the metadata of the RPE state.
   */
  initializeState?: RPEUpdateStateFunc;

  /**
   * Function to update the metadata of the RPE state after an iteration.
   */
  updateStateBeforeIteration?: RPEUpdateStateFunc;

  /**
   * Function to update the metadata of the RPE state after an iteration.
   */
  updateStateAfterIteration?: RPEUpdateStateFunc;

  /**
   * Function to update the metadata of the RPE state after
   * the RPE process finishes.
   */
  updateStateOnFinish?: RPEUpdateStateFunc;
}

/**
 * Output of an RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEOutput {
  /**
   * The final candidates.
   */
  candidates: RPECandidate[];

  /**
   * Insights from the RPE process.
   */
  insights: RPEInsights;
}