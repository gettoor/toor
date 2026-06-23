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
dataset:
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

For example `gemini:gemini-3.5-flash` or `openai:gpt-4o`.

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

SCORING_SCALE:
<<scoring_scale>>

METRICS:
<<metrics>>
```

## Models

The models to evaluate are passed under the `models` field in the experiment object. Each model object has:
- `model` - model name.

The model name is defined exactly as in the [Model](#model) settings.

## Model parameters

The model parameters to evaluate are passed under the `model-parameters` field in the experiment object. Each model parameters object has:
- `name` - unique name,
- `maxOutputTokens` (optional) - Maximum number of tokens the model may generate in its response. Lower values limit response length and cost, while higher values allow longer and more detailed outputs.
- `temperature` (optional) - Temperature (sampling randomness). Lower values make outputs more deterministic and focused, while higher values increase creativity and variation.
- `topP` (optional) - Top-p (nucleus sampling). The model considers the smallest set of tokens whose cumulative probability is at least `topP` and samples from that set. Lower values make outputs more focused and deterministic, while higher values increase diversity.
- `topK` (optional) - Top-k sampling. The model samples only from the `topK` most likely next tokens. Lower values produce more predictable outputs, while higher values allow for more varied and creative responses.
- `presencePenalty` (optional) - Presence penalty of the model parameter. Higher values encourage the model to introduce new topics and vocabulary instead of repeating previously used tokens.
- `frequencyPenalty` (optional) - Penalizes tokens based on how frequently they have already appeared in the generated text. Higher values reduce repetition of the same words and phrases, resulting in more varied output.

## Prompts

Prompts to evaluate are passed under the `prompts` field in the experiment object. Each prompt object has:
- `name` - unique name,
- `prompt` - prompt to evaluate.

Each prompt can contain placeholders of the form `<<placeholder>>`. The placeholders are replaced with the variables from the dataset entries.

### Prompts from files

A prompt can be read from a file. The special prefix `$file:` is used to indicate that the prompt is read from a file. The file is relative to the configuration file.

```yaml
# other fields of the experiment...

prompts:
  - name: support
    prompt: "$file:prompts/support.txt"
```

## Structured output

A structured output can be generated by the model being evaluated. The structured output is passed under the `structured-output` field in the experiment object. The structured output object has:
- `schema` - JSON schema of the structured output.
- `format` - format in which the structured output is passed to the evaluation. One of: `json` or `yaml`.

```yaml
evaluation:
  type: 1-5
  model: openai:gpt-4o

models:
  - model: openai:gpt-4o-mini

model-parameters:
  - name: default
    temperature: 0.2

prompts:
  - name: classifier
    prompt: |
      Classify the support ticket.

      Return structured output with:
      - priority: "low" | "medium" | "high"
      - category: "bug" | "billing" | "feature" | "question"

      Ticket:
      <<ticket>>

structured-output:
  schema:
    priority:
      type: string
      enum: [low, medium, high]
    category:
      type: string
      enum: [bug, billing, feature, question]
  format: yaml

dataset:
  - name: charged-twice
    vars:
      ticket: I was charged twice for my subscription this month.
  - name: dark-mode
    vars:
      ticket: Can you add dark mode to the dashboard?
```

## Datasets

A dataset is a set of entries with variables that are substituted in the prompts. A dataset is passed under the `datasets` field. It is an array of objects, where each object has the fields:
- `name` - unique name,
- `vars` - record of variables where the key is a string and the value can be anything.

### Dataset variables

The values in `vars` can be of any type (primitives, objects, and arrays). Placeholders let you specify the format in which values are inserted into the prompt. A placeholder with a format has the form `<<placeholder:format>>`. The supported formats are:
- `string` (default) - the value is converted to a string.
- `json` - the value is converted to a single-line JSON string.
- `json-pretty` - the value is converted to a multi-line JSON string.
- `yaml`, `yml` - the value is converted to a YAML string.

Consider the example below, where the placeholder `<<input:yaml>>` is replaced with the `input` variable converted to a YAML string for each dataset entry.

```yaml
# other fields of the experiment...

prompts:
  - name: classifier
    prompt: |
      Determine whether the candidate is a good match for the job.

      <<input:yaml>>

      Respond with exactly one of:
      match
      no_match

dataset:
  - name: match
    vars:
      input:
        job_description: Senior TypeScript engineer with NestJS experience.
        candidate_profile: 10 years of TypeScript experience, 5 years with NestJS.
  - name: no-match
    vars:
      input:
        job_description: Senior TypeScript engineer with NestJS experience.
        candidate_profile: Graphic designer with 8 years of Adobe Photoshop experience.
```

### Datasets from files

A dataset can be read from a file. The file must be a YAML or JSON file. The file is passed under the `file` field in the dataset object. `file` is relative to the configuration file.

```yaml
# other fields of the experiment...

dataset:
  - file: data/dataset.yaml
```