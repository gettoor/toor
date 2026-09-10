import { RPEState } from '../rpe-state/index.js';
import { minimumScoreRPEStop } from './minimum-score-rpe-stop.js';

function createState(scores?: number[]): RPEState {
  return {
    metadata: {},
    iteration: {
      candidateAggregatedEvaluations: scores?.map(aggregatedScore => ({
        aggregatedScore,
      })),
    },
  } as RPEState;
}

describe('minimumScoreRPEStop', () => {
  it('does not stop when every aggregated score is below the minimum', async () => {
    const stop = minimumScoreRPEStop({ score: 0.8 });

    await expect(stop(createState([0.4, 0.79, 0.5]))).resolves.toEqual({
      stop: false,
    });
  });

  it('stops when an aggregated score equals the minimum', async () => {
    const stop = minimumScoreRPEStop({ score: 0.8 });

    await expect(stop(createState([0.4, 0.8, 0.5]))).resolves.toEqual({
      stop: true,
      stopReason: 'Minimum score of 0.80 reached',
    });
  });

  it('stops when an aggregated score exceeds the minimum', async () => {
    const stop = minimumScoreRPEStop({ score: 0.8 });

    await expect(stop(createState([0.9]))).resolves.toEqual({
      stop: true,
      stopReason: 'Minimum score of 0.80 reached',
    });
  });

  it('stops if any candidate reaches the minimum, not only the first', async () => {
    const stop = minimumScoreRPEStop({ score: 0.75 });

    await expect(stop(createState([0.1, 0.2, 0.75]))).resolves.toEqual({
      stop: true,
      stopReason: 'Minimum score of 0.75 reached',
    });
  });

  it('does not stop when the evaluation list is empty', async () => {
    const stop = minimumScoreRPEStop({ score: 0.5 });

    await expect(stop(createState([]))).resolves.toEqual({ stop: false });
  });

  it('does not stop when the evaluation list is missing', async () => {
    const stop = minimumScoreRPEStop({ score: 0.5 });

    await expect(stop(createState())).resolves.toEqual({ stop: false });
  });

  it('uses a custom stop reason when provided', async () => {
    const stop = minimumScoreRPEStop({
      score: 0.5,
      stopReason: 'custom stop reason',
    });

    await expect(stop(createState([0.5]))).resolves.toEqual({
      stop: true,
      stopReason: 'custom stop reason',
    });
  });

  it('does not use the custom stop reason when continuing', async () => {
    const stop = minimumScoreRPEStop({
      score: 0.9,
      stopReason: 'custom stop reason',
    });

    await expect(stop(createState([0.5]))).resolves.toEqual({ stop: false });
  });

  it('formats the default stop reason to two decimal places', async () => {
    const stop = minimumScoreRPEStop({ score: 1 });

    await expect(stop(createState([1]))).resolves.toEqual({
      stop: true,
      stopReason: 'Minimum score of 1.00 reached',
    });
  });
});
