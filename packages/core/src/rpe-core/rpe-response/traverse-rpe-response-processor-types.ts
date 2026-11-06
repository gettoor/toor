import { 
  RPEResponseArrayProcessor,
  RPEResponseObjectProcessor,
  RPEResponseStringProcessor,
} from './rpe-response-types.js';

/**
 * Input for the traverse RPE response processor.
 * @category Reflective Prompt Evolution
 */
export interface TraverseRPEResponseProcessorInput {
  /**
   * Callback to execute when a response is a string.
   */
  onStringResponse?: RPEResponseStringProcessor;
  
  /**
   * Callback to execute for each object of a response.
   */
  onObject?: RPEResponseObjectProcessor;

  /**
   * Callback to execute for each array of a response.
   */
  onArray?: RPEResponseArrayProcessor;
}