import { InternalToorError, ToorError } from '../../errors/index.js';
import {
  PerFieldRPEEvaluatorField,
  PerFieldRPEEvaluatorFieldEvaluatorOutput,
  PerFieldRPEEvaluatorFieldEvaluator,
} from './per-field-rpe-evaluator-types.js';
import {
  ExactStringRPEFieldEvaluatorInput,
} from './per-field-rpe-field-evaluators-types.js';

export function exactStringRPEFieldEvaluator(
  input?: ExactStringRPEFieldEvaluatorInput,
): PerFieldRPEEvaluatorFieldEvaluator<string> {
  const {
    caseSensitive = true,
    matchReasoning,
    mismatchReasoning,
  } = input ?? {};

  return async (
    value: string,
    expectedValue: string | undefined,
    field: PerFieldRPEEvaluatorField,
  ): Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput> => {
    // expected value is required
    if (expectedValue === undefined) {
      throw new InternalToorError(
        `No expected value for the exact string field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // must be strings
    if (typeof value !== 'string') {
      throw new InternalToorError(
        `Value must be a string for the exact string field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }
    if (typeof expectedValue !== 'string') {
      throw new InternalToorError(
        `Expected value must be a string for the exact string field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // compare
    const toCompareString = (str: string) => {
      return caseSensitive ? str : str.toLowerCase();
    }
    const a = toCompareString(value);
    const b = toCompareString(expectedValue);
    const match = a.localeCompare(b) === 0;

    // match
    if (match) {
      return {
        field: field.field,
        score: 1,
        reasoning: resolveMatchReasoning(matchReasoning, caseSensitive),
      };
    }

    // mismatch
    return {
      field: field.field,
      score: 0,
      reasoning: resolveMismatchReasoning(
        mismatchReasoning,
        caseSensitive,
        value,
        expectedValue,
      ),
    };
  }
}

function resolveMatchReasoning(
  custom: string | undefined,
  caseSensitive: boolean,
): string {
  if (custom) {
    return custom;
  }
  if (!caseSensitive) {
    return 'The value matches the expected value, ignoring letter case.';
  }
  return 'The value exactly matches the expected value.';
}

function resolveMismatchReasoning(
  custom: string | undefined,
  caseSensitive: boolean,
  value: string,
  expectedValue: string,
): string {
  if (custom) {
    return custom;
  }
  if (!caseSensitive) {
    return `The value "${value}" does not match the expected value, ` +
      `"${expectedValue}", even when letter case is ignored.`;
  }
  return `The value "${value}" does not match ` +
    `the expected value "${expectedValue}".`;
}