import { RPEState } from '../rpe-state/index.js';
import { maximumIterationsRPEStop } from './maximum-iterations-rpe-stop.js';

function createState(historyLength: number): RPEState {
  return {
    iterationHistory: Array.from({ length: historyLength }, () => ({})),
  } as RPEState;
}

describe('maximumIterationsRPEStop', () => {
  it('does not stop when the history is shorter than maxIterations', async () => {
    const stop = maximumIterationsRPEStop({ maxIterations: 3 });

    await expect(stop(createState(0))).resolves.toEqual({ stop: false });
    await expect(stop(createState(1))).resolves.toEqual({ stop: false });
    await expect(stop(createState(2))).resolves.toEqual({ stop: false });
  });

  it('stops when the history length equals maxIterations', async () => {
    const stop = maximumIterationsRPEStop({ maxIterations: 3 });

    await expect(stop(createState(3))).resolves.toEqual({
      stop: true,
      stopReason: 'Maximum iterations of 3 reached',
    });
  });

  it('stops when the history is longer than maxIterations', async () => {
    const stop = maximumIterationsRPEStop({ maxIterations: 2 });

    await expect(stop(createState(4))).resolves.toEqual({
      stop: true,
      stopReason: 'Maximum iterations of 2 reached',
    });
  });

  it('uses a custom stop reason when provided', async () => {
    const stop = maximumIterationsRPEStop({
      maxIterations: 1,
      stopReason: 'custom stop reason',
    });

    await expect(stop(createState(1))).resolves.toEqual({
      stop: true,
      stopReason: 'custom stop reason',
    });
  });

  it('does not use the custom stop reason when continuing', async () => {
    const stop = maximumIterationsRPEStop({
      maxIterations: 2,
      stopReason: 'custom stop reason',
    });

    await expect(stop(createState(1))).resolves.toEqual({ stop: false });
  });

  it('stops immediately when maxIterations is 0', async () => {
    const stop = maximumIterationsRPEStop({ maxIterations: 0 });

    await expect(stop(createState(0))).resolves.toEqual({
      stop: true,
      stopReason: 'Maximum iterations of 0 reached',
    });
  });
});
