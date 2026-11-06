import { RPEResponse, RPEResponseProcessor } from './rpe-response-types.js';
import { processRPEResponse } from './rpe-response-utils.js';
import {
  TraverseRPEResponseProcessorInput,
} from './traverse-rpe-response-processor-types.js';

/**
 * Traverse RPE response processor. Processes a response by executing callbacks
 * for each object and array in the response.
 * @category Reflective Prompt Evolution
 * @param input - Input for the traverse RPE response processor.
 * @returns Traverse RPE response processor.
 */
export function traverseRPEResponseProcessor(
  input: TraverseRPEResponseProcessorInput,
): RPEResponseProcessor {
  const {
    onStringResponse = defaultOnStringResponse,
    onObject = defaultOnObject,
    onArray = defaultOnArray,
  } = input;

  return {
    process: async (response: RPEResponse) => {
      return await processRPEResponse(response, {
        onStringResponse,
        onObject,
        onArray,
      });
    },

    getInfo: async () => {
      return { name: 'Traverse Response Processor' };
    },
  };
}

function defaultOnStringResponse(
  string: string,
): Promise<string> {
  return Promise.resolve(string);
}

function defaultOnObject(
  object: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return Promise.resolve(object);
}

function defaultOnArray(
  array: unknown[],
): Promise<unknown[]> {
  return Promise.resolve(array);
}