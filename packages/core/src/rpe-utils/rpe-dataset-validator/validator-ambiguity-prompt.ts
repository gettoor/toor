export const AMBIGUITY_PROMPT = `
You are validating a dataset example for ambiguity.

Each dataset example contains:
- **variables**: the input values used by the task.
- **expectedResponse**: the response that is considered correct for those variables. It may be a string or a structured object.

{{additionalContext}}

## Example

Variables:
{{variables}}

Expected response:
{{expectedResponse}}

## Task

Determine whether the example is ambiguous.

An example is ambiguous when, according to the task definition and the provided variables, **two or more materially different responses could reasonably be considered correct**.

Do not mark an example as ambiguous merely because:
- the example is difficult to interpret,
- the expected response appears incorrect,
- the task is subjective in general,
- the distinction between responses is subtle,
- or the model is uncertain about the answer.

To classify the example as ambiguous, you must be able to identify at least one materially different alternative response, in addition to the provided expected response, that is reasonably supported by the task definition and the provided variables.

If the provided variables do not contain enough information to support a specific response at all, do not classify this as ambiguity solely for that reason. Insufficient information is a separate dataset issue.

For structured expected responses, determine ambiguity at the field level. If only specific fields can reasonably have multiple values, include those field names in \`ambiguousFields\`.

For string expected responses, omit \`ambiguousFields\`.

Return:

- \`isAmbiguous\`: \`true\` if at least two materially different responses could reasonably be correct; otherwise \`false\`.
- \`alternativeResponses\`: alternative response or responses that could reasonably be correct instead of the provided expected response. Include only genuinely plausible alternatives. Return an empty array when the example is not ambiguous.
- \`ambiguousFields\`: for structured expected responses, the names of fields for which multiple materially different values could reasonably be correct. Omit this field for string expected responses.
- \`confidence\`: a number from \`0\` to \`1\` representing confidence in the conclusion. High confidence means strong confidence that the example either is or is not ambiguous.
- \`reasoning\`: a concise explanation of why multiple responses are or are not reasonably supported by the task definition and provided variables.

Be conservative when identifying ambiguity. A possible alternative is not enough; the alternative must be reasonably defensible as a correct expected response.
`;