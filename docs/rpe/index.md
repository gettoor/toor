# Reflective Prompt Evolution

Reflective Prompt Evolution (RPE) is a process for iteratively evolving a prompt to improve its performance through repeated evaluations, analysis and refinement.



## Why RPE?

Prompt engineering is often performed manually: an initial prompt is written, evaluated on a small dataset, and improved based on the evaluation results. This approach is time-consuming and requires a lot of manual effort, especially when dealing with complex prompts and large datasets.

RPE simplifies this process by turning prompt improvement into an automated and iterative optimization loop.

## RPE process overview

RPE treats prompt improvement as an iterative optimization process. A prompt is evaluated against a dataset, its performance is analyzed, and based on the analysis, new candidate prompt(s) are generated. The candidate prompts are further evaluated, and based on the candidate evaluations, prompts for the next iteration are picked or discarded if they are not good enough. This process is repeated until a stopping criterion is met.

A dataset is a collection of entries (examples) that are used to evaluate the performance of a prompt. Each entry contains inputs and optionally an expected response. The inputs are used to generate responses from the prompt.

At a high level, an RPE iteration consists of the following steps:

1. Generate responses from prompts
2. Evaluate
3. Aggregate and analyze evaluations
4. Generate candidates
5. Evaluate candidates
6. Select prompts for the next iteration
7. Repeat until a stopping criterion is met

Each iteration produces both new potentially improved prompts and insights why the new prompts perform differently. This approach allows for a more nuanced understanding of the prompt and its performance across a dataset.

RPE heavily relies on textual diagnosis (reflection) of the prompts to generate candidates instead of fully relying on score and metrics only. It analyzes strengths, weaknesses and failure patterns in form of textual analysis. These signals are used to generate new candidate prompts.

See [RPE process](/rpe/process.md) for more details.

## Optimization signals and reflection

The most important idea behind RPE is that it uses two complementary sources of feedback to guide prompt evolution: **optimization signals** and **reflection**.

Optimization signals are scores or metrics. It can also be pass/fail results or other structured outputs. They answer the question *What is good/bad in a prompt?*. These signals make it possible to compare prompts and tell if a candidate represents an improvement over the previous prompt.

A low score indicates that a prompt performed poorly. Metrics or per-dataset entry scores tell where the prompt performed poorly. However, the signals don't tell why the prompt performed poorly and what needs to be changed to improve it.

Reflection provides the additional insight into why a prompt performed poorly and what needs to be changed to improve it. It answers the question *Why is this prompt good/bad?* and *What needs to be changed to improve it?*.

Reflection has textual form and provides information about the prompt's strengths, weaknesses and failure patterns.