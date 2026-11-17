import { RPEState } from '../rpe-state/index.js';
import { patienceRPEStop } from './patience-rpe-stop.js';

function createState(scores?: number[]): RPEState {
  const state = {
    metadata: {},
    iteration: {},
  } as RPEState;
  if (scores !== undefined) {
    setScores(state, scores);
  }
  return state;
}

function setScores(state: RPEState, scores: number[]): void {
  const candidateIds = scores.map((_, index) => `generated-${index}`);
  state.iteration.candidateAggregatedEvaluations = scores.map(
    (aggregatedScore, index) => ({
      candidateRef: { candidateId: candidateIds[index] },
      aggregatedScore,
    }),
  ) as RPEState['iteration']['candidateAggregatedEvaluations'];
  state.iteration.validCandidates = candidateIds.map(candidateId => ({
    candidateRef: { candidateId },
  })) as RPEState['iteration']['validCandidates'];
  state.iteration.selectedCandidateRefs = candidateIds.map(candidateId => ({
    candidateId,
  }));
}

function setScoresWithPreviousCandidatesSelected(
  state: RPEState,
  scores: number[],
): void {
  const candidateIds = scores.map((_, index) => `generated-${index}`);
  state.iteration.candidateAggregatedEvaluations = scores.map(
    (aggregatedScore, index) => ({
      candidateRef: { candidateId: candidateIds[index] },
      aggregatedScore,
    }),
  ) as RPEState['iteration']['candidateAggregatedEvaluations'];
  state.iteration.validCandidates = candidateIds.map(candidateId => ({
    candidateRef: { candidateId },
  })) as RPEState['iteration']['validCandidates'];
  state.iteration.selectedCandidateRefs = [{ candidateId: 'seed' }];
}

describe('patienceRPEStop', () => {
  it('does not stop while the best score keeps improving', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.1,
    });
    const state = createState();

    setScores(state, [0.4]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.6]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.5, 0.8]);
    await expect(stop(state)).resolves.toEqual({ stop: false });
  });

  it('treats an increase equal to minScoreImprovement as improvement', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 1,
      minScoreImprovement: 0.25,
    });
    const state = createState([0.25]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.5]);
    await expect(stop(state)).resolves.toEqual({ stop: false });
  });

  it('does not stop before reaching the configured number of non-improvements', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 3,
      minScoreImprovement: 0.1,
    });
    const state = createState([0.5]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.55]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.4]);
    await expect(stop(state)).resolves.toEqual({ stop: false });
  });

  it('stops after the configured number of iterations without improvement', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.1,
    });
    const state = createState([0.5]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.55]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.52]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 2 iterations',
    });
  });

  it('resets the non-improvement count after a later improvement', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.1,
    });
    const state = createState([0.5]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.52]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.7]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.71]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.72]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 2 iterations',
    });
  });

  it('compares against the best score seen so far, not the previous iteration', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.1,
    });
    const state = createState([0.8]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.5]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.6]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 2 iterations',
    });
  });

  it('treats a missing evaluation list as a best score of 0', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 1,
      minScoreImprovement: 0.1,
    });
    const state = createState();

    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 1 iterations',
    });
  });

  it('uses the highest aggregated score in the current iteration', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 1,
      minScoreImprovement: 0.1,
    });
    const state = createState([0.1, 0.9, 0.3]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.2, 0.85, 0.4]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 1 iterations',
    });
  });

  it('counts keeping the previous candidates as no improvement', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.01,
    });
    const state = createState([0.5]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScoresWithPreviousCandidatesSelected(state, [0.8]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScoresWithPreviousCandidatesSelected(state, [0.9]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 2 iterations',
    });
  });

  it('resets the count when a generated candidate is selected again', async () => {
    const stop = patienceRPEStop({
      noImprovementCount: 2,
      minScoreImprovement: 0.01,
    });
    const state = createState([0.5]);

    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScoresWithPreviousCandidatesSelected(state, [0.9]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScores(state, [0.6]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScoresWithPreviousCandidatesSelected(state, [0.99]);
    await expect(stop(state)).resolves.toEqual({ stop: false });

    setScoresWithPreviousCandidatesSelected(state, [0.99]);
    await expect(stop(state)).resolves.toEqual({
      stop: true,
      stopReason:
        'No improvement in the best score after 2 iterations',
    });
  });
});
