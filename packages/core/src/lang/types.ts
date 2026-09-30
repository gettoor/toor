export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}