/**
 * The default prompt to use for the binary evaluation. 
 * It takes the placeholders:
 * - `<<prompt>>`: The prompt to evaluate.
 * - `<<response>>`: The response to evaluate.
 * @category LLM-as-a-judge
 */
export const BINARY_PROMPT = `
You are a strict evaluator.

Your task is to determine whether the RESPONSE satisfies the EVALUATION_PROMPT.

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

Definition of "satisfies":

* The RESPONSE directly and correctly fulfills the intent of the PROMPT.
* All explicit requirements in the PROMPT are met.
* No required part is missing.
* The RESPONSE does not contradict the PROMPT.

Rules:

* Be strict: partial fulfillment → FALSE.
* If the PROMPT is vague, interpret it literally and conservatively.
* If you are unsure → FALSE.
* Ignore style unless explicitly required.
* Never mention the PROMPT or the RESPONSE in the reasoning.
`;