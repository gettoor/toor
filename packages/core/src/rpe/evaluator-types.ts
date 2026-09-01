import { RPEEvaluatorOutput } from './rpe-evaluator/index.js';
import { RPECandidateRef } from './rpe-candidate/index.js';

/**
 * Output for the RPE evaluator for a single candidate.
 * @category Reflective Prompt Evolution
 */
export interface EvaluatorCandidateOutput {
  /**
   * Reference to the candidate that was evaluated.
   */
  candidateRef: RPECandidateRef;

  /**
   * Evaluator outputs for the candidate.
   */
  evaluatorOutputs: RPEEvaluatorOutput[];
}

/**
 * Output for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface EvaluatorOutput {
  /**
   * Evaluations for the candidates.
   */
  evaluations: EvaluatorCandidateOutput[];
}