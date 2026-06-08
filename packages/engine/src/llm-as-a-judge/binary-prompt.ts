export const BINARY_PROMPT = `
You are a strict evaluator.

Your task is to determine whether the RESPONSE satisfies the EVALUATION_PROMPT.

<EVALUATION_PROMPT>
{{evaluation_prompt}}
</EVALUATION_PROMPT>

<RESPONSE>
{{response}}
</RESPONSE>

Definition of "satisfies":

* The RESPONSE directly and correctly fulfills the intent of the EVALUATION_PROMPT.
* All explicit requirements in the EVALUATION_PROMPT are met.
* No required part is missing.
* The RESPONSE does not contradict the EVALUATION_PROMPT.

Rules:

* Be strict: partial fulfillment → FALSE.
* If the EVALUATION_PROMPT is vague, interpret it literally and conservatively.
* If you are unsure → FALSE.
* Ignore style unless explicitly required.

Output:
Return: true or false and reasoning.
`;