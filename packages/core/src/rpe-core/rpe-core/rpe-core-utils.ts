import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPEResponse } from './rpe-core-types.js';

/**
 * Convert a response to a string.
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