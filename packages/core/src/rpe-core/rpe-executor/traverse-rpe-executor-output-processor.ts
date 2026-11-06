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
  const { responseProcessor } = input;

  return {
    process: async (output: RPEExecutorOutput) => {
      for (const response of output.responses) {
        if (typeof response.response === 'string') {
          continue;
        }
        const newResponse = await responseProcessor.process(
          response.response,
        );
        response.response = newResponse;
      }

      return output;
    },

    getInfo: async () => {
      const responseProcessorInfo = await responseProcessor.getInfo();
      return {
        name: 'Traverse Executor Output Processor',
        properties: [
          {
            key: 'responseProcessor',
            value: responseProcessorInfo.name,
            description: 'Processor for processing the response.',
          }
        ],
      };
    },
  };
}
