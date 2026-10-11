import { InternalToorError, ToorError } from '../../errors/index.js';
import { average } from '../../index.js';
import {
  PerFieldRPEEvaluatorField,
  PerFieldRPEEvaluatorFieldEvaluator,
  PerFieldRPEEvaluatorFieldEvaluatorOutput,
} from '../index.js';
import {
  ArrayRPEFieldEvaluatorInput,
} from './array-rpe-field-evaluator-types.js';

export function arrayRPEFieldEvaluator<T = any>(
  input: ArrayRPEFieldEvaluatorInput<T>,
): PerFieldRPEEvaluatorFieldEvaluator<T[]> {
  const {
    itemEvaluator,
    scoreAggregator = average,
    reasoningAggregator = (reasonings) => reasonings.join('\n'),
    sort: sortFunc,
  } = input;

  return async (
    value: T[],
    expectedValue: T[] | undefined,
    field: PerFieldRPEEvaluatorField,
  ): Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput> => {
    // expected value is required
    if (expectedValue === undefined) {
      throw new InternalToorError(
        `No expected value for the array field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // must be arrays
    if (!Array.isArray(value)) {
      throw new InternalToorError(
        `Value must be an array for the array field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }
    if (!Array.isArray(expectedValue)) {
      throw new InternalToorError(
        `Expected value must be an array for the array field evaluator ` +
        `for field ${ToorError.quote(field.field)}`
      );
    }

    // sort
    const sort = (items: T[]) => {
      return sortFunc ? items.sort(sortFunc) : items;
    }
    const valueSorted = sort(value);
    const expectedValueSorted = sort(expectedValue);

    // evaluate each item
    const itemEvaluations = await Promise.all(
      valueSorted.map(async (item, index) => {
        return itemEvaluator(item, expectedValueSorted[index], {
          field: `${field.field}[${index}]`,
          arrayIndex: index,
        });
      }),
    );

    // aggregate
    const score = scoreAggregator(itemEvaluations.map((item) => item.score));
    const reasoning = reasoningAggregator(itemEvaluations.map((item) => {
      return item.reasoning;
    }));

    return {
      field: field.field,
      score,
      reasoning,
    }
  }
}