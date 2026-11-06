import { InternalToorError, ToorError } from '../../errors/index.js';
import { 
  RPEResponse,
  RPEResponseArrayProcessor,
  RPEResponseObjectProcessor,
  RPEResponseStringProcessor,
} from './rpe-response-types.js';

/**
 * Convert a response to a string.
 * @category Reflective Prompt Evolution
 * @param response - Response to convert.
 * @param objectFormat - Format to use for the object.
 * @returns String representation of the response.
 */
export function responseToString(
  response: RPEResponse,
  objectFormat: 'json' = 'json',
): string {
  if (typeof response === 'string') {
    return response;
  }
  switch (objectFormat) {
    case 'json':
      return JSON.stringify(response);
    default:
      throw new InternalToorError(
        `Unsupported object format: ${ToorError.quote(objectFormat)}`,
      );
  }
}

/**
 * Check if a value is a response object.
 * @category Reflective Prompt Evolution
 * @param value - Value to check.
 * @returns True if the value is a response object, false otherwise.
 */
export function isRPEResponseObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Process an RPE response.
 * @category Reflective Prompt Evolution
 * @param response - Response to process.
 * @param callbacks - Callbacks to use for processing the response.
 * @returns Processed response.
 */
export async function processRPEResponse(
  response: RPEResponse,
  callbacks: {
    onObject?: RPEResponseObjectProcessor,
    onArray?: RPEResponseArrayProcessor,
    onStringResponse?: RPEResponseStringProcessor,
  },
): Promise<RPEResponse> {
  if (typeof response === 'string') {
    const identityOnString = (string: string) => Promise.resolve(string);
    const onString = callbacks.onStringResponse ?? identityOnString;
    return await onString(response);
  }

  return processRPEResponseUnknown(
    response,
    {
      onObject: callbacks.onObject,
      onArray: callbacks.onArray,
    },
  );
}

async function processRPEResponseUnknown(
  value: unknown,
  callbacks: {
    onObject?: RPEResponseObjectProcessor,
    onArray?: RPEResponseArrayProcessor,
  },
): Promise<RPEResponse> {
  if (Array.isArray(value)) {
    return processRPEResponseArray(value, callbacks);
  }
  if (isRPEResponseObject(value)) {
    return processRPEResponseObject(value, callbacks);
  }
  if (typeof value === 'string') {
    return value;
  }
  throw new InternalToorError(
    `Unsupported RPE response type ${ToorError.quote(typeof value)}`,
  );
}

async function processRPEResponseObject(
  object: Record<string, unknown>,
  callbacks: {
    onObject?: RPEResponseObjectProcessor,
    onArray?: RPEResponseArrayProcessor,
  },
): Promise<Record<string, unknown>> {
  const identityOnObject = (object: Record<string, unknown>) => {
    return Promise.resolve(object);
  };
  const onObject = callbacks.onObject ?? identityOnObject;
  const newObject = await onObject(object);
  const keys = Object.keys(newObject);
  for (const key of keys) {
    newObject[key] = await processRPEResponseUnknown(
      newObject[key],
      callbacks,
    );
  }
  return newObject;
}

async function processRPEResponseArray(
  array: unknown[],
  callbacks: {
    onObject?: RPEResponseObjectProcessor,
    onArray?: RPEResponseArrayProcessor,
  },
): Promise<unknown[]> {
  const identityOnArray = (array: unknown[]) => {
    return Promise.resolve(array);
  };
  const onArray = callbacks.onArray ?? identityOnArray;
  const newArray = await onArray(array);
  for (let index = 0; index < newArray.length; index++) {
    newArray[index] = await processRPEResponseUnknown(
      newArray[index],
      callbacks,
    );
  }
  return newArray;
}