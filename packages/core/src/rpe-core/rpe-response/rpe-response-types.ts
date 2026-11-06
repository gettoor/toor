import { RPEProperties } from '../rpe-info/rpe-info-types.js';

/**
 * Response type for the RPE basic.
 * @category Reflective Prompt Evolution
 */
export type RPEResponse = string | Record<string, unknown> | unknown[];

/**
 * On string processor for the RPE response.
 * @category Reflective Prompt Evolution
 * @param string - String to process.
 * @returns Processed string.
 */
export type RPEResponseStringProcessor = (
  string: string,
) => Promise<string>;

/**
 * On object processor for the RPE response.
 * @category Reflective Prompt Evolution
 * @param object - Object to process.
 * @returns Processed object.
 */
export type RPEResponseObjectProcessor = (
  object: Record<string, unknown>,
) => Promise<Record<string, unknown>>;

/**
 * On array processor for the RPE response.
 * @category Reflective Prompt Evolution
 * @param array - Array to process.
 * @returns Processed array.
 */
export type RPEResponseArrayProcessor = (
  array: unknown[],
) => Promise<unknown[]>;

/**
 * Info for the RPE response processor.
 * @category Reflective Prompt Evolution
 */
export interface RPEResponseProcessorInfo {
  /**
   * Name of the processor.
   */
  name: string;

  /**
   * Description of the processor.
   */
  properties?: RPEProperties;
}

/**
 * Processor for the RPE response.
 * @category Reflective Prompt Evolution
 * @param response - Response to process.
 * @returns Processed response.
 */
export interface RPEResponseProcessor {
  /**
   * Process the response.
   * @param response - Response to process.
   * @returns Processed response.
   */
  process: (
    response: RPEResponse,
  ) => Promise<RPEResponse>;

  /**
   * Get the info for the processor.
   * @returns Info for the processor.
   */
  getInfo: () => Promise<RPEResponseProcessorInfo>;
}