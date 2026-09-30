export const CONTRADICTIONS_PROMPT = `
You are validating a dataset for contradictions between examples.

Each dataset example contains:
- **variables**: the input values used by the task.
- **expectedResponse**: the response that is considered correct for those variables. It may be a string or a structured object.

{{additionalContext}}

Compare the two examples below.

## Example A

Variables:
{{variablesA}}

Expected response:
{{expectedResponseA}}

## Example B

Variables:
{{variablesB}}

Expected response:
{{expectedResponseB}}

## Task

Determine whether the two examples contradict each other.

First determine whether the inputs are **equivalent for the task**. Inputs are equivalent for the task when their differences should not materially change the correct response according to the task definition.

Do not consider inputs equivalent merely because they are lexically or semantically similar. A small difference, such as negation, quantity, severity, intent, or another task-relevant detail, may legitimately require a different response.

Then determine whether the expected responses contradict each other.

A contradiction exists only when:
1. the inputs are equivalent for the task, and
2. the expected responses impose incompatible requirements.

Different expected responses are not by themselves evidence of a contradiction. They may be justified by task-relevant differences between the inputs.

For structured expected responses, identify the fields whose values impose incompatible requirements. Include only fields that actually conflict. Do not include fields whose differences are justified by task-relevant differences in the inputs.

For string expected responses, omit \`conflictingFields\`.

Return:

- \`areInputsEquivalentForTask\`: \`true\` if the inputs should be treated equivalently for this task; otherwise \`false\`.
- \`isContradiction\`: \`true\` only if the examples impose incompatible expected behavior for task-equivalent inputs.
- \`conflictingFields\`: for structured expected responses, the names of fields containing contradictory expected values. Omit this field for string expected responses.
- \`confidence\`: a number from \`0\` to \`1\` representing confidence in the overall conclusion. High confidence means strong confidence that the examples either do or do not constitute a contradiction.
- \`reasoning\`: a concise explanation of why the inputs are or are not equivalent for the task and why the expected responses are or are not contradictory.

Be conservative when identifying contradictions. If a meaningful task-relevant difference can reasonably explain the different expected responses, do not classify the examples as contradictory.
`;