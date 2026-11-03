import { InternalToorError, ToorError } from '../../errors/index.js';
import { MetricResult } from '../../llm/llm-types.js';
import {
  calculatePrecision,
  calculateRecall,
  calculateF1,
  calculateExactMatchScore,
} from '../../math/index.js';
import {
  StringSetRPEFieldEvaluatorInput,
  StringSetRPEFieldEvaluatorInputValuesComparison,
} from './string-set-rpe-field-evaluator-types.js';
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
 * @category Reflective Prompt Evolution
 * @param input - Input for the string array field evaluator.
 * @returns String array field evaluation output.
 */
export function stringSetRPEFieldEvaluator(
  input?: StringSetRPEFieldEvaluatorInput,
): PerFieldRPEEvaluatorFieldEvaluator<string[]> {
  const {
    valueMapping = {},
    reasoning = defaultReasoning,
    score = defaultScore,
    metrics = defaultMetrics,
  } = input ?? {};

  return async (
    value: string[],
    expectedValue: string[] | undefined,
    field: PerFieldRPEEvaluatorField,
  ): Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput> => {
    // expected value is required
    if (expectedValue === undefined) {
      throw new InternalToorError(
        `No expected value for the string set field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // validate and convert to sets
    const isArrayOfStrings = (value: any): value is string[] => {
      return (
        Array.isArray(value) &&
        value.every((item) => typeof item === 'string')
      );
    };
    const isSetOfStrings = (value: any): value is Set<string> => {
      return (
        value instanceof Set &&
        Array.from(value).every((item) => typeof item === 'string')
      );
    };
    const toSet = (value: any, name: string): Set<string> => {
      if (isArrayOfStrings(value)) {
        return new Set(value);
      }
      if (isSetOfStrings(value)) {
        return value;
      }
      throw new InternalToorError(
        `${name} must be an array or a set of strings for the string ` +
        `set field evaluator for field ${ToorError.quote(field.field)}`
      );
    };

    // convert to sets and map values if mapping is specified
    const mapValues = (set: Set<string>): Set<string> => {
      const newSet = new Set<string>();
      for (const value of set) {
        const { value: mappedValue } = mapValue(value, valueMapping);
        newSet.add(mappedValue);
      }
      return newSet;
    };
    const mappedValues = mapValues(toSet(value, 'Value'));
    const mappedExpectedValues = toSet(expectedValue, 'Expected value');
    
    // common values
    const commonValues = new Set<string>();
    for (const value of mappedValues) {
      if (mappedExpectedValues.has(value)) {
        commonValues.add(value);
      }
    }

    // missing values
    const missingValues = new Set<string>();
    for (const value of mappedExpectedValues) {
      if (!mappedValues.has(value)) {
        missingValues.add(value);
      }
    }

    // extra values
    const extraValues = new Set<string>();
    for (const value of mappedValues) {
      if (!mappedExpectedValues.has(value)) {
        extraValues.add(value);
      }
    }

    const comparison: StringSetRPEFieldEvaluatorInputValuesComparison = {
      values: mappedValues,
      expectedValues: mappedExpectedValues,
      commonValues,
      missingValues,
      extraValues,
    };

    return {
      field: field.field,
      score: score(field, comparison),
      reasoning: reasoning(field, comparison),
      metrics: metrics(field, comparison),
    }
  }
}

function defaultReasoning(
  field: PerFieldRPEEvaluatorField,
  comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
): string {
  const { missingValues, extraValues } = comparison;

  // match
  if (missingValues.size === 0 && extraValues.size === 0) {
    return `The values in field "${field.field}" ` +
      `match the expected values.`;
  }

  let reasoning = '';
  const valuesToStrings = (values: Set<string>): string => {
    const max = 5;
    return [...values]
      .sort()
      .slice(0, max)
      .map((value) => `"${value}"`)
      .join(', ');
  };

  // missing
  if (missingValues.size > 0) {
    const plural = missingValues.size > 1 ? 's' : '';
    reasoning += `Missing ${missingValues.size} expected element${plural}: ` +
      `${valuesToStrings(missingValues)}. `;
  }

  // extra
  if (extraValues.size > 0) {
    const plural = extraValues.size > 1 ? 's' : '';
    reasoning += `Found ${extraValues.size} unexpected element${plural}: ` +
      `${valuesToStrings(extraValues)}. `;
  }

  reasoning += `In the field "${field.field}".`;
  return reasoning;
}

function defaultScore(
  field: PerFieldRPEEvaluatorField,
  comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
): number {
  const { expectedValues, values } = comparison;
  return calculateF1(expectedValues, values);
}

function defaultMetrics(
  field: PerFieldRPEEvaluatorField,
  comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
): Record<string, MetricResult> {
  const { expectedValues, values } = comparison;
  return {
    [field.field + '_exact_match']: {
      normalizedScore: calculateExactMatchScore(expectedValues, values),
    },
    [field.field + '_precision']: {
      normalizedScore: calculatePrecision(expectedValues, values),
    },
    [field.field + '_recall']: {
      normalizedScore: calculateRecall(expectedValues, values),
    },
    [field.field + '_f1']: {
      normalizedScore: calculateF1(expectedValues, values),
    },
  };
}