import { InternalToorError, ToorError } from '../../errors/index.js';
import {
  StringArrayRPEFieldEvaluatorInput,
} from './string-array-rpe-field-evaluator-types.js';
import {
  PerFieldRPEEvaluatorField,
  PerFieldRPEEvaluatorFieldEvaluator,
  PerFieldRPEEvaluatorFieldEvaluatorOutput,
} from './per-field-rpe-evaluator-types.js';
import { mapValue } from './per-field-rpe-evaluator-value-mapping.js';

/**
 * Evaluates a string array field. The items in the array are compared one
 * by one. That is, the first item is compared to the first item of the expected
 * value, the second item is compared to the second item of the expected value,
 * and so on.
 * @param input - Input for the string array field evaluator.
 * @returns String array field evaluation output.
 */
export function stringArrayRPEFieldEvaluator(
  input?: StringArrayRPEFieldEvaluatorInput,
): PerFieldRPEEvaluatorFieldEvaluator<string[]> {
  const {
    valueMapping = {},
    compare = defaultComparator,
    sort: sortFunc,
    matchReasoning = defaultMatchReasoning,
    mappedMatchReasoning = defaultMappedMatchReasoning,
    mismatchReasoning = defaultMismatchReasoning,
    additionalItemsReasoning = defaultAdditionalItemsReasoning,
    missingItemsReasoning = defaultMissingItemsReasoning,
    overallMatchReasoning = defaultOverallMatchReasoning(),
  } = input ?? {};

  return async (
    value: string[],
    expectedValue: string[] | undefined,
    field: PerFieldRPEEvaluatorField,
  ): Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput> => {
    // expected value is required
    if (expectedValue === undefined) {
      throw new InternalToorError(
        `No expected value for the string array field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // must be arrays
    const isArrayOfStrings = (value: any): value is string[] => {
      return (
        Array.isArray(value) &&
        value.every((item) => typeof item === 'string')
      );
    };
    if (!isArrayOfStrings(value)) {
      throw new InternalToorError(
        `Value must be an array of strings for the string array field ` +
        `evaluator for field ${ToorError.quote(field.field)}`
      );
    }
    if (!isArrayOfStrings(expectedValue)) {
      throw new InternalToorError(
        `Expected value must be an array of strings for the string array ` +
        `field evaluator for field ${ToorError.quote(field.field)}`
      );
    }

    // sort if specified
    const sort = (items: string[]) => {
      return sortFunc ? sortFunc(items) : items;
    };
    const sortedValue = sort(value);
    const sortedExpectedValue = sort(expectedValue);

    // ind
    let hasIssues = false;
    const markHasIssues = () => {
      hasIssues = true;
    };

    // reasoning points
    let reasoningPoints: string[] = [];
    const addReasoningPoint = (point: string) => {
      reasoningPoints.push(point);
    };

    // match items
    let matchCount = 0;
    const length = Math.min(sortedValue.length, sortedExpectedValue.length);
    for (let index = 0; index < length; index++) {
      const valueRaw = sortedValue[index];
      const { value, isMapped } = mapValue(valueRaw, valueMapping);
      const expectedValue = sortedExpectedValue[index];
      if (compare(value, expectedValue)) {
        if (isMapped) {
          addReasoningPoint(
            mappedMatchReasoning(valueRaw, value, expectedValue, index),
          );
        }
        else {
          addReasoningPoint(matchReasoning(valueRaw, index));
        }
        matchCount++;
      }
      else {
        markHasIssues();
        addReasoningPoint(mismatchReasoning(valueRaw, expectedValue, index));
      }
    }

    // additional items
    let additionalItemsCount = 0;
    if (sortedValue.length > sortedExpectedValue.length) {
      markHasIssues();
      const additionalItems = sortedValue.slice(sortedExpectedValue.length);
      additionalItemsCount = additionalItems.length;
      addReasoningPoint(additionalItemsReasoning(additionalItems));
    }

    // missing items
    let missingItemsCount = 0;
    if (sortedExpectedValue.length > sortedValue.length) {
      markHasIssues();
      const missingItems = sortedExpectedValue.slice(sortedValue.length);
      missingItemsCount = missingItems.length;
      addReasoningPoint(missingItemsReasoning(missingItems));
    }

    // score
    const score = hasIssues ? 0 : 1;

    return {
      field: field.field,
      score,
      reasoning: hasIssues ? reasoningPoints.join('\n') : overallMatchReasoning,
    };
  }
}

function defaultComparator(a: string, b: string): boolean {
  return a.localeCompare(b) === 0;
}

function defaultMatchReasoning(value: string, index: number): string {
  return `The item at index ${index} matches the expected value.`;
}

function defaultMismatchReasoning(
  value: string,
  expectedValue: string,
  index: number,
): string {
  return (
    `The value ${value} at index ${index} ` +
    `does not match the expected value ${expectedValue}.`
  );
}

function defaultMappedMatchReasoning(
  valueRaw: string,
  value: string,
  expectedValue: string,
  index: number,
): string {
  return (
    `Response "${valueRaw}" maps to canonical value "${value}"; semantic match.`
  );
}

function defaultAdditionalItemsReasoning(items: string[]): string {
  return (
    `The following items are additional to the expected value: ` +
    `${items.join(', ')}.`
  );
}

function defaultMissingItemsReasoning(items: string[]): string {
  return (
    `The following items are missing from the expected value: ` +
    `${items.join(', ')}.`
  );
}

function defaultOverallMatchReasoning(): string {
  return 'The items in the array match the expected value.';
}