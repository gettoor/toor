# Getting started

Toor is a set of packages of utilities for LLM evaluations and experimentation. It's divided into the following packages:
- `@gettoor/core` - The core package with all types and functions for evaluations and experimentation.
- `@gettoor/cli` - Command-line interface to run evaluations and experiments based on a configuration file.

Toor supports the following:
- [LLM-as-a-judge](/core/llm-as-a-judge.md) - An evaluation in which an output from a model is evaluated against predefined criteria by assigning scores (e.g. overall score, correctness, relevance or completeness).
- [LLM experiments](/core/llm-experiments.md) -  A process to measure performance of different models, model parameters, prompts on a dataset, typically to find the best combination.
- [Reflective Prompt Evolution](/rpe/index.md) - A process to iteratively evolve a prompt to improve its performance through repeated evaluations, analysis and refinement.

## Installation

Install the [core package](/core/index.md) if you want to run evaluations and experiments in your code:

```sh
npm install @gettoor/core
```

Install the [command line interface](/cli/index.md) if you want to run evaluations and experiments from the command line:

```sh
npm install @gettoor/cli
```

## Core

Use `@gettoor/core` when you want full control in code.

### Run your first LLM-as-a-judge evaluation

```ts
import { binary } from '@gettoor/core';

const result = await binary({
  modelName: 'openai:gpt-4o',
  prompt: 'What is the capital of France?',
  response: 'Paris',
});

console.log(result.result, result.reasoning);
```

### Run an experiment programmatically

```ts
import { 
  runExperiment,
  SCALAR_SCORING_1_5,
  scalarEvaluator,
} from '@gettoor/core';

const results = await runExperiment({
  settings: {
    modelName: 'openai:gpt-4o',
    evaluator: scalarEvaluator({
      scoringScale: SCALAR_SCORING_1_5,
    }),
  }
  models: [
    // models to evaluate
    { name: 'openai:gpt-4o-mini' },
  ],
  modelParameters: [
    // model parameters to evaluate
    { name: 'default', temperature: 0.2 },
  ],
  prompts: [
    {
      // prompts to evaluate
      name: 'support',
      prompt: 'Answer clearly: <<question>>' },
    ],

    // dataset with variables to replace in the prompts
    dataset: [
      { 
        name: 'reset-password',
        vars: {
          question: 'How can I reset my password?',
        },
      },
    ],
});

// score of the first combination of model, parameters, prompt and dataset
console.log('Score: ' + results[0].score.scoreAsString);
```

For full API details, see [Core](/core/index.md), [LLM-as-a-judge](/core/llm-as-a-judge.md), and [LLM experiments](/core/llm-experiments.md).

## CLI

Use `@gettoor/cli` when you want to run experiments from configuration files.

### Create an experiment config file `toor.experiment.yaml`

```yaml
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

### Run the CLI

```sh
npx toor ./toor.experiment.yaml
```

For more details, see [CLI](/cli/index.md).
