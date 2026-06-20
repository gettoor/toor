# LLM experiments

CLI allows to run LLM experiments from configuration files. See [CLI](/cli/index.md) for information how to run CLI.
A configuration can be a YAML (`*.yaml`, `*.yml`) or JSON (`*.json`) file. It has the form:

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