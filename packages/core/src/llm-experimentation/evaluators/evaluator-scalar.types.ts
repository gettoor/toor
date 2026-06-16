import { ScalarScoringScale } from '../../llm-as-a-judge/index.js';

/**
 * Input for the scalar evaluator.
 * @category Experimentation
 */
export interface EvaluatorScalarInput {
  /**
   * The scoring scale to use for the evaluation.
   */
  scoringScale: ScalarScoringScale;

  /**
   * The prompt to use for the evaluation.
   */
  evalPrompt?: string;
}