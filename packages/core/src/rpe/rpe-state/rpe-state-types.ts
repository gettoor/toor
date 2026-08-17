import { RPEPrompt, RPEPromptRef } from '../rpe-prompt/index.js';
import { RPEExecutorOutput } from '../rpe-executor/index.js';
import { EvaluatorPromptOutput } from '../evaluator-types.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import { PromptGeneratorCandidate } from '../prompt-generator-types.js';

/**
 * Represents a completed iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEIteration {
  /**
   * References to the prompts evaluated in the current iteration.
   */
  promptRefs: RPEPromptRef[];
  
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
  candidates: PromptGeneratorCandidate[];

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
   * References to the prompts selected for the next iteration.
   */
  selectedPromptRefs: RPEPromptRef[];
}

/**
 * Represents an in-progress iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export type RPEIterationInProgress =
  Partial<Omit<RPEIteration, 'promptRefs'>> &
  Pick<RPEIteration, 'promptRefs'>;

/**
 * State of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEState {
  /**
   * All the prompts from an RPE process.
   */
  prompts: RPEPrompt[];

  /**
   * The current iteration number of the RPE process (starting from 0).
   */
  iterationNo: number;

  /**
   * The current iteration of the RPE process.
   */
  iteration: RPEIterationInProgress;

  /**
   * The history of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];
}