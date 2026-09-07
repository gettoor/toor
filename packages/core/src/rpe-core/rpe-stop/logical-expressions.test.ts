import { RPEState } from '../rpe-state/index.js';
import { rpeStopAnd, rpeStopOr } from './logical-expressions.js';

const state = {} as RPEState;

describe('rpeStopAnd', () => {
  it('stops when every expression stops', async () => {
    const expression = jest.fn(async () => ({
      stop: true as const,
      stopReason: 'expression stopped',
    }));

    await expect(rpeStopAnd([expression, expression], 'all stopped')(state))
      .resolves.toEqual({ stop: true, stopReason: 'all stopped' });
    expect(expression).toHaveBeenCalledTimes(2);
    expect(expression).toHaveBeenCalledWith(state);
  });

  it('returns false and short-circuits on the first false expression', async () => {
    const first = jest.fn(async () => ({ stop: false as const }));
    const second = jest.fn(async () => ({
      stop: true as const,
      stopReason: 'unused',
    }));

    await expect(rpeStopAnd([first, second])(state))
      .resolves.toEqual({ stop: false });
    expect(second).not.toHaveBeenCalled();
  });

  it('uses the default stop reason', async () => {
    await expect(rpeStopAnd([])(state)).resolves.toEqual({
      stop: true,
      stopReason: 'All expressions returned true',
    });
  });
});

describe('rpeStopOr', () => {
  it('returns the first true result and short-circuits', async () => {
    const first = jest.fn(async () => ({
      stop: true as const,
      stopReason: 'first stopped',
    }));
    const second = jest.fn(async () => ({ stop: false as const }));

    await expect(rpeStopOr([first, second])(state)).resolves.toEqual({
      stop: true,
      stopReason: 'first stopped',
    });
    expect(first).toHaveBeenCalledWith(state);
    expect(second).not.toHaveBeenCalled();
  });

  it('returns false when every expression returns false', async () => {
    const expression = jest.fn(async () => ({ stop: false as const }));

    await expect(rpeStopOr([expression, expression], 'none stopped')(state))
      .resolves.toEqual({ stop: false, stopReason: 'none stopped' });
    expect(expression).toHaveBeenCalledTimes(2);
  });

  it('uses the default stop reason', async () => {
    await expect(rpeStopOr([])(state)).resolves.toEqual({
      stop: false,
      stopReason: 'No expressions returned true',
    });
  });
});
