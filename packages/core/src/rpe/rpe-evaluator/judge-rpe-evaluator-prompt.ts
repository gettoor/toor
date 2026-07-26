/**
 * The default prompt to use for the LLM-as-a-judge RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export const JUDGE_RPE_EVALUATOR_PROMPT = `
You are a strict evaluator.

Your task is to assess how well the RESPONSE matches the
EXPECTED_RESPONSE while also satisfying the PROMPT, using the provided
SCORING_SCALE.

The EXPECTED_RESPONSE is the canonical correct answer. Treat it as the
ground truth. Any deviation should be considered incorrect unless the
RESPONSE is factually equivalent, equally complete, and satisfies all
requirements of the PROMPT.

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE:
<<scoring_scale>>

EXPECTED_RESPONSE:
<<expected_response>>

Evaluation Guidelines:

1.  Use the EXPECTED_RESPONSE as the primary reference when evaluating the RESPONSE.
2.  The RESPONSE must satisfy both:
    -   the requirements of the PROMPT, and
    -   the exact content of the EXPECTED_RESPONSE.
3.  Compare the RESPONSE against the EXPECTED_RESPONSE for:
    -   correctness,
    -   completeness,
    -   absence of contradictions,
    -   absence of hallucinations,
    -   factual equivalence (not wording similarity).
<<metrics>>
4.  Do not infer missing information or assume omitted details are correct.
5.  Penalize:
    -   missing required information,
    -   incorrect information,
    -   contradictions,
    -   unsupported claims,
    -   additional incorrect or misleading information.
6.  Responses that are semantically equivalent to the EXPECTED_RESPONSE should receive the same score, even if phrased differently.
7.  Do not reward partially correct answers as fully correct.
8.  Be strict and conservative. If uncertain between two scores, assign the lower score.
9.  Ignore writing style, formatting, verbosity, and wording unless explicitly required by the PROMPT.

Scoring Instructions:

-   Assign exactly one numeric score from the SCORING_SCALE.
-   The score must fall within the defined range.
-   Reserve the highest score only for responses that are fully correct, complete, and effectively equivalent to the EXPECTED_RESPONSE.
-   Use the full range of the SCORING_SCALE when appropriate. Avoid clustering scores in the middle without justification.
`;