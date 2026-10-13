import {
  RPEExecutorOutput,
  RPEExecutorOutputProcessor,
} from './rpe-executor-types.js';
import {
  TraverseRPEExecutorOutputProcessorInput,
} from './traverse-rpe-executor-output-processor-types.js';

/**
 * Traverse RPE executor output. Executes callbacks for each object and array
 * in the executor output.  Returns the original output if the output is
 * a string.
 * @category Reflective Prompt Evolution
 * @param input - Input for the traverse RPE executor output processor.
 * @returns Traverse RPE executor output processor.
 */
export function traverseRPEExecutorOutputProcessor(
  input: TraverseRPEExecutorOutputProcessorInput,
): RPEExecutorOutputProcessor {
  const {
    onResponseObject = defaultOnResponseObject,
    onResponseArray = defaultOnResponseArray,
  } = input;

  return {
    process: async (output: RPEExecutorOutput) => {
      for (const response of output.responses) {
        if (typeof response.response === 'string') {
          continue;
        }
        const newResponse = await traverseObject(
          response.response,
          onResponseObject,
          onResponseArray,
        );
        response.response = newResponse;
      }

      return output;
    },

    getInfo: async () => {
      return { name: 'Identity Executor Output Processor' };
    },
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function traverseObject(
  object: Record<string, unknown>,
  onObject:
    NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseObject']>,
  onArray:
    NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseArray']>,
): Promise<Record<string, unknown>> {
  const newObject = await onObject(object);
  const keys = Object.keys(newObject);
  for (const key of keys) {
    newObject[key] = await traverse(newObject[key], onObject, onArray);
  }
  return newObject; 
}

async function traverseArray(
  array: unknown[],
  onObject:
      NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseObject']>,
  onArray:
    NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseArray']>,
): Promise<unknown[]> {
  const newArray = await onArray(array);
  for (let index = 0; index < newArray.length; index++) {
    newArray[index] = await traverse(newArray[index], onObject, onArray);
  }
  return newArray;
}

async function traverse(
  value: unknown,
  onObject:
    NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseObject']>,
  onArray:
    NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseArray']>,
): Promise<unknown> {
  if (Array.isArray(value)) {
    return traverseArray(value, onObject, onArray);
  }
  if (isObject(value)) {
    return traverseObject(value as Record<string, unknown>, onObject, onArray);
  }
  return value;
}

function defaultOnResponseObject(
  object: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return Promise.resolve(object);
}

function defaultOnResponseArray(
  array: unknown[],
): Promise<unknown[]> {
  return Promise.resolve(array);
}