import { CircularReferenceError } from './equal-errors.js';
import { deepEqual } from './equal.js';

describe('deepEqual', () => {
  describe('primitives', () => {
    it('returns true for equal primitives', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('a', 'a')).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
      expect(deepEqual(1n, 1n)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
    });

    it('treats NaN as equal to NaN', () => {
      expect(deepEqual(NaN, NaN)).toBe(true);
    });

    it('treats positive and negative zero as different', () => {
      expect(deepEqual(0, -0)).toBe(false);
    });

    it('returns false for different primitives', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('a', 'b')).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(1n, 2n)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it('returns false for different types', () => {
      expect(deepEqual(1, '1')).toBe(false);
      expect(deepEqual(0, false)).toBe(false);
      expect(deepEqual(1, true)).toBe(false);
      expect(deepEqual(null, 0)).toBe(false);
    });

    it('compares symbols, functions, and built-ins by reference', () => {
      const symbol = Symbol('a');
      const fn = () => undefined;
      const date = new Date(0);

      expect(deepEqual(symbol, symbol)).toBe(true);
      expect(deepEqual(symbol, Symbol('a'))).toBe(false);
      expect(deepEqual(fn, fn)).toBe(true);
      expect(deepEqual(fn, () => undefined)).toBe(false);
      expect(deepEqual(date, date)).toBe(true);
      expect(deepEqual(date, new Date(0))).toBe(false);
    });
  });

  describe('arrays', () => {
    it('returns true for equal arrays', () => {
      expect(deepEqual([], [])).toBe(true);
      expect(deepEqual([1, 'a', true], [1, 'a', true])).toBe(true);
    });

    it('returns true for nested arrays', () => {
      expect(deepEqual([1, [2, [3]]], [1, [2, [3]]])).toBe(true);
    });

    it('returns false when lengths differ', () => {
      expect(deepEqual([1, 2], [1])).toBe(false);
      expect(deepEqual([1], [1, 2])).toBe(false);
    });

    it('returns false when an element differs', () => {
      expect(deepEqual([1, 2, 3], [1, 9, 3])).toBe(false);
    });

    it('returns false for an array and a non-array', () => {
      expect(deepEqual([1], { 0: 1 })).toBe(false);
      expect(deepEqual([1], null)).toBe(false);
    });

    it('returns true for the same array reference', () => {
      const value = [1, { a: 2 }];
      expect(deepEqual(value, value)).toBe(true);
    });
  });

  describe('objects', () => {
    it('returns true for equal objects', () => {
      expect(deepEqual({}, {})).toBe(true);
      expect(deepEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
    });

    it('ignores key order', () => {
      expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    });

    it('returns true for nested objects and arrays', () => {
      expect(deepEqual(
        { a: { b: [1, { c: 2 }] } },
        { a: { b: [1, { c: 2 }] } },
      )).toBe(true);
    });

    it('returns false when a value differs', () => {
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it('returns false when keys differ', () => {
      expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);
      expect(deepEqual({ a: undefined }, {})).toBe(false);
    });

    it('returns false for an object and null', () => {
      expect(deepEqual({}, null)).toBe(false);
      expect(deepEqual(null, { a: 1 })).toBe(false);
    });

    it('returns true for the same object reference', () => {
      const value = { a: 1, b: [2] };
      expect(deepEqual(value, value)).toBe(true);
    });

    it('compares repeated references without treating them as circular', () => {
      const shared = { n: 1 };
      expect(deepEqual(
        { a: shared, b: shared },
        { a: { n: 1 }, b: { n: 1 } },
      )).toBe(true);
    });
  });

  describe('circular references', () => {
    it('returns true for the same circular reference', () => {
      const value: Record<string, unknown> = {};
      value.self = value;

      expect(deepEqual(value, value)).toBe(true);
    });

    it('throws when an object references itself', () => {
      const left: Record<string, unknown> = { name: 'left' };
      left.self = left;

      const right: Record<string, unknown> = { name: 'left' };
      right.self = right;

      expect(() => deepEqual(left, right)).toThrow(new CircularReferenceError());
    });

    it('throws when an array references itself', () => {
      const left: unknown[] = [1];
      left.push(left);

      const right: unknown[] = [1];
      right.push(right);

      expect(() => deepEqual(left, right)).toThrow(new CircularReferenceError());
    });

    it('throws when objects reference each other', () => {
      const leftA: Record<string, unknown> = {};
      const leftB: Record<string, unknown> = { other: leftA };
      leftA.other = leftB;

      const rightA: Record<string, unknown> = {};
      const rightB: Record<string, unknown> = { other: rightA };
      rightA.other = rightB;

      expect(() => deepEqual(leftA, rightA)).toThrow(new CircularReferenceError());
    });
  });
});
