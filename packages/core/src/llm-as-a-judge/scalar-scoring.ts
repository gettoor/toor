import { ScalarScoringScale } from './scalar-types.js';

/**
 * Coarse-grained scale (1-3) for the scalar evaluation.
 * @category LLM-as-a-judge
 * @see {@link scalar}
 */
export const SCALAR_SCORING_1_3: ScalarScoringScale = {
  min: 1,
  max: 3,
  prompt: `
1 = Does not satisfy the evaluation prompt; major issues or missing requirements
2 = Partially satisfies the evaluation prompt; significant gaps or inaccuracies
3 = Fully satisfies the evaluation prompt; correct and complete
  `,
};

/**
 * Lickert scale (1-5) for the scalar evaluation.
 * @category LLM-as-a-judge
 * @see {@link scalar}
 */
export const SCALAR_SCORING_1_5: ScalarScoringScale = {
  min: 1,
  max: 5,
  prompt: `
1 = Completely incorrect or irrelevant
2 = Mostly incorrect; minimal alignment with the prompt
3 = Partially correct; notable gaps or errors
4 = Mostly correct; minor issues or omissions
5 = Fully correct, complete, and aligned with the prompt
`,
};

/**
 * Fine-grained scale (1-10) for the scalar evaluation.
 * @category LLM-as-a-judge
 * @see {@link scalar}
 */
export const SCALAR_SCORING_1_10: ScalarScoringScale = {
  min: 1,
  max: 10,
  prompt: `
1-2 = Completely incorrect or irrelevant
3-4 = Mostly incorrect; major misunderstandings
5-6 = Partially correct; significant gaps or errors
7-8 = Mostly correct; minor issues or omissions
9 = Almost perfect; negligible issues
10 = Fully correct, precise, and complete
`,
};

/**
 * The default scoring scale for the scalar evaluation.
 * @category LLM-as-a-judge
 * @see {@link scalar}
 * @see {@link SCALAR_SCORING_1_5}
 */
export const SCALAR_SCORING_DEFAULT = SCALAR_SCORING_1_5;