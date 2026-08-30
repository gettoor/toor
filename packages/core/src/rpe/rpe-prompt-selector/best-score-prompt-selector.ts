import { RPEState } from '../rpe-state/index.js';
import {
  RPEPromptSelector,
  RPEPromptSelectorInfo,
  RPEPromptSelectorInput,
  RPEPromptSelectorOutput,
} from './rpe-prompt-selector-types.js';
import {
  BestScorePromptSelectorInput,
} from './best-score-prompt-selector-types.js';

/**
 * Selects all the prompts with the highest aggregated score.
 * @category Reflective Prompt Evolution
 * @param input - Input for the prompt selector.
 * @returns Selected prompts.
 */
export function bestScorePromptSelector(
  input: BestScorePromptSelectorInput,
): RPEPromptSelector {
  const { candidatesOnly = false } = input;

  return {
    run: async (
      state: RPEState,
      input: RPEPromptSelectorInput,
    ): Promise<RPEPromptSelectorOutput> => {
      const allAggregatedEvaluations = [
        ...state.iteration.candidateAggregatedEvaluations ?? [],
      ];
      if (!candidatesOnly) {
        allAggregatedEvaluations.push(
          ...state.iteration.aggregatedEvaluations ?? [],
        );
      }

      // find the max score
      const maxScore = Math.max(
        ...allAggregatedEvaluations.map(aggregatedEvaluation => {
          return aggregatedEvaluation.aggregatedScore;
        }),
        0,
      );

      // find the prompts with the max score
      const maxScorePromptRefs = allAggregatedEvaluations
        .filter(aggregatedEvaluation => {
          return aggregatedEvaluation.aggregatedScore === maxScore;
        })
        .map(aggregatedEvaluation => {
          return aggregatedEvaluation.promptRef;
        });

      return {
        promptRefs: maxScorePromptRefs,
      }
    },

    getInfo: async (): Promise<RPEPromptSelectorInfo> => {
      return {
        name: 'Best Score Prompt Selector',
        properties: [
          {
            key: 'candidatesOnly',
            value: candidatesOnly,
            description: 'Whether to only consider candidates.',
          },
        ],
      };
    },
  };
}