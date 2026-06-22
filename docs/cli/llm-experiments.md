# LLM experiments

An LLM experiment is a process to measure performance of different models, model parameters, prompts on a dataset, typically to find the best combination.

CLI allows to run LLM experiments from configuration files. See [CLI](/cli/index.md) for information how to run CLI.
A configuration can be a YAML (`*.yaml`, `*.yml`) or JSON (`*.json`) file.

See [CLI Reference](/cli-reference.md) for more information about the configuration file format.

## Example

A configuration file has the form as shown below. Keep all the names in `models`, `model-parameters`, `prompts` and `datasets` unique.

```yaml [toor.experiment.yaml]
evaluation:
  # binary, 1-3, 1-5, 1-10
  type: 1-5

  # model used to evaluate the prompts and responses
  model: openai:gpt-4o

# models to evaluate
models:
  - model: openai:gpt-4o-mini

# model parameters to evaluate
model-parameters:
  - name: default
    temperature: 0.2

# prompts to evaluate
prompts:
  - name: support
    prompt: "Answer clearly: <<question>>"

# dataset with variables to replace in the prompts
datasets:
  - name: reset-password
    vars:
      question: How can I reset my password?
```

Run the experiment:

```sh
npx toor ./toor.experiment.yaml
```

## LLM experiment

An LLM experiment runs in the following steps:
1. A response is generated for each combination of model, model parameters, prompts and dataset entries.
2. Each response is evaluated and a score is assigned.
3. The results are printed:
   - Score for each combination.
   - Aggregated (average) by models, model parameters, prompts and datasets.
  
The result results for example above are:

```
TODO: Results
```

## Evaluation settings

Evaluation settings are set under `evaluation`. It supports the following settings:
- `type`
- `model`
- `prompt` (optional)

The optional field `prompt` can be used to define custom evaluation prompt. See [Binary evaluation prompt](#binary-evaluation-prompt) and [Scalar evaluation prompt](#scalar-evaluation-prompt)

### Type

The evaluation type defines how a pair prompt-response is evaluated and what score is assigned. `type` can be one of:
- `binary` - Returns score either 0 (failed) or 1 (passed).
- `1-3` - Coarse-grained evaluator with score range 1-3.
- `1-5` - Likert-scale evaluator with score range 1-5.
- `1-10` - Find-grained evaluator with score range 1-10.

### Model

`model` defines the model used to evaluate prompt-response pairs. It's a string prefixed with provider name:
- `gemini:<model>`
- `openai:<model>`
- `anthropic:<model>`

Depending on the provider one of the following environment variables must be defined:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

### Binary evaluation prompt

The binary evaluator prompt must have the following placeholders:
- `<<prompt>>` replaced with the prompt to evaluate,
- `<<response>>` replaced with the response to the prompt.

The expected response is a structured output with fields:
- `passed` - `false` for failure, `true` for pass,
- `reasoning` - reasoning for the `passed` value.

The evaluation will fail if any of the placeholders is not provided.

```
You are an evaluator. Does the response correctly satisfy the prompt?

Prompt:
<<prompt>>

Response:
<<response>>
```

### Scalar evaluation prompt

The scalar evaluator prompt must have the following properties:
- `<<prompt>>` replaced with the prompt to evaluate,
- `<<response>>` replaced with the response to the prompt,
- `<<scoring_scale>>` replaced with the scoring scale to use for the evaluation,
- `<<metrics>>` replaced with the metrics to use for the evaluation.

The expected response is a structured output with fields:
- `score` - score for the response,
- `reasoning` - reasoning for the `score` value.

The evaluation will fail if any of the placeholders is not provided.

```
You are an evaluator. Does the response correctly satisfy the prompt?

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE Scale:
<<scoring_scale>>

METRICS:
<<metrics>>
```

## Models

## Model parameters

## Prompts

## Datasets