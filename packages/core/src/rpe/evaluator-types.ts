import { RPEEvaluatorOutput } from './rpe-evaluator/index.js';
import { RPEPromptRef } from './rpe-prompt/index.js';

/**
 * Output for the RPE evaluator for a single prompt.
 * @category Reflective Prompt Evolution
 */
export interface EvaluatorPromptOutput {
  /**
   * Reference to the prompt that was evaluated.
   */
  promptRef: RPEPromptRef;

  /**
   * Evaluator outputs for the prompt.
   */
  evaluatorOutputs: RPEEvaluatorOutput[];
}

/**
 * Output for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface EvaluatorOutput {
  /**
   * Evaluations for the prompts.
   */
  evaluations: EvaluatorPromptOutput[];
}