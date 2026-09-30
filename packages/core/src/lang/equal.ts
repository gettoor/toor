import { CircularReferenceError } from './equal-errors.js';
import { isObject } from './types.js';

export function deepEqual(a: unknown, b: unknown): boolean {
  const visited = new WeakSet<object>();

  function equal(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
      return true;
    }

    const isArrayA = Array.isArray(a);
    const isArrayB = Array.isArray(b);

    // both arrays or not arrays
    if (isArrayA !== isArrayB) {
      return false;
    }

    // arrays
    if (isArrayA && isArrayB) {
      return equalCollection(a, b, () => {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!equal(a[i], b[i])) {
            return false;
          }
        }
        return true;
      });
    }

    const isObjectA = isPlainObject(a);
    const isObjectB = isPlainObject(b);

    if (isObjectA !== isObjectB) {
      return false;
    }

    // objects
    if (isObjectA && isObjectB) {
      return equalCollection(a, b, () => {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) {
          return false;
        }
        for (const key of keysA) {
          if (!Object.hasOwn(b, key) || !equal(a[key], b[key])) {
            return false;
          }
        }
        return true;
      });
    }

    // primitives
    return false;
  }

  function equalCollection(
    a: object,
    b: object,
    compare: () => boolean,
  ): boolean {
    if (visited.has(a) || visited.has(b)) {
      throw new CircularReferenceError();
    }
    visited.add(a);
    visited.add(b);
    try {
      return compare();
    } finally {
      visited.delete(a);
      visited.delete(b);
    }
  }

  return equal(a, b);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value) || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
