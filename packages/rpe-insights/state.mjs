/** Generates a random state for the RPE visualization. */

import { writeFile } from 'node:fs/promises';

/** The number of seed prompts to generate. */
const SEED_PROMPT_COUNT = 1;

/** The ratio of prompts to select for the next iteration. */
const SELECT_PROMPT_RATIO = 0.25;

/** The maximum number of prompts to select for the next iteration. */
const MAX_SELECTED_PROMPT_COUNT = 12;

/** The maximum number of new prompts to generate for each selected prompt. */
const MAX_NEW_PROMPT_COUNT = 5;

/** The number of iterations to generate. */
const ITERATION_COUNT = 16;

/** The minimum and maximum prompt lengths, in words. */
const MIN_PROMPT_WORD_COUNT = 200;
const MAX_PROMPT_WORD_COUNT = 900;

const DATASET_ENTRY_COUNT = 3;
const PASS_SCORE = 0.5;
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomScore() {
  return Number(Math.random().toFixed(2));
}

function lorem(minWords = 4, maxWords = 12) {
  const wordCount = randomInt(minWords, maxWords);
  const words = Array.from({ length: wordCount }, () => {
    return LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)];
  });
  const text = words.join(' ');
  return `${text[0].toUpperCase()}${text.slice(1)}.`;
}

function promptRef(promptId) {
  return { promptId };
}

function datasetEntry() {
  return {
    vars: {
      input: lorem(5, 14),
    },
    expectedResponse: lorem(2, 6),
  };
}

function response(promptId) {
  return {
    promptRef: promptRef(promptId),
    datasetEntry: datasetEntry(),
    response: lorem(8, 24),
    usage: {
      inputTokens: randomInt(10, 200),
      outputTokens: randomInt(10, 400),
    },
  };
}

function evaluation(output) {
  return {
    promptRef: output.promptRef,
    datasetEntry: output.datasetEntry,
    response: output.response,
    score: randomScore(),
    reasoning: lorem(12, 30),
    metrics: {},
  };
}

function scoreDistribution(evaluations) {
  return Array.from({ length: 10 }, (_, index) => {
    const min = index / 10;
    const max = (index + 1) / 10;
    return {
      min,
      max,
      count: evaluations.filter(({ score }) => {
        return score >= min && (index === 9 ? score <= max : score < max);
      }).length,
    };
  });
}

function aggregate(promptId, evaluations) {
  const passedEvaluations = evaluations.filter(({ score }) => {
    return score >= PASS_SCORE;
  });
  const failedEvaluations = evaluations.filter(({ score }) => {
    return score < PASS_SCORE;
  });
  const aggregatedScore = evaluations.reduce((sum, { score }) => {
    return sum + score;
  }, 0) / evaluations.length;

  return {
    promptRef: promptRef(promptId),
    passedEvaluations,
    failedEvaluations,
    aggregatedScore: Number(aggregatedScore.toFixed(3)),
    aggregatedMetrics: {},
    scoreDistribution: scoreDistribution(evaluations),
  };
}

function outputsForPrompts(promptRefs) {
  return promptRefs.flatMap(({ promptId }) => {
    return Array.from(
      { length: DATASET_ENTRY_COUNT },
      () => response(promptId),
    );
  });
}

function evaluationsForOutputs(promptRefs, outputs) {
  return promptRefs.map(({ promptId }) => ({
    promptRef: promptRef(promptId),
    evaluations: outputs
      .filter((output) => output.promptRef.promptId === promptId)
      .map(evaluation),
  }));
}

function aggregationsForEvaluations(evaluations) {
  return evaluations.map(({ promptRef: ref, evaluations: promptEvaluations }) => {
    return aggregate(ref.promptId, promptEvaluations);
  });
}

function analysis(promptId) {
  const list = () => Array.from(
    { length: randomInt(1, 3) },
    () => lorem(5, 14),
  );
  return {
    promptRef: promptRef(promptId),
    strengths: list(),
    weaknesses: list(),
    recommendations: list(),
    failurePatterns: list(),
  };
}

function generate() {
  const prompts = Array.from({ length: SEED_PROMPT_COUNT }, (_, index) => ({
    prompt: lorem(MIN_PROMPT_WORD_COUNT, MAX_PROMPT_WORD_COUNT),
    promptId: `seed${index}`,
  }));
  const iterationHistory = [];
  let currentPromptRefs = prompts.map(({ promptId }) => promptRef(promptId));

  for (let iterationNo = 0; iterationNo < ITERATION_COUNT; iterationNo++) {
    const responses = outputsForPrompts(currentPromptRefs);
    const evaluations = evaluationsForOutputs(currentPromptRefs, responses);
    const aggregatedEvaluations = aggregationsForEvaluations(evaluations);
    const analyses = currentPromptRefs.map(({ promptId }) => analysis(promptId));

    const candidates = currentPromptRefs.flatMap(({ promptId }) => {
      return Array.from(
        { length: randomInt(1, MAX_NEW_PROMPT_COUNT) },
        (_, candidateNo) => {
          const candidatePromptId = `i${iterationNo}p${promptId}c${candidateNo}`;
          prompts.push({
            prompt: lorem(MIN_PROMPT_WORD_COUNT, MAX_PROMPT_WORD_COUNT),
            parentPromptIds: [promptId],
            promptId: candidatePromptId,
          });
          return {
            promptRef: promptRef(candidatePromptId),
            changes: Array.from(
              { length: randomInt(1, 3) },
              () => ({
                description: lorem(4, 10),
                reasoning: lorem(8, 20),
              }),
            ),
          };
        },
      );
    });
    const candidatePromptRefs = candidates.map(({ promptRef: ref }) => ref);
    const candidateResponses = outputsForPrompts(candidatePromptRefs);
    const candidateEvaluations = evaluationsForOutputs(
      candidatePromptRefs,
      candidateResponses,
    );
    const candidateAggregatedEvaluations = aggregationsForEvaluations(
      candidateEvaluations,
    );
    const selectedPromptCount = Math.max(
      1,
      Math.min(
        MAX_SELECTED_PROMPT_COUNT,
        Math.ceil(candidates.length * SELECT_PROMPT_RATIO),
      ),
    );
    const selectedPromptRefs = [...candidateAggregatedEvaluations]
      .sort((a, b) => b.aggregatedScore - a.aggregatedScore)
      .slice(0, selectedPromptCount)
      .map(({ promptRef: ref }) => ref);

    iterationHistory.push({
      promptRefs: currentPromptRefs,
      responses,
      evaluations,
      aggregatedEvaluations,
      analyses,
      candidates,
      candidateResponses,
      candidateEvaluations,
      candidateAggregatedEvaluations,
      selectedPromptRefs,
    });
    currentPromptRefs = selectedPromptRefs;
  }

  return {
    prompts,
    iterationNo: ITERATION_COUNT - 1,
    iteration: iterationHistory.at(-1),
    iterationHistory,
  };
}

async function run() {
  const state = await generate();
  await writeFile('state-random.json', JSON.stringify(state, null, 2));
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});