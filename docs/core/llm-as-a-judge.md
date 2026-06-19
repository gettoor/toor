# LLM-as-a-judge

LLM-as-a-judge is an evaluation technique in which a large language model assesses the quality of an output from another model against predefined criteria by assigning scores (e.g. overall score, correctness, relevance or completeness). It also provides reasoning for the scores.

Toor provides 2 types of LLM judges:
- [binary](#binary) which returns a boolean value (pass or fail) and reasoning for the decision
- [scalar](#scalar) which returns a numeric score and reasoning for the score

## Example

Let's suppose we want to test two prompts for a customer-support chat agent. The agent answers a user question:

> How can I reset my password?

The first agent generated the following response:

> Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your inbox.

We run evaluation over the prompt and response. The LLM judge might return the following:

```json
{
  "correctness": 10,
  "completeness": 9,
  "helpfulness": 10,
  "overall": 9,
  "reasoning": "Provides accurate steps and enough detail for the user to proceed."
}
```

The second agent replied with:

> Contact support.

The LLM judge might return the following:

```json
{
  "correctness": 6,
  "completeness": 2,
  "helpfulness": 3,
  "overall": 3,
  "reasoning": "The response may be valid in some cases but does not explain how to reset the password."
}
```

## Binary

The binary judge is run using the function [`binary`](/api/functions/binary.md).

```ts
async function binary(input: BinaryInput): Promise<BinaryOutput>;
```

It takes an object of type [`BinaryInput`](/api/interfaces/BinaryInput.md) as argument with the following properties:

* `modelName`: The name of the model to use for the evaluation.
* `modelProvider` (optional): The model provider to use for the evaluation. If not provided, the default model provider will be used. See [Model provider](model-provider.md).
* `modelParameters` (optional): The model parameters to use for the evaluation. See [`ModelParameters`](/api/interfaces/ModelParameters.md).
* `prompt`: The prompt to evaluate.
* `response`: The response to the prompt.
* `evalPrompt` (optional): The prompt to use for the evaluation. If not provided, the default prompt will be used. See [Binary `evalPrompt`](#binary-evalprompt).

The function returns an object of type [`BinaryOutput`](/api/interfaces/BinaryOutput.md) with the following properties:

* `result`: The result of the evaluation, a boolean value indicating whether the answer satisfies the prompt.
* `reasoning`: The reasoning for the evaluation.
* `usage`: The LLM usage [LLMUsage](/api/interfaces/LLMUsage.md) for the evaluation.

### Example

```ts
import { binary } from '@gettoor/core';

const result = await binary({
  modelName: 'openai:gpt-4o',
  prompt: 'What is the capital of France?',
  response: 'Paris',
});

console.log(
  `   Result: ${result.result ? 'Passed' : 'Failed'}\n` +
  `Reasoning: ${result.reasoning}`
);
```

### Binary `evalPrompt`

The field `evalPrompt` can be used to provide a custom evaluation prompt. The prompt must contain the placeholders:
- `<<prompt>>` replaced with the prompt to evaluate,
- `<<response>>` replaced with the response to the prompt.

The evaluation will fail if any of the placeholders are not provided.

```ts
const result = await binary({
  modelName: 'openai:gpt-4o',
  prompt: 'What is the capital of France?',
  response: 'Paris',
  evalPrompt: `
You are an evaluator. Does the response correctly satisfy the prompt?

Prompt:
<<prompt>>

Response:
<<response>>
`,
});
```

## Scalar

The scalar judge is run using the function [`scalar`](/api/functions/scalar.md).

```ts
async function scalar(input: ScalarInput): Promise<ScalarOutput>;
```

It takes an object of type [`ScalarInput`](/api/interfaces/ScalarInput.md) as argument with the following properties:

* `modelName`: The name of the model to use for the evaluation.
* `modelProvider` (optional): The model provider to use for the evaluation. If not provided, the default model provider will be used. See [Model provider](model-provider.md).
* `modelParameters` (optional): The model parameters to use for the evaluation. See [`ModelParameters`](/api/interfaces/ModelParameters.md).
* `prompt`: The prompt to evaluate.
* `response`: The response to the prompt.
* `scoringScale` (optional): The scoring scale to use for the evaluation. If not provided, the default scoring [`SCALAR_SCORING_DEFAULT`](/api/variables/SCALAR_SCORING_DEFAULT.md) scale will be used. See [Scales](#scales) and [`ScalarScoringScale`](/api/interfaces/ScalarScoringScale.md).
* `metrics` (optional): The metrics to use for the evaluation. See [`ScalarMetric`](/api/interfaces/ScalarMetric.md).
* `evalPrompt` (optional): The prompt to use for the evaluation. If not provided, the default prompt will be used. See [Scalar `evalPrompt`](#scalar-evalprompt).

The function returns an object of type [`ScalarOutput`](/api/interfaces/ScalarOutput.md) with the following properties:

* `result`: The result of the evaluation, numeric scores indicating how well the response satisfies the prompt.
* `reasoning`: The reasoning for the evaluation.
* `usage`: The LLM usage [LLMUsage](/api/interfaces/LLMUsage.md) for the evaluation.

### Example

Try the response `Exercise is good for you.` instead of the one given below.

```ts
import { scalar, ScalarOutput } from '@gettoor/core';

const result = await scalar({
  modelName: 'openai:gpt-4o',
  prompt: 'Summarize the benefits of regular exercise.',
  response: [
    'Regular exercise improves cardiovascular health, ',
    'helps maintain a healthy weight, ',
    'strengthens muscles and bones, ',
    'improves mood, ',
    'and reduces the risk of many chronic diseases.',
  ].join(''),
});

console.log(
  `   Result: ${result.result.score}\n` +
  `Reasoning: ${result.reasoning}`
);
```

### Scales

There are 3 predefined scoring scales (score 1 is the lowest score):
- Coarse-grained scale [`SCALAR_SCORING_1_3`](/api/variables/SCALAR_SCORING_1_3.md) with score range 1-3
- Likert scale [`SCALAR_SCORING_1_5`](/api/variables/SCALAR_SCORING_1_5.md) with score range 1-5
- Fine-grained scale [`SCALAR_SCORING_1_10`](/api/variables/SCALAR_SCORING_1_10.md) with score range 1-10

### Custom scale

You will need to provide an object of type [`ScalarScoringScale`](/api/interfaces/ScalarScoringScale.md) to build your own scoring scale. The prompt in the field `prompt` is injected into the evaluation prompt as `<<scoring_scale>>`. The fields `min` and `max` are used to normalize the score to the range [0, 1].

See the below example for a custom scoring scale.

```ts
const scoringScale: ScalarScoringScale = {
  min: 0,
  max: 1,
  prompt: `
    0 = Incorrect or irrelevant
    1 = Correct
  `,
};

const result = await scalar({
  modelName: 'openai:gpt-4o',
  prompt: 'What is the capital of France?',
  response: 'Paris',
  scoringScale,
});

console.log(
  `   Result: ${result.result.score}\n` +
  `Reasoning: ${result.reasoning}`
);
```

### Metrics

The field `metrics` can be used to provide custom metrics to use for the evaluation. The metrics must be an array of objects of type [`ScalarMetric`](/api/interfaces/ScalarMetric.md).

```ts
const result = await scalar({
  modelName: 'openai:gpt-4o',
  prompt: 'Summarize the benefits of regular exercise.',
  metrics: [
    SCALAR_METRIC_CORRECTNESS,
    SCALAR_METRIC_COMPLETENESS,
    SCALAR_METRIC_RELEVANCE,
  ],
  response: 'Exercise is good for you.',
});
```

The result will contain the scores and reasoning for each metric in the field [`metrics`](/api/interfaces/ScalarResult.md#metrics). See [`MetricResult`](/api/interfaces/MetricResult.md) for the structure of the result.

Toor provides the following predefined metrics:
- [`SCALAR_METRIC_CORRECTNESS`](/api/variables/SCALAR_METRIC_CORRECTNESS.md) - Is the answer factually accurate?
- [`SCALAR_METRIC_COMPLETENESS`](/api/variables/SCALAR_METRIC_COMPLETENESS.md) - Does it cover everything important?
- [`SCALAR_METRIC_RELEVANCE`](/api/variables/SCALAR_METRIC_RELEVANCE.md) - Does it address the user's request?
- [`SCALAR_METRIC_CLARITY`](/api/variables/SCALAR_METRIC_CLARITY.md) - Is it easy to understand?
- [`SCALAR_METRIC_CONCISENESS`](/api/variables/SCALAR_METRIC_CONCISENESS.md) - Is it appropriately brief without unnecessary content?
- [`SCALAR_METRIC_GRAMMAR`](/api/variables/SCALAR_METRIC_GRAMMAR.md) - Is it free of spelling, grammar, and punctuation errors?
- [`SCALAR_METRIC_COHERENCE`](/api/variables/SCALAR_METRIC_COHERENCE.md) - Does it flow logically and remain internally consistent?
- [`SCALAR_METRIC_HELPFULNESS`](/api/variables/SCALAR_METRIC_HELPFULNESS.md) - Does it actually help the user accomplish their goal?
- [`SCALAR_METRIC_SAFETY`](/api/variables/SCALAR_METRIC_SAFETY.md) - Does it avoid harmful or policy-violating content?
- [`SCALAR_METRIC_REASONING_QUALITY`](/api/variables/SCALAR_METRIC_REASONING_QUALITY.md) - Is the reasoning clear and logical?
- [`SCALAR_METRIC_ACTIONABILITY`](/api/variables/SCALAR_METRIC_ACTIONABILITY.md) - Can the user act on the answer?
- [`SCALAR_METRIC_INSTRUCTION_FOLLOWING`](/api/variables/SCALAR_METRIC_INSTRUCTION_FOLLOWING.md) - Does it follow the instructions provided?

### Scalar `evalPrompt`

The field `evalPrompt` can be used to provide a custom evaluation prompt. The prompt must contain the placeholders:
- `<<prompt>>` replaced with the prompt to evaluation,
- `<<response>>` replaced with the response to the prompt,
- `<<scoring_scale>>` replaced with the scoring scale to use for the evaluation,
- `<<metrics>>` replaced with the metrics to use for the evaluation.

The evaluation will fail if any of the placeholders are not provided.

```ts
const result = await scalar({
  modelName: 'openai:gpt-4o',
  prompt: 'What is the capital of France?',
  response: 'Paris',
  evalPrompt: `
You are an evaluator. Does the response correctly satisfy the prompt?

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE Scale:
<<scoring_scale>>

METRICS:
<<metrics>>
`,
});
```