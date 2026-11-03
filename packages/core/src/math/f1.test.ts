
import { calculateF1 } from './f1.js';

describe('calculateF1', () => {
  const toSet = (array: any[]): Set<any> => {
    return new Set(array);
  };

  it('returns 1 when both arrays contain the same items', () => {
    expect(
      calculateF1(toSet(['cat', 'dog']), toSet(['cat', 'dog']))).toBe(1);
  });

  it('returns 1 when the same items appear in a different order', () => {
    expect(calculateF1(toSet([1, 2, 3]), toSet([3, 1, 2]))).toBe(1);
  });

  it('returns the harmonic mean of precision and recall for a partial overlap', () => {
    // tp = 2, fp = 1, fn = 1 -> F1 = 2/3
    expect(
      calculateF1(toSet(['a', 'b', 'c']), toSet(['a', 'b', 'd']))
    ).toBeCloseTo(2 / 3);
  });

  it('counts predicted items missing from expected as false positives', () => {
    // tp = 2, fp = 1, fn = 0 -> F1 = 0.8
    expect(calculateF1(toSet([1, 2]), toSet([1, 2, 3]))).toBeCloseTo(0.8);
  });

  it('counts expected items missing from predicted as false negatives', () => {
    // tp = 1, fp = 0, fn = 2 -> F1 = 0.5
    expect(calculateF1(toSet([1, 2, 3]), toSet([1]))).toBeCloseTo(0.5);
  });

  it('ignores duplicate items in the expected array', () => {
    expect(calculateF1(toSet([1, 1, 2]), toSet([1, 2]))).toBe(1);
  });

  it('ignores duplicate items in the predicted array', () => {
    expect(calculateF1(toSet([1, 2]), toSet([1, 1, 2]))).toBe(1);
  });

  it('calculates F1 using unique items only', () => {
    // expected = {1, 2, 3}, predicted = {1}
    // tp = 1, fp = 0, fn = 2 -> F1 = 0.5
    expect(calculateF1(toSet([1, 1, 2, 3]), toSet([1, 1]))).toBeCloseTo(0.5);
  });

  it('compares objects by reference', () => {
    const shared = { id: 1 };
    const other = { id: 1 };

    expect(calculateF1(toSet([shared]), toSet([shared]))).toBe(1);
    expect(calculateF1(toSet([shared]), toSet([other]))).toBe(0);
  });

  it('returns 0 when the arrays have no items in common', () => {
    expect(calculateF1(toSet([1, 2]), toSet([3, 4]))).toBe(0);
  });

  it('returns 1 when both arrays are empty', () => {
    expect(calculateF1(toSet([]), toSet([]))).toBe(1);
  });

  it('returns 0 when the predicted array is empty', () => {
    expect(calculateF1(toSet([1]), toSet([]))).toBe(0);
  });

  it('returns 0 when the expected array is empty', () => {
    expect(calculateF1(toSet([]), toSet([1]))).toBe(0);
  });
});
