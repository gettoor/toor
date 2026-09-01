import { RPEExecutorInfo } from '../rpe-executor/index.js';
import { RPEEvaluatorInfo } from '../rpe-evaluator/index.js';
import { RPECandidate } from '../rpe-candidate/index.js';
import { RPEAggregatorInfo } from '../rpe-aggregator/index.js';
import { RPEAnalyzerInfo } from '../rpe-analyzer/index.js';
import { RPECandidateGeneratorInfo } from '../rpe-candidate-generator/index.js';
import { RPECandidateSelectorInfo } from '../rpe-candidate-selector/index.js';
import { RPEIteration } from '../rpe-state/index.js';

/**
 * Information about the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEInsightsInfo {
  /**
   * Information about the executor used for the RPE process.
   */
  executorInfo: RPEExecutorInfo;

  /**
   * Information about the evaluator used for the RPE process.
   */
  evaluatorInfo: RPEEvaluatorInfo;

  /**
   * Information about the aggregator used for the RPE process.
   */
  aggregatorInfo: RPEAggregatorInfo;

  /**
   * Information about the analyzer used for the RPE process.
   */
  analyzerInfo: RPEAnalyzerInfo;

  /**
   * Information about the candidate generator used for the RPE process.
   */
  candidateGeneratorInfo: RPECandidateGeneratorInfo;

  /**
   * Information about the candidate selector used for the RPE process.
   */
  candidateSelectorInfo: RPECandidateSelectorInfo;
}

/**
 * Insights from an RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEInsights {
  /**
   * All the candidates from an RPE process.
   */
  candidates: RPECandidate[];

  /**
   * The current iteration of the RPE process.
   */
  stopReason: string;

  /**
   * The history of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];

  /**
   * Information about the RPE process.
   */
  info: RPEInsightsInfo;
}