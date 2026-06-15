# Introduction

Toor is a set of packages of utilities for LLM evaluations and experimentation. It's divided into the following packages:
- `@gettoor/core` - The core package which all the types and functions for evaluations and experimentation.
- `@gettoor/cli` - Command-line interface to run evaluations and experiments based a configuration file.

Toor supports the following evaluations and experiments:
- [LLM-as-a-judge](./llm-as-a-judge.md) - An evaluation in which an output from a model is evaluated against predefined criteria by assigning scores (e.g. overall score, correctness, relevance or completeness).
- [LLM experimentation](./llm-experimentation.md) - The goal of an LLM experiment is to measure performance of different models, parameters, prompts on a dataset, typically to find the best combination.