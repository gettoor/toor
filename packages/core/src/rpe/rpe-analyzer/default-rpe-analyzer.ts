import { DefaultModelProvider } from '../../model-provider/index.js';
import { RPEAnalyzer, RPEAnalyzerInput } from './rpe-analyzer-types.js';
import { DefaultRPEAnalyzerInput } from './default-rpe-analyzer-types.js';

export function defaultRPEAnalyzer(
  input: DefaultRPEAnalyzerInput,
): RPEAnalyzer {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return async (input: RPEAnalyzerInput) => {
    return {
      analysis: 'The prompt is good.',
    };
  };
}