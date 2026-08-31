/**
 * Convert a camel case string to a sentence case string.
 * @param value - String to convert.
 * @returns Converted string.
 */
export function camelCaseToSentenceCase(value: string): string {
  if (!value) {
    return value;
  }

  const result = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Capitalize the first letter of a string.
 * @param value - String to capitalize.
 * @returns Capitalized string.
 */
export function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}