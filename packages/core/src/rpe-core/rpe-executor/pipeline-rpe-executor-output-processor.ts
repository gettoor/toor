import {
  RPEExecutorOutput,
  RPEExecutorOutputProcessor,
} from './rpe-executor-types.js';
import {
  PipelineRPEExecutorOutputProcessorInput,
} from './pipeline-rpe-executor-output-processor-types.js';

/**
 * Pipeline RPE executor output processor. A pipeline executes the processors
 * in the given order sequentially.
 * @category Reflective Prompt Evolution
 * @param input - Input for the pipeline RPE executor output processor.
 * @returns Pipeline RPE executor output processor.
 */
export function pipelineRPEExecutorOutputProcessor(
  input: PipelineRPEExecutorOutputProcessorInput,
): RPEExecutorOutputProcessor {
  return {
    process: async (output: RPEExecutorOutput) => {
      let lastOutput = output;
      for (const processor of input.processors) {
        lastOutput = await processor.process(lastOutput);
      }
      return lastOutput;
    },

    getInfo: async () => {
      return { name: 'Identity Executor Output Processor' };
    },
  };
}