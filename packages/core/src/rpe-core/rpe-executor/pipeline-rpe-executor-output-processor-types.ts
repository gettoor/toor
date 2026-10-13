import { RPEExecutorOutputProcessor } from './rpe-executor-types.js';

/**
 * Input for the pipeline RPE executor output processor.
 * @category Reflective Prompt Evolution
 */
export interface PipelineRPEExecutorOutputProcessorInput {
  /**
   * Processors to sequentially execute in the pipeline.
   */
  processors: RPEExecutorOutputProcessor[];
}