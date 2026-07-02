# Toor

A TypeScript library of utilities for LLM evaluations and experiments.

Toor helps you:
- evaluate model outputs using binary and scalar LLM-as-a-judge
- run LLM experiments to compare models, model parameters and prompts

## Installation

```sh
# Core library for LLM evaluations and experiments in code
npm install @gettoor/core

# Command line interface to run experiments from configuration files
npm install @gettoor/cli
```

## Quick start

```ts
import { scalar } from '@gettoor/core';

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

console.log(`    Score: ${result.result.score}`);
console.log(`Reasoning: ${result.reasoning}`);
```

```ts
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

```sh
npm install @gettoor/cli
npx toor evaluate --config config.yaml
```

## Documentation

