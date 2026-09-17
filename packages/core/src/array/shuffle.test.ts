import { shuffleArray } from './shuffle.js';

function sortedCopy<T>(array: T[]): T[] {
  return [...array].sort();
}

describe('shuffleArray', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns an empty array unchanged', () => {
    const array: number[] = [];
    const result = shuffleArray(array);

    expect(result).toBe(array);
    expect(result).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    const array = ['only'];
    const result = shuffleArray(array);

    expect(result).toBe(array);
    expect(result).toEqual(['only']);
  });

  it('returns a permutation of the original elements', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const original = [...array];
    const result = shuffleArray(array);

    expect(result).toHaveLength(original.length);
    expect(sortedCopy(result)).toEqual(sortedCopy(original));
  });

  it('preserves duplicate values', () => {
    const array = [1, 1, 2, 2, 2];
    const result = shuffleArray(array);

    expect(result.filter(value => value === 1)).toHaveLength(2);
    expect(result.filter(value => value === 2)).toHaveLength(3);
  });

  it('preserves object identity of elements', () => {
    const first = { id: 1 };
    const second = { id: 2 };
    const third = { id: 3 };
    const array = [first, second, third];

    const result = shuffleArray(array);

    expect(result).toHaveLength(3);
    expect(result).toContain(first);
    expect(result).toContain(second);
    expect(result).toContain(third);
  });

  it('returns and mutates the same array', () => {
    const array = [1, 2, 3, 4];
    const result = shuffleArray(array);

    expect(result).toBe(array);
  });

  it('uses Math.random to shuffle', () => {
    const randomSpy = jest.spyOn(Math, 'random');

    shuffleArray([1, 2, 3, 4]);

    expect(randomSpy).toHaveBeenCalled();
  });

  it('can produce more than one ordering', () => {
    const orders = new Set<string>();

    for (let index = 0; index < 100; index++) {
      orders.add(shuffleArray([1, 2, 3, 4]).join(','));
    }

    expect(orders.size).toBeGreaterThan(1);
  });
});
