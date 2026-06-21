# LLM experiments

CLI allows to run LLM experiments from configuration files. See [CLI](/cli/index.md) for information how to run CLI.
A configuration can be a YAML (`*.yaml`, `*.yml`) or JSON (`*.json`) file.

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

Run the experiment with:

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

## Evaluation prompt

## Models

## Model parameters

## Prompts

## Datasets