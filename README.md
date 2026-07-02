# Toor

Toor is an open-source TypeScript toolkit for LLM evaluation and experimentation.
It helps you score model outputs with LLM-as-a-judge and run repeatable experiments across models, prompts, and parameter sets.

## Features

- LLM-as-a-judge evaluators:
  - Binary (`pass` or `fail`)
  - Scalar (`1-3`, `1-5`, `1-10`, or custom scales)
- Metric-based scoring with reasoning
- Experiment runner for comparing:
  - Models
  - Model parameters
  - Prompts
  - Dataset entries
- CLI for config-driven experiments (`yaml` or `json`)
- Model provider support for OpenAI, Anthropic, and Gemini

## Packages

- `@gettoor/core` - Core evaluation and experiment APIs for TypeScript
- `@gettoor/cli` - Command-line interface for running experiments from configuration files

## Installation

Install only what you need:

```sh
# Core library for programmatic usage
npm install @gettoor/core

# CLI for config-based experiments
npm install @gettoor/cli
```

## Quick Start

### Evaluate a response with `@gettoor/core`

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

console.log(`Score: ${result.result.score}`);
console.log(`Reasoning: ${result.reasoning}`);
```

### Run an LLM experiment with `@gettoor/cli`

Create `toor.experiment.yaml`:

```yaml
evaluation:
  # binary, 1-3, 1-5, 1-10
  type: 1-5
  model: openai:gpt-4o

models:
  - model: openai:gpt-4o-mini

model-parameters:
  - name: default
    temperature: 0.2

prompts:
  - name: support
    prompt: "Answer clearly: <<question>>"

dataset:
  - name: reset-password
    vars:
      question: How can I reset my password?
```

Run:

```sh
npx toor ./toor.experiment.yaml
```

## Model Provider and API Keys

The provider resolves models by prefix:

- `openai:<model>`
- `anthropic:<model>`
- `gemini:<model>`

Set the matching environment variables before running evaluations:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

## Documentation

Comprehensive documentation is available at https://gettoor.github.io/toor

## Development

### Prerequisites

- Node.js (24+ recommended)
- pnpm (workspace uses pnpm)

### Setup

```sh
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run the tests
pnpm test
```

### Documentation

```sh
# Generate API docs
pnpm docs:api

# Run docs locally
pnpm docs:dev

# Build static docs
pnpm docs:build
```

## Contributing

Contributions are welcome. Please open an issue to discuss bugs or feature ideas before submitting large changes.

When contributing:
- keep changes focused and small
- add or update documentation for user-facing behavior
- run build/tests before opening a PR

## License

MIT

