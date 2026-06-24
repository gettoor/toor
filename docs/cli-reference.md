# CLI reference

See [LLM experiments](/cli/llm-experiments.md) for more details.

## Installation

Use the below command to install the CLI.

```sh
npm install @gettoor/cli
```

## Arguments and options

Run an LLM experiment based on the configuration file.

```sh
npx toor toor.experiment.yaml
```

Available options:
- `--verbose` - Print verbose output.
- `--type` - The type of process to run. One of: `experiment`.
- `--help` - Print help.

The process type is taken from the configuration file name. If a file name contains the word `experiment`, the process type is `experiment`.

## LLM experiment configuration file

```yaml
# Evaluation settings.
evaluation:
  # One of: binary, 1-3, 1-5, 1-10.
  type: binary

  # The model to evaluate each pair of prompt and response.
  model: gemini:gemini-3.5-flash

  # [optional] The prompt to use for the evaluation.
  prompt: ...

# Models to evaluate.
models:
  # Model to evaluate in form of provider:model.
  - model: gemini:gemini-3.5-flash

  # Other models.
  - model: ...

# Model parameters to evaluate.
model-parameters:
  # Name of the model parameters.
  - name: default
    # [optional] The temperature of the model parameter.
    temperature: 0.2

    # [optional] The top-p of the model parameter.
    topP: 0.8

    # [optional] The top-k of the model parameter.
    topK: 10

    # [optional] The presence penalty of the model parameter.
    presencePenalty: 0.1

    # [optional] The frequency penalty of the model parameter.
    frequencyPenalty: 0.1

  # Other parameters.
  - name: ...

# Prompts to evaluate.
prompts:
  # Name of the prompt.
  - name: support

    # The prompt to evaluate.
    prompt: |
      Classify the support ticket.

      Return structured output with:
      - priority: "low" | "medium" | "high"
      - category: "bug" | "billing" | "feature" | "question"

      Ticket:
      <<ticket>>

  # Prompt from a file (relative to the configuration file).
  - name: ...
    prompt: "$file:prompts/support.txt"

  # Other prompts.
  - name: ...

# [optional] Structured output configuration.
structured-output:
  # JSON schema of the structured output
  schema: 
    priority:
      type: string
      enum: [low, medium, high]
    category:
      type: string
      enum: [bug, billing, feature, question]

  # The format for structured output to inject into the evaluation prompt.
  # One of: json, yaml.
  format: yaml

# Set of entries with variables that are substituted in the prompts.
datasets:
  # Name of the dataset.
  - name: reset-password
    # Variables that are substituted in the prompts.
    vars:
      question: How can I reset my password?

  # Other datasets.
  - name: ...
```

::: info <Badge type="tip" text="NOTE" />
The placeholders in prompts are placed inside the square brackets, e.g. `<<ticket>>`.

```yaml
prompt: |
  Classify the support ticket.

  Return structured output with:
  - priority: "low" | "medium" | "high"
  - category: "bug" | "billing" | "feature" | "question"

  Ticket:
  <<ticket>>
```
:::