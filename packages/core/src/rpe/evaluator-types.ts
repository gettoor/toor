import { RPEEvaluatorOutput } from './rpe-evaluator/index.js';
import { RPEPrompt } from './rpe-prompt/index.js';

/**
 * Output for the RPE evaluator for a single prompt.
 * @category Reflective Prompt Evolution
 */
export interface EvaluatorPromptOutput {
  /**
   * Prompt that was evaluated.
   */
  prompt: RPEPrompt;

  /**
   * Evaluations for the prompt.
   */
  evaluations: RPEEvaluatorOutput[];
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