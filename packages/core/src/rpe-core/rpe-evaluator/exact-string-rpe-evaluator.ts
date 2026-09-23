import { InternalToorError } from '../../errors/index.js';
import { booleanToRPEInfoValue } from '../rpe-info/index.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator-types.js';
import {
  ExactStringRPEEvaluatorInput,
} from './exact-string-rpe-evaluator-types.js';

/**
 * Exact string RPE evaluator. It makes strict string comparison between
 * the response and the expected response. Returns score 1 if the response is
 * exactly the same as the expected response, 0 otherwise. Uses LLM-as-a-judge
 * to generate metrics.
 * @param input - Input for the exact string RPE evaluator.
 * @returns Exact string RPE evaluator.
 */
export function exactStringRPEEvaluator(
  input?: ExactStringRPEEvaluatorInput,
): RPEEvaluator {
  const {
    caseSensitive = true,
    matchReasoning,
    mismatchReasoning,
  } = input ?? {};

  return {
    run: async (input: RPEEvaluatorInput) => {
      const { candidate, datasetEntry, response } = input;

      // expected response is required to compare
      if (!datasetEntry.expectedResponse) {
        throw new InternalToorError(
          `No expected response in dataset entry ` +
          `${ datasetEntry.datasetEntryId } for the exact string evaluator`
        );
      }

      // must be strings
      if (typeof response !== 'string') {
        throw new InternalToorError(
          `Response must be a string for the exact string evaluator`
        );
      }
      if (typeof datasetEntry.expectedResponse !== 'string') {
        throw new InternalToorError(
          `Expected response in dataset entry ` +
          `${datasetEntry.datasetEntryId} must be a string ` +
          `for the exact string evaluator`
        );
      }

      // compare
      const toCompareString = (str: string) => {
        return caseSensitive ? str : str.toLowerCase();
      }
      const a = toCompareString(response);
      const b = toCompareString(datasetEntry.expectedResponse);
      const match = a.localeCompare(b) === 0;

      // match
      if (match) {
        return {
          candidateRef: candidateRefFromCandidate(candidate),
          datasetEntry,
          response,
          score: 1,
          reasoning: resolveMatchReasoning(matchReasoning, caseSensitive),
        };
      }

      // mismatch
      return {
        candidateRef: candidateRefFromCandidate(candidate),
        datasetEntry,
        response,
        score: 0,
        reasoning: resolveMismatchReasoning(mismatchReasoning, caseSensitive),
      };
    },

    getInfo: async () => {
      return {
        name: 'Exact-string Evaluator',
        properties: [
          {
            key: 'caseSensitive',
            value: booleanToRPEInfoValue(caseSensitive),
            description: 'Whether to consider case sensitivity.',
          },
        ],
      };
    },
  };
}

function resolveMatchReasoning(
  custom: string | undefined,
  caseSensitive: boolean,
): string {
  if (custom) {
    return custom;
  }
  if (!caseSensitive) {
    return 'The response matches the expected response, ignoring letter case.';
  }
  return 'The response exactly matches the expected response.';
}

function resolveMismatchReasoning(
  custom: string | undefined,
  caseSensitive: boolean,
): string {
  if (custom) {
    return custom;
  }
  if (!caseSensitive) {
    return 'The response does not match the expected response, ' +
      'even when letter case is ignored.';
  }
  return 'The response does not match the expected response.';
}