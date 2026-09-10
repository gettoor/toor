import { resolveRPEMetadataValue } from '../rpe-core/index.js';
import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';
import { PatienceRPEStopInput } from './patience-rpe-stop-types.js';

/**
 * Patience RPE stop function. It stops the RPE process if there is
 * no improvement in the best score after a given number of iterations.
 * This stop picks the best score from the candidates generated in the last
 * iteration.
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

    // check if the best score has improved
    const bestScore = getBestScore(state);
    const difference = bestScore - metadata.bestScore;
    const isImproved = difference >= minScoreImprovement;

    // no improvement
    if (!isImproved) {
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