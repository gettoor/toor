# RPE process

[Reflective Prompt Evolution](./index.md) (RPE) is a multi-step iterative process. Each step has its impact on improving the quality of the prompt. Typically the input to the process is:
- seed prompt (or list of prompts) to be improved,
- dataset to be used for evaluation,
- process configuration (e.g. models, model parameters, metrics, etc.).

The iteration starts with generating responses for given candidates and dataset entries. The responses are evaluated which yields in scores, metrics and reasoning. The evaluations are aggregated and analyzed to produce reflection. The reflection in turn is used to generate new candidates. The new candidates are evaluated and either selected for the next iteration or discarded. The process repeats until a stopping criterion is met.

## Dataset

A dataset is a collection of entries. Each entry in turn provides inputs (variables) to generate responses and an optional expected response. A dataset is used to evaluate the quality of prompts. Therefore, datasets should be sufficiently diverse and representative to cover the use cases of the prompt.

A dataset is typically split into training and validation datasets. The training dataset is used to generate improved prompts. The validation dataset is used to evaluate the generated prompts and decide which ones to keep and which ones to discard.

The below example shows a prompt to detect the sentiment of a review and a very basic dataset with two entries. The prompt contains a placeholder `<<review>>` which is replaced with the inputs from the dataset.

```txt
What is the sentiment of the following review?

<<review>>
```

```yaml
review: I absolutely loved the product. It exceeded all my expectations.
expected_response: positive

review: The battery barely lasts an hour.
expected_response: negative
```

## Responses

A dataset provides all the necessary information to generate responses. Placeholders in the prompt are replaced with the inputs from the dataset. A response is generated using given model and model parameters.

The responses not necessarily need to be generated for all the prompts and all the entries in the dataset. The practice shows that a subset of the entries is enough to get good evaluation of a prompt. This can be as few as a handful of entries. Also, the number of prompts can be limited. Not all the prompts from the current iteration have to be evaluated.

For the above example, when the placeholder is replaced the following prompts are rendered and responses are generated.

The prompt for the first entry is:

```txt
What is the sentiment of the following review?

I absolutely loved the product. It exceeded all my expectations.
```

The response for the above prompt could be:

```txt
The sentiment of the input is **strongly positive**.

Here's why:
*   "absolutely loved" expresses a very high degree of satisfaction and affection.
*   "exceeded all my expectations" indicates that the product performed even better than hoped for."
```

The prompt for the second entry is:

```txt
What is the sentiment of the following review?

The battery barely lasts an hour.
```

The response for the above prompt could be:

```txt
The sentiment is **negative**.

The phrase "barely lasts an hour" indicates very poor performance and dissatisfaction with the battery life.
```

Clearly, the responses are too verbose. The responses should be a single word, one of: `positive`, `negative` or `neutral`. This prompt is a good candidate for optimization which is explained in the next sections.

## Evaluation

The responses at this stage are evaluated. The previous step produced a number of responses for each prompt picked to be optimized. In other words, there is a list of:
- prompt,
- response,
- expected response (if provided).

Each item in the list is evaluated. There are multiple methods to evaluate a response. It can be as simple as doing exact comparison of the response and the expected response. It can be more complex, for example using LLM-as-judge.

An evaluation should result in quantitative (e.g. score and metrics) and qualitative assessments (textual feedback). It is important that an evaluation provides the textual feedback. It's used to build the reflection which in turn fuels the candidate generation.

::: info
It is crucial that the evaluation provides a textual feedback which drives the reflection and candidate generation.
:::

The evaluations using LLM-as-judge for the considered example are below. `reasoning` is the textual feedback.

```yaml
- input:
  review: I absolutely loved the product. It exceeded all my expectations.
- score: 0.5
- reasoning: >-
    The response correctly identifies the sentiment as positive.
    However, it deviates significantly from the EXPECTED_RESPONSE
    by adding an intensity modifier (\"strongly\") and providing
    an explanation, neither of which were present in the concise
    EXPECTED_RESPONSE (\"positive\"). According to the strict
    evaluation guidelines, any deviation is considered incorrect
    unless the response is factually equivalent, equally complete,
    and satisfies all prompt requirements. While factually equivalent,
    the response is not 'equally complete' as it is more verbose than
    the expected answer. The additional information, particularly
    the explanation, constitutes a notable deviation from the expected
    output's scope and exactness, leading to a lower score.
- metrics:
  - correctness: 0.75
  - completeness: 0.5
  - relevance: 1
```

```yaml
- input:
  review: The battery barely lasts an hour.
- score: 1
- reasoning: >-
    The response correctly identifies the sentiment as 'negative',
    which directly matches the EXPECTED_RESPONSE. Although the response
    includes additional explanatory text, this information is correct
    and relevant, and per the evaluation guidelines, verbosity should
    be ignored unless explicitly required by the prompt. The core answer
    is semantically equivalent to the expected response.
- metrics:
  - correctness: 1
  - completeness: 1
  - relevance: 1
```

