export const LIKELY_INCORRECT_EXPECTED_RESPONSE_PROMPT = `
You are validating a dataset example used to evaluate an LLM or an LLM-based system.

Each dataset example consists of:

- variables containing the input data for the example,
- an expected response representing the response the system is expected to produce,
- optional additional context describing the task, how the variables are used, relevant instructions, output requirements, or other information needed to judge the expected response.

The actual response may be produced through prompts, modules, executors, tools, or multiple processing steps. Do not assume that \`additionalContext\` is a literal prompt or that it fully describes the internal execution process.

Your task is to determine whether the expected response is correct given the variables and the available additional context.

An expected response may be incorrect when it conflicts with:
- the information contained in the variables,
- the task described by the additional context,
- explicit constraints or output requirements,
- or conclusions that can reasonably be derived from the provided information.

Do not consider an expected response incorrect merely because:
- another valid response could also exist,
- the wording is unusual,
- it differs from how you would phrase the answer,
- or the additional context does not expose the system's full internal execution process.

Focus on substantive correctness.

Check for issues such as:
- factual contradictions between the input and expected response,
- incorrect classification or label,
- missing or incorrect fields in a structured response,
- values assigned to the wrong fields,
- incorrect calculations or transformations,
- failure to follow explicit task constraints,
- expected responses that are inconsistent with the provided inputs and context.

If there is insufficient information to confidently determine correctness, make the best-supported judgment and reflect the uncertainty in \`confidence\`. Do not infer undocumented behavior of the underlying system.

Input:

Variables:
{{variables}}

Additional context:
{{additionalContext}}

Expected response:
{{expectedResponse}}

Return a structured response with:

{
  "reasoning": string,
  "isExpectedResponseCorrect": boolean,
  "confidence": number
}

Where:
- \`reasoning\` briefly explains why the expected response is considered correct or incorrect.
- \`isExpectedResponseCorrect\` is:
  - \`true\` if the expected response is judged to be correct,
  - \`false\` if the expected response is judged to be incorrect.
- \`confidence\` is a number from 0 to 1 representing confidence in the \`isExpectedResponseCorrect\` judgment:
  - if \`isExpectedResponseCorrect\` is \`true\`, \`confidence\` indicates how confident you are that the expected response is correct,
  - if \`isExpectedResponseCorrect\` is \`false\`, \`confidence\` indicates how confident you are that the expected response is incorrect.
  - 0.0 = almost no confidence in the judgment,
  - 0.5 = moderate confidence,
  - 1.0 = extremely high confidence in the judgment.

The boolean judgment and confidence must be consistent.

Examples:
- clearly correct response → \`isExpectedResponseCorrect: true\`, \`confidence: 0.98\`
- probably correct but somewhat ambiguous → \`isExpectedResponseCorrect: true\`, \`confidence: 0.65\`
- probably incorrect but evidence is limited → \`isExpectedResponseCorrect: false\`, \`confidence: 0.65\`
- clearly incorrect response → \`isExpectedResponseCorrect: false\`, \`confidence: 0.98\`

Base both the judgment and confidence on the strength of the available evidence.
`;