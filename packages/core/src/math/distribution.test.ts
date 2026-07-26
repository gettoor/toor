import { DistributionRange } from './distribution-types.js';
import { distributeScores } from './distribution.js';

function createRanges(): DistributionRange[] {
  return [
    { min: 0, max: 0.25, count: 0 },
    { min: 0.25, max: 0.5, count: 0 },
    { min: 0.5, max: 0.75, count: 0 },
    { min: 0.75, max: 1, count: 0 },
  ];
}

function expectRangeCloseTo(
  actual: DistributionRange,
  expected: DistributionRange,
) {
  expect(actual.min).toBeCloseTo(expected.min);
  expect(actual.max).toBeCloseTo(expected.max);
  expect(actual.count).toBe(expected.count);
}

describe('distributeScores', () => {
  it('places scores into ranges with min inclusive and max exclusive', () => {
    const ranges = createRanges();
    const result = distributeScores([0, 0.24, 0.25, 0.49, 0.5, 0.74], ranges);

    expect(result).toHaveLength(4);
    expectRangeCloseTo(result[0], { min: 0, max: 0.25, count: 2 });
    expectRangeCloseTo(result[1], { min: 0.25, max: 0.5, count: 2 });
    expectRangeCloseTo(result[2], { min: 0.5, max: 0.75, count: 2 });
    expectRangeCloseTo(result[3], { min: 0.75, max: 1, count: 0 });
  });

  it('puts scores equal to or above final max into the last range', () => {
    const ranges = createRanges();
    const result = distributeScores([1, 1.5, 10], ranges);

    expect(result).toHaveLength(4);
    expectRangeCloseTo(result[0], { min: 0, max: 0.25, count: 0 });
    expectRangeCloseTo(result[1], { min: 0.25, max: 0.5, count: 0 });
    expectRangeCloseTo(result[2], { min: 0.5, max: 0.75, count: 0 });
    expectRangeCloseTo(result[3], { min: 0.75, max: 1, count: 3 });
  });

  it('returns and mutates the same ranges array', () => {
    const ranges = createRanges();
    const result = distributeScores([0.1, 0.3, 0.8], ranges);

    expect(result).toBe(ranges);
    expect(result.map(range => range.count)).toEqual([1, 1, 0, 1]);
  });

  it('does not count scores below the first range minimum', () => {
    const ranges = createRanges();
    const result = distributeScores([-1, -0.1, 0.1], ranges);

    expect(result.map(range => range.count)).toEqual([1, 0, 0, 0]);
  });
});
