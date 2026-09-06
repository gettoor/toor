# RPE process

[Reflective Prompt Evolution](./index.md) (RPE) is a multi-step iterative process. Each step helps improve the quality of the prompt. Typically, the input to the process is:
- seed prompt (or list of prompts) to be improved,
- dataset to be used for evaluation,
- process configuration (e.g., models, model parameters, and metrics).

The iteration starts by generating responses for given candidates and dataset entries. The responses are evaluated, yielding scores, metrics, and reasoning. The evaluations are aggregated and analyzed to produce a reflection. The reflection, in turn, is used to generate new candidates. The new candidates are evaluated and either selected for the next iteration or discarded. The process repeats until a stopping criterion is met.

## Dataset

A dataset is a collection of entries. Each entry, in turn, provides inputs (variables) for generating responses and an optional expected response. A dataset is used to evaluate the quality of prompts. Therefore, datasets should be sufficiently diverse and representative to cover the prompt use cases.

A dataset is typically split into training and validation datasets. The training dataset is used to generate improved prompts. The validation dataset is used to evaluate the generated prompts and decide which ones to keep and which ones to discard.

The example below shows a prompt for detecting the sentiment of a review and a very basic dataset with two entries. The prompt contains a placeholder, `<<review>>`, which is replaced with the inputs from the dataset.

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

Responses do not necessarily need to be generated for all prompts and all entries in the dataset. In practice, a subset of the entries is enough to get a good evaluation of a prompt. This can be as few as a handful of entries. The number of prompts can also be limited. Not all prompts from the current iteration have to be evaluated.

For the example above, replacing the placeholder renders the following prompts, for which responses are then generated.

The prompt for the first entry is:

```txt
What is the sentiment of the following review?

I absolutely loved the product. It exceeded all my expectations.
```

The response to the prompt above could be:

```txt
The sentiment of the input is **strongly positive**.

Here's why:
*   "absolutely loved" expresses a very high degree of satisfaction and affection.
*   "exceeded all my expectations" indicates that the product performed even better than hoped for.
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

Clearly, the responses are too verbose. Each response should be a single word: `positive`, `negative`, or `neutral`. This prompt is a good candidate for the optimization process explained in the next sections.

## Evaluation

The responses are evaluated at this stage. The previous step produced a number of responses for each prompt selected for optimization. In other words, there is a list of:
- prompt,
- response,
- expected response (if provided).

Each item in the list is evaluated. There are multiple methods for evaluating a response. The method can be as simple as an exact comparison of the response and the expected response. It can also be more complex, such as using LLM-as-judge.

An evaluation should result in quantitative (e.g., scores and metrics) and qualitative assessments (textual feedback). It is important that an evaluation provides textual feedback. It is used to build the reflection, which, in turn, fuels candidate generation.

::: info
It is crucial that the evaluation provides textual feedback that drives reflection and candidate generation.
:::

The LLM-as-judge evaluations for the example are below. `reasoning` is the textual feedback.

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

Aggregation, as the name suggests, takes all the evaluations for the same prompt and combines them into a single entity. Scores and metrics are aggregated using a mathematical function (e.g., average or median). The evaluations are typically grouped into passed and failed evaluations. Aggregation can also produce other information, such as the distribution of evaluation scores.

In order to determine if an evaluation passed or failed, a threshold is used. For example, all evaluations with a score greater than 0.75 are considered passed. Otherwise, they are considered failed.

The aggregation for the example is below. The average was used to aggregate the scores and metrics. The threshold was set to 0.95.

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

The analysis is the process of examining the aggregated evaluations to produce a reflection. The reflection should provide textual information and insights so that a candidate generator knows which parts of the prompt are good and which need improvement. For this reason, the reflection should provide information such as prompt strengths and weaknesses, recommendations for improvement, failure patterns, and metric interpretation.

The reflection must capture semantic information about why a prompt is good or bad and how it could be improved. A language model is well suited to this task because it can interpret the aggregated evaluations and provide a reflection.

The reflection for the example is below. Note that all the signals are lists, which means that a generated reflection can provide multiple items for each signal.

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

The reflection, along with the original prompts and aggregated evaluations, provides everything needed to generate new candidates. The original prompt provides the baseline behavior that should be preserved, the aggregated evaluations provide quantitative signals about its performance, and the reflection acts as a recipe for improvement. Most of the time, an LLM is used to generate new candidates.

Below is a new candidate generated for the example. Even though the original prompt does not specify that the response should be a single word, the RPE process can generate a more concise and exact candidate based on the expected responses.

```txt
What is the sentiment of the following input?
Respond with only a single word: 'positive', 'negative', or 'neutral'.
<<input>>
```

## Candidate evaluation

The new candidates do not necessarily perform better than the original ones. For this reason, the new candidates are evaluated. Typically, they are evaluated on the same dataset as the original prompts. The two evaluations allow the prompts to be compared.

## Candidate selection

This step decides which candidates to pick and which to discard. The new candidates that perform better than the original ones are picked. New and old candidates that do not perform better are discarded. This way, a pool of good candidates is maintained.

Other methods to select candidates are:
- top-k best candidates,
- weighted multi-metric selection, where a score is built from multiple metrics and weights,
- candidates that pass evaluations that failed before (escape local optima).

## Stopping criterion

The process stops when a stopping criterion is met. The stopping criterion can be a maximum number of iterations, no performance improvement for a number of iterations, or a maximum number of tokens used.

If the process is not stopped, the candidates selected in the previous steps are used in the next iteration. The process starts again by generating responses for the candidates and dataset entries.