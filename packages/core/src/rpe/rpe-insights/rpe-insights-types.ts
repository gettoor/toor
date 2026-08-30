import { RPEExecutorInfo } from '../rpe-executor/index.js';
import { RPEEvaluatorInfo } from '../rpe-evaluator/index.js';
import { RPEPrompt } from '../rpe-prompt/index.js';
import { RPEAggregatorInfo } from '../rpe-aggregator/index.js';
import { RPEAnalyzerInfo } from '../rpe-analyzer/index.js';
import { RPEPromptGeneratorInfo } from '../rpe-prompt-generator/index.js';
import { RPEPromptSelectorInfo } from '../rpe-prompt-selector/index.js';
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
   * Information about the prompt generator used for the RPE process.
   */
  promptGeneratorInfo: RPEPromptGeneratorInfo;

  /**
   * Information about the prompt selector used for the RPE process.
   */
  promptSelectorInfo: RPEPromptSelectorInfo;
}

/**
 * Insights from an RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEInsights {
  /**
   * All the prompts from an RPE process.
   */
  prompts: RPEPrompt[];

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