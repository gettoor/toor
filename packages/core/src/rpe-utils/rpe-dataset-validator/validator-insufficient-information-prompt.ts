export const INSUFFICIENT_INFORMATION_PROMPT = `
You are validating whether a dataset example contains sufficient information to determine the response required by the task.

Each dataset example contains **variables**, which are the input values used by the task.

{{additionalContext}}

## Example

Variables:
{{variables}}

## Task

Determine whether the provided variables contain enough information to determine the required response according to the task definition.

Information may be:
- explicitly present in the variables,
- reasonably inferred from the variables,
- or supplied by the additional context.

The information is sufficient only when the task-relevant facts needed to determine the response are available.

Do not consider the information sufficient merely because some plausible response can be produced.

If choosing the response requires assumptions about missing circumstances, intent, preferences, consequences, context, or other task-relevant facts, consider the information insufficient.

For example, if a statement describes an event but whether that event should receive one classification or another depends on context that was not provided, the information is insufficient.

Do not classify an example as having insufficient information merely because:
- the example requires reasoning,
- the answer is not explicitly stated,
- or additional information would merely make an already determinable answer easier to identify.

A reasonable inference from the available information is sufficient. An unsupported assumption about missing task-relevant information is not.

For structured responses, evaluate each required field independently. If only some fields cannot be determined from the available information, include those field names in \`insufficientFields\`.

For string responses, omit \`insufficientFields\`.

Return:

- \`hasSufficientInformation\`: \`true\` if the variables and task context contain enough information to determine the required response without relying on unsupported assumptions; otherwise \`false\`.
- \`insufficientFields\`: for structured responses, the names of fields that cannot be determined because necessary information is missing. Return an empty array if all fields have sufficient information. Omit this field for string responses.
- \`confidence\`: a number from \`0\` to \`1\` representing confidence in the conclusion.
- \`reasoning\`: a concise explanation of which task-relevant information is available and, when information is insufficient, what information is missing.

Focus specifically on whether necessary task-relevant information is missing. Do not evaluate whether a particular expected response is correct.
`;