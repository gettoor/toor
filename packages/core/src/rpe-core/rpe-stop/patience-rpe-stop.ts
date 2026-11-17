import { resolveRPEMetadataValue } from '../rpe-core/index.js';
import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';
import { PatienceRPEStopInput } from './patience-rpe-stop-types.js';

/**
 * Patience RPE stop function. It stops the RPE process if there is
 * no improvement after a given number of iterations.
 * An iteration improves only when a generated candidate is selected and its
 * score exceeds the best selected score by the minimum improvement.
 * Selecting only candidates from the previous iteration, such as the seed,
 * counts as no improvement.
 * @param input - Input for the patience RPE stop function.
 * @returns Function to determine if the RPE should stop.
 */
export function patienceRPEStop(
  input: PatienceRPEStopInput,
): RPEStopFunc {
  const { minScoreImprovement, noImprovementCount } = input;

  return async (state: RPEState) => {
    const metadataKey = 'patienceRPEStopMetadata';
    const metadata = resolveRPEMetadataValue<PatienceRPEStopMetadata>(
      state,
      metadataKey,
      {
        bestScore: 0,
        noImprovementCount: 0,
      },
    );

    // check if there are generated candidates
    const validCandidates = state.iteration.validCandidates ?? [];
    const hasGeneratedCandidates = validCandidates.length > 0;

    // check if the best score has improved
    const bestScore = getBestScore(state);
    const difference = bestScore - metadata.bestScore;
    const isImproved = difference >= minScoreImprovement;

    // no improvement
    if (!hasGeneratedCandidates || !isImproved) {
      metadata.noImprovementCount++;
      state.metadata[metadataKey] = metadata;
      if (metadata.noImprovementCount >= noImprovementCount) {
        return {
          stop: true,
          stopReason: `No improvement in the best score ` +
            `after ${metadata.noImprovementCount} iterations`,
        };
      }
      return {
        stop: false,
      };
    }

    // improvement
    metadata.bestScore = bestScore;
    metadata.noImprovementCount = 0;
    state.metadata[metadataKey] = metadata;

    return {
      stop: false,
    };
  };
}

function getBestScore(state: RPEState): number {
  const evaluations = state.iteration.candidateAggregatedEvaluations ?? [];
  const bestScore = evaluations.reduce(
    (maxScore, evaluation) => {
      return Math.max(maxScore, evaluation.aggregatedScore);
    },
    0,
  );
  return bestScore;
}

type PatienceRPEStopMetadata = {
  /**
   * Best score from the last iteration.
   */
  bestScore: number;

  /**
   * Number of iterations without best score improvement.
   */
  noImprovementCount: number;
}