import { RPEPrompt } from '../rpe-prompt/index.js';
import { RPEExecutorOutput } from '../rpe-executor/index.js';
import { EvaluatorPromptOutput } from '../evaluator-types.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import { RPEPromptGeneratorOutput } from '../rpe-prompt-generator/index.js';

/**
 * Represents a completed iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEIteration {
  /**
   * The prompts evaluated in the current iteration.
   */
  prompts: RPEPrompt[];
  
  /**
   * The responses generated for the prompts in the current iteration.
   */
  responses: RPEExecutorOutput[];

  /**
   * The evaluations of the responses in the current iteration.
   */
  evaluations: EvaluatorPromptOutput[];

  /**
   * The aggregated evaluations of the responses in the current iteration.
   */
  aggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * The analyses of the aggregated evaluations in the current iteration.
   */
  analyses: RPEAnalyzerOutput[];

  /**
   * The candidates generated for the prompts in the current iteration.
   */
  candidates: RPEPromptGeneratorOutput[];

  /**
   * The responses generated for the candidates in the current iteration.
   */
  candidateResponses: RPEExecutorOutput[];

  /**
   * The evaluations of the candidate responses in the current iteration. 
   */
  candidateEvaluations: EvaluatorPromptOutput[];

  /**
   * The aggregated evaluations of the candidate responses
   * in the current iteration.
   */
  candidateAggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * The prompts selected for the next iteration.
   */
  selectedPrompts: RPEPrompt[];
}

/**
 * Represents an in-progress iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export type RPEIterationInProgress = Partial<RPEIteration>;

/**
 * State of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEState {
  /**
   * The prompts evaluated in the current iteration.
   */
  prompts: RPEPrompt[];

  /**
   * The current iteration of the RPE process.
   */
  iteration: RPEIterationInProgress;

  /**
   * The current iteration number of the RPE process (starting from 0).
   */
  iterationNo: number;

  /**
   * The history of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];
}