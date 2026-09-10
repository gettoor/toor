import { RPEState } from '../rpe-state/index.js';
import { andRPEStop, orRPEStop } from './logical-expressions.js';

const state = {} as RPEState;

describe('rpeStopAnd', () => {
  it('stops when every expression stops', async () => {
    const expression = jest.fn(async () => ({
      stop: true as const,
      stopReason: 'expression stopped',
    }));

    await expect(andRPEStop([expression, expression], 'all stopped')(state))
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

    await expect(andRPEStop([first, second])(state))
      .resolves.toEqual({ stop: false });
    expect(second).not.toHaveBeenCalled();
  });

  it('uses the default stop reason', async () => {
    await expect(andRPEStop([])(state)).resolves.toEqual({
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

    await expect(orRPEStop([first, second])(state)).resolves.toEqual({
      stop: true,
      stopReason: 'first stopped',
    });
    expect(first).toHaveBeenCalledWith(state);
    expect(second).not.toHaveBeenCalled();
  });

  it('returns false when every expression returns false', async () => {
    const expression = jest.fn(async () => ({ stop: false as const }));

    await expect(orRPEStop([expression, expression])(state))
      .resolves.toEqual({ stop: false });
    expect(expression).toHaveBeenCalledTimes(2);
  });
});
