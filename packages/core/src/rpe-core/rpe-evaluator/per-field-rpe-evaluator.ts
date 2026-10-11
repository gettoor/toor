import { isObject, isFunction } from '../../lang/index.js';
import { average } from '../../math/index.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import { InvalidRPEResponseTypeError } from '../rpe-core/index.js';
import { InvalidRPEExpectedResponseTypeError } from '../rpe-dataset/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator-types.js';
import {
  NoPerFieldRPEEvaluatorError,
} from './per-field-rpe-evaluator-errors.js';
import {
  PerFieldRPEEvaluatorEvaluators,
  PerFieldRPEEvaluatorFieldEvaluatorOutput,
  PerFieldRPEEvaluatorInput,
} from './per-field-rpe-evaluator-types.js';

export function perFieldRPEEvaluator(
  input: PerFieldRPEEvaluatorInput,
): RPEEvaluator {
  const {
    evaluators,
    scoreAggregator = defaultScoreAggregator,
    reasoningAggregator = defaultReasoningAggregator,
  } = input;

  return {
    run: async (input: RPEEvaluatorInput) => {
      const { candidate, datasetEntry, response } = input;

      // response type must be an object
      const responseType = typeof response;
      if (!isObject(response)) {
        throw new InvalidRPEResponseTypeError(responseType, 'object');
      }

      // expected response must be an object
      const expectedResponseType = datasetEntry.expectedResponse;
      if (
        expectedResponseType != null &&
        !isObject(expectedResponseType)
      ) {
        throw new InvalidRPEExpectedResponseTypeError(
          typeof expectedResponseType,
          'object',
        );
      }

      // traverse the response and evaluate all the fields
      const outputs = await traverse(
        response,
        evaluators,
        expectedResponseType,
      );

      // aggregate the outputs
      const score = scoreAggregator(outputs);
      const reasoning = reasoningAggregator(outputs);

      return {
        candidateRef: candidateRefFromCandidate(candidate),
        datasetEntry,
        response,
        score,
        reasoning,
      };
    },

    getInfo: async () => {
      return {
        name: 'Per-field Evaluator',
        properties: [],
      };
    },
  }
}

async function traverse(
  response: Record<string, any> | Array<any>,
  evaluators: PerFieldRPEEvaluatorEvaluators,
  expectedResponse: Record<string, any> | undefined,
  parentField = '',
): Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput[]> {
  const outputs: PerFieldRPEEvaluatorFieldEvaluatorOutput[] = [];

  const evaluateField = async (
    field: string,
    value: any,
    expectedValue: any,
    evaluator: PerFieldRPEEvaluatorEvaluators[string],
  ) => {
    // evaluate if the evaluator is a function
    if (isFunction(evaluator)) {
      const output = await evaluator(
        value,
        expectedValue,
        { field },
      );
      outputs.push(output);
      return;
    }

    // go deeper if the value is an object/array
    if (isObject(value)) {
      const subOutputs = await traverse(
        value,
        evaluator,
        expectedValue,
        field,
      );
      outputs.push(...subOutputs);
      return;
    }

    // otherwise it's a primitive value with no evaluator which is an error
    throw new NoPerFieldRPEEvaluatorError(field);    
  }

  // array
  if (Array.isArray(response)) {
    for (let index = 0; index < response.length; index++) {
      const fieldIndex = `[${index}]`;
      const field = parentField.length > 0
        ? `${parentField}[${fieldIndex}]`
        : `[${fieldIndex}]`;
      const value = response[index];
      const expectedValue = expectedResponse?.[index];
      const evaluator = evaluators[index];

      await evaluateField(field, value, expectedValue, evaluator);
    }
    return outputs;
  }

  // object
  const keys = Object.keys(response);
  for (const key of keys) {
    const field = parentField.length > 0 ? `${parentField}.${key}` : key;
    const value = response[key];
    const expectedValue = expectedResponse?.[key];
    const evaluator = evaluators[key];

    await evaluateField(field, value, expectedValue, evaluator);
  }

  return outputs;
}

function defaultScoreAggregator(
  outputs: PerFieldRPEEvaluatorFieldEvaluatorOutput[],
): number {
  const scores = outputs.map(output => output.score);
  const allOne = scores.every(score => score === 1);
  return allOne ? 1 : 0;
}

function defaultReasoningAggregator(
  outputs: PerFieldRPEEvaluatorFieldEvaluatorOutput[],
): string {
  return outputs
    .map(output => `${output.field}: ${output.reasoning}`)
    .join('\n');
}