import { RPEResponseProcessor } from '../rpe-response/index.js';

/**
 * Input for the traverse RPE executor output processor.
 * @category Reflective Prompt Evolution
 */
export interface TraverseRPEExecutorOutputProcessorInput {
  /**
   * Response processor to use for processing the responses.
   */
  responseProcessor: RPEResponseProcessor;
}