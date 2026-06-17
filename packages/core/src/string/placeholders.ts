/**
 * Replaces placeholders in a string with values.
 */
import yaml from 'yaml';
import { 
  InvalidFormatForObjectError,
  InvalidPlaceholderFormatError,
  MissingPlaceholderError,
  NoValueForPlaceholderError,
  UnknownPlaceholdersError,
} from './placeholders-errors.js';

/**
 * Output of the {@link replacePlaceholders} function.
 * @category Utils
 */
export interface ReplacePlaceholderOutput {
  /**
   * The text with placeholders replaced with values.
   */
  text: string;

  /**
   * The keys of the values that were not used.
   */
  unusedValueKeys: string[];
}

const PLACEHOLDER_PATTERN = /<<([^<>]+)>>/g;

/**
 * Replaces placeholders in a string with values.
 * The placeholders are of the form `<key>` in the string.
 * @example
 * ```ts
 * const text = 'Hello <<name>>!';
 * const values = { name: 'John', age: '27' };
 * const output = replacePlaceholders(text, values);
 * // The output will be:
 * // {
 * //   text: 'Hello John!',
 * //   unusedValueKeys: ['age'],
 * // }
 * ```
 * @category Utils
 * @param text - The text to replace placeholders in.
 * @param values - The values to replace placeholders with.
 * @returns The string with placeholders replaced with values.
 */
export function replacePlaceholders(
  text: string,
  values: Record<string, string>,
): ReplacePlaceholderOutput {
  // Find all placeholders in the text
  const placeholdersInText = new Set<string>();
  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    placeholdersInText.add(match[1].trim());
  }
  
  // Check if all placeholders are provided
  const missingPlaceholders = [...placeholdersInText].filter((placeholder) => {
    const [ key, _ ] = parseFullKey(placeholder);
    return !(key in values);
  });
  if (missingPlaceholders.length > 0) {
    throw new NoValueForPlaceholderError(missingPlaceholders);
  }

  // Replace placeholders with values
  const unusedValueKeys = new Set<string>();
  for (const [fullKey, value] of Object.entries(values)) {
    const [ _, format ] = parseFullKey(fullKey);

    const placeholder = `<<${fullKey}>>`;
    if (text.includes(placeholder)) {
      text = text.replace(placeholder, formatValue(fullKey, value, format));
    } else {
      unusedValueKeys.add(fullKey);
    }
  }

  return {
    text,
    unusedValueKeys: [...unusedValueKeys],
  };
}

/**
 * Finds placeholders in a string.
 * @category Utils
 * @param text - The text to get the placeholders from.
 * @returns The placeholders in the text.
 */
export function findPlaceholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[1].trim());
}

/**
 * Validates that the required placeholders are present in the text.
 * @category Utils
 * @param text - The text to validate the placeholders in.
 * @param requiredPlaceholders - The required placeholders to validate.
 * @throws {MissingPlaceholderError} If a required placeholder is missing.
 */
export function requirePlaceholders(
  text: string,
  requiredPlaceholders: string[],
): void {
  const placeholdersInText = findPlaceholders(text);
  for (const requiredPlaceholder of requiredPlaceholders) {
    if (!placeholdersInText.includes(requiredPlaceholder)) {
      throw new MissingPlaceholderError(requiredPlaceholder);
    }
  }
}

/**
 * Rejects unknown placeholders in a string.
 * @category Utils
 * @param text - The text to reject unknown placeholders in.
 * @param expectedPlaceholders - The expected placeholders in the text.
 */
export function rejectUnknownPlaceholders(
  text: string,
  expectedPlaceholders: string[],
): void {
  const placeholdersInText = findPlaceholders(text);
  const unknownPlaceholders = placeholdersInText.filter((placeholder) => {
    return !expectedPlaceholders.includes(placeholder);
  });
  if (unknownPlaceholders.length > 0) {
    throw new UnknownPlaceholdersError(unknownPlaceholders);
  }
}

function parseFullKey(fullKey: string): string[] {
  const [ key, format ] = fullKey.split(':');
  return [ key, format ];
}

function formatValue(fullKey: string, value: any, format?: string): string {
  const STRING_FORMAT = 'string';
  format = format ?? STRING_FORMAT;

  if (format === 'json') {
    return JSON.stringify(value);
  }
  if (format === 'json-pretty') {
    return JSON.stringify(value, null, 2);
  }
  if (format === 'yaml' || format === 'yml') {
    return yaml.stringify(value);
  }
  if (format === STRING_FORMAT) {
    if (typeof value === 'object') {
      throw new InvalidFormatForObjectError(fullKey, format);
    }
    return value.toString();
  }
  throw new InvalidPlaceholderFormatError(format);
}
