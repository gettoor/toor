/**
 * Replaces placeholders in a string with values.
 */
import yaml from 'yaml';
import { 
  InvalidFormatForObjectError,
  InvalidPlaceholderFormatError,
  NoValueForPlaceholderError,
} from './placeholders-errors.js';

export interface ReplacePlaceholderOutput {
  // The text with placeholders replaced with values.
  text: string;

  // The keys of the values that were not used.
  unusedValueKeys: string[];
}

/**
 * Replaces placeholders in a string with values.
 * The placeholders are of the form {{key}} in the string.
 * @param text - The text to replace placeholders in.
 * @param values - The values to replace placeholders with.
 * @returns The string with placeholders replaced with values.
 */
export function replacePlaceholders(
  text: string,
  values: Record<string, string>,
): ReplacePlaceholderOutput {
  const placeholderPattern = /\{\{([^{}]+)\}\}/g;

  // Find all placeholders in the text
  const placeholdersInText = new Set<string>();
  for (const match of text.matchAll(placeholderPattern)) {
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

    const placeholder = `{{${fullKey}}}`;
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