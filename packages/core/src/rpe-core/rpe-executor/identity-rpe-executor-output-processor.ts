import {
  RPEExecutorOutput,
  RPEExecutorOutputProcessor,
} from './rpe-executor-types.js';

/**
 * Identity RPE executor output processor.
 * @category Reflective Prompt Evolution
 * @returns Identity RPE executor output processor.
 */
export function identityRPEExecutorOutputProcessor(
): RPEExecutorOutputProcessor {
  return {
    process: async (output: RPEExecutorOutput) => {
      return output;
    },

    getInfo: async () => {
      return { name: 'Identity Executor Output Processor' };
    },
  };
}