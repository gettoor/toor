import { InternalToorError, ToorError } from '../../errors/index.js';
import {
  PerFieldRPEEvaluatorField,
  PerFieldRPEEvaluatorFieldEvaluatorOutput,
  PerFieldRPEEvaluatorFieldEvaluator,
} from './per-field-rpe-evaluator-types.js';
import {
  ExactStringRPEFieldEvaluatorInput,
} from './exact-string-rpe-field-evaluator-types.js';
import { quoteField } from './per-field-rpe-evaluator-utils.js';

/**
 * Exact string RPE field evaluator. It makes strict string comparison between
 * the response and the expected response. Returns score 1 if the response is
 * exactly the same as the expected response, 0 otherwise.
 * @category Reflective Prompt Evolution
 * @param input - Input for the exact string RPE field evaluator.
 * @returns Exact string RPE field evaluator.
 */
export function exactStringRPEFieldEvaluator(
  input?: ExactStringRPEFieldEvaluatorInput,
): PerFieldRPEEvaluatorFieldEvaluator<string> {
  const {
    caseSensitive = true,
    matchReasoning = defaultMatchReasoning,
    mismatchReasoning = defaultMismatchReasoning,
  } = input ?? {};
  const matchReasoningForMetrics =
    input?.matchReasoningForMetrics ?? matchReasoning;
  const mismatchReasoningForMetrics =
    input?.mismatchReasoningForMetrics ?? mismatchReasoning;

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
        `Expected value must be a string for the exact string field ` +
        `evaluator for field ${ToorError.quote(field.field)}`
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
        reasoning: matchReasoning(
          field,
          value,
          expectedValue,
          caseSensitive,
        ),
        metrics: {
          [field.field + '_exact_match']: {
            normalizedScore: 1,
            reasoning: matchReasoningForMetrics(
              field,
              value,
              expectedValue,
              caseSensitive,
            ),
          },
        },
      };
    }

    // mismatch
    return {
      field: field.field,
      score: 0,
      reasoning: mismatchReasoning(
        field,
        value,
        expectedValue,
        caseSensitive,
      ),
      metrics: {
        [field.field + '_exact_match']: {
          normalizedScore: 0,
          reasoning: mismatchReasoningForMetrics(
            field,
            value,
            expectedValue,
            caseSensitive,
          ),
        },
      },
    };
  }
}

function defaultMatchReasoning(
  field: PerFieldRPEEvaluatorField,
  value: string,
  expectedValue: string,
  caseSensitive: boolean,
): string {
  if (!caseSensitive) {
    return `The value in the field ${quoteField(field)} matches ` +
      `the expected value, ignoring letter case.`;
  }
  return `The value in the field ${quoteField(field)} exactly ` +
    `matches the expected value.`;
}

function defaultMismatchReasoning(
  field: PerFieldRPEEvaluatorField,
  value: string,
  expectedValue: string,
  caseSensitive: boolean,
): string {
  if (!caseSensitive) {
    return `The value in the field ${quoteField(field)} does not match ` +
      `the expected value, even when letter case is ignored.`;
  }
  return `The value in the field ${quoteField(field)} does not match ` +
    `the expected value.`;
}
