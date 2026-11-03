import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { buildModelCallSettings } from '../../llm/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { RPECandidate } from '../rpe-candidate/rpe-candidate-types.js';
import { 
  RPECandidateValidator,
  RPECandidateValidatorInput,
} from './rpe-candidate-validator-types.js';
import { 
  SEMANTIC_RPE_CANDIDATE_VALIDATOR_PROMPT,
} from './semantic-rpe-candidate-validator-prompt.js';
import { 
  SemanticRPECandidateValidatorInput,
  SemanticRPECandidateValidatorSchema,
} from './semantic-rpe-candidate-validator-types.js';

export function semanticRPECandidateValidator(
  input: SemanticRPECandidateValidatorInput,
): RPECandidateValidator {
  const { 
    contract,
    modelProvider = new DefaultModelProvider(),
    modelName,
    modelParameters,
  } = input;

  return {
    validate: async (input: RPECandidateValidatorInput) => {
      const model = await modelProvider.getModel(modelName);

      const candidateToPrompt = (candidate: RPECandidate) => {
        return Object
          .keys(candidate.modules)
          .sort()
          .map(key => {
            const module = candidate.modules[key];
            return `### Module: ${key}\n\n${module.content}`;
          })
          .join('\n\n----\n\n');
      };


      // build prompt
      const prompt = replacePlaceholders(
        SEMANTIC_RPE_CANDIDATE_VALIDATOR_PROMPT,
        {
          contract: contract,
          // TODO Support for multiple parent candidates
          parentModules: candidateToPrompt(input.parentCandidates[0]),
          candidateModules: candidateToPrompt(input.candidate),
        },
      );

      // generate text response
      const { output, usage } = await generateText({
        model: model.model,
        prompt: prompt.text,
        ...buildModelCallSettings(modelParameters),
        output: Output.object({
          schema: SemanticRPECandidateValidatorSchema,
        })
      });

      const violations = output.violations.map(violation => {
        const module = violation.module ? `Module: ${violation.module}` : '';
        return `${module} ` +
          `| Violated requirement: ${violation.requirement} ` +
          `| Evidence: ${violation.evidence} ` +
          `| Reasoning: ${violation.reasoning}`;
      });
      return {
        violations,
        usage: {
          modelUsage: [
            {
              modelName: model.name,
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
            },
          ],
        },
      };
    },

    getInfo: async () => {
      return {
        name: 'Semantic Candidate Validator',
        properties: [
          {
            key: 'contract',
            value: contract,
            description: 'Contract to validate.',
          },
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the validation.',
          },
          ...modelParametersToRPEInfo(modelParameters),
        ],
      };
    },
  };
}