## Evaluation aggregation

Aggregation as the name suggests takes all the evaluations for the same prompt and aggregates them into a single entity. Scores and metrics are aggregated using a math function (e.g. average, median, etc.). The evaluations are typically grouped into passed and failed evaluations. Aggregation can also produce other information such as score distribution from the evaluations.

In order to determine if an evaluation passed or failed, a threshold is used. For example, all evaluations with a score greater than 0.75 are considered passed. Otherwise, they are considered failed.

The aggregation for the considered example is below. The average was used to aggregate the scores and metrics. The threshold was set to 0.95.

```yaml
- aggregated_score: 0.75
- aggregated_metrics:
  - correctness: 0.875
  - completeness: 0.75
  - relevance: 1

- passed_evaluations:
  - input:
    review: The battery barely lasts an hour.
  - score: 1
  - reasoning: >-
      The response correctly identifies the sentiment as 'negative',
      which directly matches the EXPECTED_RESPONSE. Although the response
      includes additional explanatory text, this information is correct
      and relevant, and per the evaluation guidelines, verbosity should
      be ignored unless explicitly required by the prompt. The core answer
      is semantically equivalent to the expected response.
  - metrics:
    - correctness: 1
    - completeness: 1
    - relevance: 1

- failed_evaluations:
  - input:
    review: I absolutely loved the product. It exceeded all my expectations.
  - score: 0.5
  - reasoning: >-
      The response correctly identifies the sentiment as positive.
      However, it deviates significantly from the EXPECTED_RESPONSE
      by adding an intensity modifier (\"strongly\") and providing
      an explanation, neither of which were present in the concise
      EXPECTED_RESPONSE (\"positive\"). According to the strict
      evaluation guidelines, any deviation is considered incorrect
      unless the response is factually equivalent, equally complete,
      and satisfies all prompt requirements. While factually equivalent,
      the response is not 'equally complete' as it is more verbose than
      the expected answer. The additional information, particularly
      the explanation, constitutes a notable deviation from the expected
      output's scope and exactness, leading to a lower score.
  - metrics:
    - correctness: 0.75
    - completeness: 0.5
    - relevance: 1
```

## Analysis (reflection)

The analysis is the process of analyzing the aggregated evaluations to produce a reflection. The reflection should provide textual information and insights so that a candidate generator knows which parts of the prompt are good and which need to be improved. For the reason, the reflection should provide such information as prompt strengths and weaknesses, recommendations for improvement, failure patterns, metric interpretation and so on.

It is required to capture semantic information about why a prompt is good or bad and how it could be improved. A language model fits the bill perfectly because it can interpret the aggregated evaluations and provide a reflection.

The reflection for the example is below. Note that all the signals are lists which means that in generate a reflection can provide more reflection.

```yaml
strengths:
- >-
  The prompt successfully elicits the correct sentiment
  identification from the model in many cases.
weaknesses:
- >-
  The prompt does not specify the desired format or level
  of detail for the output, leading to unrequested elaborations.
recommendations:
- >-
  Ensure output conciseness and exactness (Addressing the tendency
  for the model to add unrequested information (intensity modifiers,
  explanations) will align responses more closely with strict
  evaluation criteria, improving scores by preventing penalties
  for verbosity, which is the primary identified cause of failure.)
failure_patterns:
- >-
  The model frequently provides additional, unrequested information,
  including intensity modifiers and explanations, leading to deviations
  from the expected concise output.
```

## Candidate generation

The reflection along with the original prompts and aggregated evaluations provide everything needed to generate new candidates. The original prompt provides the baseline behavior which should be preserved, the aggregate evaluations provide quantitative signals about its performance while the reflection is like a recipe for improvement. Most of the times, an LLM is used to generate new candidates.

The below is a new candidate generated for the example. Even though it's not pointed anywhere that the response should be a single word, the RPE process is able to generate a candidate that is more concise and exact based on the expected responses.

```txt
What is the sentiment of the following input?
Respond with only a single word: 'positive', 'negative', or 'neutral'.
<<input>>
```

## Candidate evaluation

The new candidates don't necessarily have to perform better than the original ones. For the reason, the new candidates are evaluated. Typically, the new candidates are evaluated on the same dataset as the original ones. The two evaluations allow to compare the prompts.

## Candidate selection

This step decides which candidates to pick and which to discard. First of all, the new candidates which perform better than the original ones are picked. The new and old ones which do not perform better are discarded. This way a pool of good candidates is maintained.

Other methods to select candidates are:
- top-k best candidates,
- weighted multi-metric where a score is built from multiple metrics and weights,
- candidates which pass evaluations which failed to pass before (escape local optima).

## Stopping criterion

The process stops when a stopping criterion is met. The stopping criterion can be a maximum number of iterations, no performance improvement for a number of iterations, a maximum number of tokens used and so on.

If the process is not stopped, the candidates selected in the previous steps are used to generate the next iteration. It starts over from generating responses for the candidates and dataset entries.