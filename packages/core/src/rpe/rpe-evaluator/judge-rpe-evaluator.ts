import { DefaultModelProvider } from '../../model-provider/index.js';
import { scalar, SCALAR_SCORING_DEFAULT } from '../../llm-as-a-judge/index.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import { 
  RPEEvaluator,
  RPEEvaluatorInfo,
  RPEEvaluatorInput,
  RPEEvaluatorOutput,
} from './rpe-evaluator-types.js';
import { JudgeRPEEvaluatorInput } from './judge-rpe-evaluator-types.js';
import { JUDGE_RPE_EVALUATOR_PROMPT } from './judge-rpe-evaluator-prompt.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';

/**
 * A RPE evaluator that uses a LLM-as-a-judge to evaluate a candidate.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE evaluator.
 * @returns An RPE evaluator that uses a LLM-as-a-judge to evaluate a candidate.
 */
export function judgeRPEEvaluator(
  input: JudgeRPEEvaluatorInput,
): RPEEvaluator {
  const { 
    modelName,
    modelProvider,
    modelParameters,
    scoringScale = SCALAR_SCORING_DEFAULT,
    metrics,
  } = input;

  return {
    run: async (input: RPEEvaluatorInput): Promise<RPEEvaluatorOutput> => {
      const { candidate, datasetEntry, response, expectedResponse } = input;

      // do plain LLM-as-a-judge without expected response
      if (!expectedResponse) {
        const result = await scalar({
          modelName,
          modelProvider,
          modelParameters,
          prompt: candidate.candidate,
          response: response,
          scoringScale,
          metrics,
        });
        return {
          candidateRef: candidateRefFromCandidate(candidate),
          datasetEntry,
          response,
          score: result.result.normalizedScore,
          reasoning: result.reasoning,
          metrics: result.result.metrics,
          usage: result.usage,
        }
      }

      // do LLM-as-a-judge with expected response
      const result = await scalar({
        modelName,
        modelProvider,
        modelParameters,
        prompt: candidate.candidate,
        response: response,
        scoringScale,
        metrics,
        evalPrompt: JUDGE_RPE_EVALUATOR_PROMPT,
        additionalPromptValues: {
          expected_response: expectedResponse,
        },
      });
      return {
        candidateRef: candidateRefFromCandidate(candidate),
        datasetEntry,
        response,
        score: result.result.normalizedScore,
        reasoning: result.reasoning,
        metrics: result.result.metrics,
        usage: result.usage,
      }
    },

    getInfo: async (): Promise<RPEEvaluatorInfo> => {
      const modelProvider = input.modelProvider ?? new DefaultModelProvider();
      return {
        name: 'LLM-as-a-judge Evaluator',
        properties: [
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the evaluation.',
          },
          ...modelParametersToRPEInfo(modelParameters),
        ],
      };
    },
  };
}