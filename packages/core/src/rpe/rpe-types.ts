import { RPECandidate } from './rpe-candidate/index.js';
import { RPEDataset } from './rpe-dataset/index.js';
import { RPEExecutor } from './rpe-executor/index.js';
import { RPEEvaluator } from './rpe-evaluator/index.js';
import { RPEAggregator } from './rpe-aggregator/index.js';
import { RPEAnalyzer } from './rpe-analyzer/index.js';
import { RPECandidateGenerator } from './rpe-candidate-generator/index.js';
import { RPECandidateSelector } from './rpe-candidate-selector/index.js';
import { RPEStopFunc } from './rpe-stop/index.js';
import { RPEState } from './rpe-state/index.js';
import { RPEInsights } from './rpe-insights/index.js';

/**
 * Function to update the RPE state (typically metadata).
 * @category Reflective Prompt Evolution
 */
export type RPEUpdateStateFunc = (state: RPEState) => Promise<void>;

/**
 * Reflective Prompt Evolution (RPE) settings and configuration.
 * @category Reflective Prompt Evolution
 */
export interface RPEInput {
  /**
   * The initial candidates (seed candidates).
   */
  seed: RPECandidate[];

  /**
   * Executor to use for the RPE. An executor is responsible for generating
   * responses to the candidates and dataset entries.
   * @see {@link llmRPEExecutor}
   */
  executor: RPEExecutor;

  /**
   * Evaluator to use for the RPE. An evaluator is responsible for evaluating
   * the responses.
   */
  evaluator: RPEEvaluator;

  /**
   * Number of concurrent evaluators to use. Defaults to 1 that means
   * that the evaluators are run sequentially.
   */
  evaluatorParallelism?: number;

  /**
   * Function to determine if the optimization should stop after evaluating
   * a set of responses.
   * @see {@link RPEState}
   */
  stopAfterEvaluation?: RPEStopFunc;

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
   * Executor to use for the generated candidates. Defaults to the same executor
   * as the one used for the original candidates.
   */
  candidateExecutor?: RPEExecutor;

  /**
   * Evaluator to use for the generated candidate responses. Defaults to
   * the same evaluator as the one used for the original candidate responses.
   */
  candidateEvaluator?: RPEEvaluator;

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