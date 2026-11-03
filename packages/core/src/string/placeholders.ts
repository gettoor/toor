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
import { ReplacePlaceholdersOptions } from './placeholders-types.js';

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

export const PLACEHOLDER_OPENING = '{{';
export const PLACEHOLDER_CLOSING = '}}';
const PLACEHOLDER_PATTERN = new RegExp(
  `${PLACEHOLDER_OPENING}([^{}]+)${PLACEHOLDER_CLOSING}`,
  'g',
);

/**
 * Replaces placeholders in a string with values.
 * The placeholders are of the form <span v-pre>`{{key}}`</span> in the string.
 * @category Utils
 * @example
 * ```ts
 * const text = 'Hello {{name}}!';
 * const values = { name: 'John', age: '27' };
 * const output = replacePlaceholders(text, values);
 * // The output will be:
 * // {
 * //   text: 'Hello John!',
 * //   unusedValueKeys: ['age'],
 * // }
 * ```
 * @param text - The text to replace placeholders in.
 * @param values - The values to replace placeholders with.
 * @returns The string with placeholders replaced with values.
 */
export function replacePlaceholders(
  text: string,
  values: Record<string, any>,
  options?: ReplacePlaceholdersOptions,
): ReplacePlaceholderOutput {
  const ignorePlaceholders = options?.ignorePlaceholders ?? [];

  // find all placeholders in the text
  const placeholdersInText = new Set<string>();
  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    const placeholder = match[1].trim();
    if (ignorePlaceholders.includes(placeholder)) {
      continue;
    }
    placeholdersInText.add(placeholder);
  }
  
  // check if all placeholders are provided
  const missingPlaceholders = [...placeholdersInText].filter((placeholder) => {
    const [ key, _ ] = parseFullKey(placeholder);
    return !(key in values);
  });
  if (missingPlaceholders.length > 0) {
    throw new NoValueForPlaceholderError(missingPlaceholders, text);
  }

  // replace placeholders with values
  const unusedValueKeys = new Set<string>(Object.keys(values));
  for (const placeholder of placeholdersInText) {
    const [ key, format ] = parseFullKey(placeholder);
    const value = values[key];
    if (value === undefined) {
      throw new NoValueForPlaceholderError([placeholder], text);
    }
    const placeholderWithBrackets = `{{${placeholder}}}`;
    text = text.replace(
      placeholderWithBrackets,
      formatValue(key, value, format),
    );
    unusedValueKeys.delete(key);
  }

  return {
    text,
    unusedValueKeys: [...unusedValueKeys],
  };
}

/**
 * Finds all placeholders (including duplicates) in a string.
 * @category Utils
 * @param text - The text to get the placeholders from.
 * @returns The placeholders in the text.
 * @example
 * ```ts
 * const text = 'Hello {{name}}! {{name}} is {{age}} years old.';
 * const placeholders = findPlaceholders(text);
 * // The placeholders will be:
 * // ['name', 'name', 'age']
 * ```
 */
export function findAllPlaceholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[1].trim());
}

/**
 * Finds all unique placeholders in a string.
 * @category Utils
 * @param text - The text to get the unique placeholders from.
 * @returns The unique placeholders in the text.
 * @example
 * ```ts
 * const text = 'Hello {{name}}! {{name}} is {{age}} years old.';
 * const uniquePlaceholders = findUniquePlaceholders(text);
 * // The unique placeholders will be:
 * // ['name', 'age']
 * ```
 */
export function findUniquePlaceholders(text: string): string[] {
  return [...new Set(findAllPlaceholders(text))];
}

/**
 * Counts the number of times each placeholder appears in a string.
 * @param text - Text to count the placeholders in.
 * @returns Number of times each placeholder appears in the text.
 * @example
 * ```ts
 * const text = 'Hello {{name}}! {{name}} is {{age}} years old.';
 * const count = countPlaceholders(text);
 * // The count will be:
 * // { name: 2, age: 1 }
 * ```
 */
export function countPlaceholders(text: string): Record<string, number> {
  const placeholders = findAllPlaceholders(text);
  return placeholders.reduce(
    (acc, placeholder) => {
      acc[placeholder] = (acc[placeholder] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
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
  const placeholdersInText = findUniquePlaceholders(text);
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
  const placeholdersInText = findUniquePlaceholders(text);
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
