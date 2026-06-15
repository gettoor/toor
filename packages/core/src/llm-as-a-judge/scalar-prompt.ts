/**
 * The default prompt to use for the scalar evaluation.
 * It takes the parameters (each in double curly braces):
 * - `<<prompt>>`: The prompt to evaluate.
 * - `<<response>>`: The response to evaluate.
 * - `<<scoring_scale>>`: The scoring scale to use.
 * @category LLM-as-a-judge
 */
export const SCALAR_PROMPT = `
You are a strict evaluator.

Your task is to assess how well the RESPONSE satisfies the PROMPT using the provided SCORING_SCALE.

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE:
<<scoring_scale>>

Evaluation Guidelines:

1. Focus only on whether the RESPONSE fulfills the intent and requirements of the PROMPT.
2. Consider:
   - Absence of contradictions
<<metrics>>
3. Do not reward partially correct answers as fully correct.
4. Be strict and conservative in scoring.
5. Do not consider writing style unless explicitly required by the PROMPT.

Scoring Instructions:

- Assign a single numeric score based strictly on the SCORING_SCALE.
- The score must fall within the defined range.
- Use the full range when appropriate (avoid clustering in the middle without reason).
`;