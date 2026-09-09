import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { InternalToorError, ToorError } from '../../errors/index.js';
import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  MetricResult,
  ModelParameters,
  buildModelCallSettings,
} from '../../llm/index.js';
import {
  DefaultModelProvider,
  ModelProvider,
} from '../../model-provider/index.js';
import {
  RPEDatasetEntry,
  RPEState,
  modelParametersToRPEInfo,
  findCandidateById,
  buildSinglePromptCandidateModules,
  requireSinglePromptCandidateModule,
  RPECandidate,
  RPEEvaluatorOutput,
  RPEAggregatorOutput,
  RPEAnalyzerOutput,
  RPECandidateGenerator,
  RPECandidateGeneratorInfo,
  RPECandidateGeneratorInput,
  RPECandidateGeneratorOutput,
  RPECandidateGeneratorCandidate,
  RPEAnalyzerFailedExampleAnalysis,
} from '../../rpe-core/index.js';
import { 
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT,
} from './single-prompt-rpe-candidate-generator-prompt.js';
import {
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PARALLELISM,
} from './single-prompt-rpe-candidate-generator-consts.js';
import { 
  SinglePromptRPECandidateGeneratorInput,
  SinglePromptRPECandidateGeneratorOutputSchema,
} from './single-prompt-rpe-candidate-generator-types.js';

/**
 * Creates a single-prompt RPE candidate generator. The generate expects
 * a candidate with a single module `prompt`. It generates a candidate with
 * a single module `prompt` with the improved prompt.
 * @category Reflective Prompt Evolution
 * @param input - Input for the candidate generator.
 * @returns Candidate generator.
 */
export function singlePromptRPECandidateGenerator(
  input: SinglePromptRPECandidateGeneratorInput,
): RPECandidateGenerator {
  const {
    parallelism,
    includeFailedExpectedResponses = true,
    modelName,
    modelParameters,
    prompt: candidateGeneratorPrompt,
  } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (
      state: RPEState,
      input: RPECandidateGeneratorInput,
    ): Promise<RPECandidateGeneratorOutput> => {
      const { iteration } = state;
      const { aggregatedEvaluations, analyses } = iteration;
      if (!aggregatedEvaluations) {
        throw new InternalToorError(
          `Aggregated evaluations not found during candidate generation`,
        );
      }
      if (!analyses) {
        throw new InternalToorError(
          `Analyses not found during candidate generation`,
        );
      }

      // tasks
      const tasks = aggregatedEvaluations.map(async (aggregation, index) => {
        const aggregationCandidateId = aggregation.candidateRef.candidateId;

        // find analysis
        const analysis = analyses.find(analysis => {
          return analysis.candidateRef.candidateId === aggregationCandidateId;
        });
        if (!analysis) {
          throw new InternalToorError(
            `Analysis not found for candidate ` +
            `${ToorError.quote(aggregationCandidateId)} ` +
            `during candidate generation`,
          );
        }

        // generate candidate
        const newCandidateId = `i${state.iterationNo}p${index}`;
        const candidate = await generateCandidate(
          modelProvider,
          modelName,
          modelParameters,
          candidateGeneratorPrompt ??
            SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT.prompt,
          findCandidateById(state, aggregationCandidateId),
          newCandidateId,
          aggregation,
          analysis,
          state.datasetEntries,
          includeFailedExpectedResponses,
        );
        return candidate;
      });

      // run tasks in parallel
      const outputs = await runParallelBatchesOrThrow(
        tasks,
        parallelism ?? SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PARALLELISM,
      );
      return { candidates: outputs.flat() };
    },

    getInfo: async (): Promise<RPECandidateGeneratorInfo> => {
      return {
        name: 'Single-prompt Candidate Generator',
        properties: [
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the prompt generation.',
          },
          ...modelParametersToRPEInfo(modelParameters),
        ],
      };
    },
  };
}

async function generateCandidate(
  modelProvider: ModelProvider,
  modelName: string,
  modelParameters: ModelParameters | undefined,
  generatorPrompt: string,
  candidate: RPECandidate,
  newCandidateId: string,
  aggregation: RPEAggregatorOutput,
  analysis: RPEAnalyzerOutput,
  datasetEntries: RPEDatasetEntry[],
  includeExpectedResponse: boolean,
): Promise<RPECandidateGeneratorCandidate> {
  const prompt = replacePlaceholders(
    generatorPrompt,
    {
      original_prompt: requireSinglePromptCandidateModule(
        candidate.modules,
      ),
      aggregated_metrics: aggregatedMetricsForPrompt(
        aggregation.aggregatedMetrics ?? {},
      ),
      strengths: analysis.strengths.join('\n'),
      recommendations: analysis.recommendations.join('\n'),
      passed_evaluations: passedEvaluationsForPrompt(
        aggregation.passedEvaluations,
      ),
      failed_examples: failedExampleAnalysisForPrompt(
        datasetEntries,
        analysis.failedExampleAnalysis,
        includeExpectedResponse,
      ),
    },
    {
      ignorePlaceholders:
        SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT.ignorePlaceholders,
    },
  );

  const model = await modelProvider.getModel(modelName);
  const { output, usage } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: SinglePromptRPECandidateGeneratorOutputSchema,
    })
  });

  const generatedCandidate: RPECandidateGeneratorCandidate = {
    candidate: {
      candidateId: newCandidateId,
      modules: buildSinglePromptCandidateModules(output.prompt),
      parentCandidateIds: [candidate.candidateId],
    },
    changes: output.changes.map(change => ({
      description: change.description,
      reasoning: change.reasoning,
    })),
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
  return generatedCandidate;
}

function aggregatedMetricsForPrompt(
  metrics: Record<string, MetricResult>,
): string {
  if (Object.keys(metrics).length === 0) {
    return 'No aggregated metrics';
  }

  const names = Object.keys(metrics).sort();
  return names.map(name => {
    const { normalizedScore, reasoning } = metrics[name];
    const reasoningString = reasoning ? ` (${reasoning})` : '';
    return `- ${name}: ${normalizedScore.toFixed(2)}${reasoningString}`;
  }).join('\n');
}

function passedEvaluationsForPrompt(
  evaluations: RPEEvaluatorOutput[],
): string {
  return evaluations
    .map(evaluation => {
      return `- ${evaluation.reasoning}`;
    })
    .join('\n');
}

function failedExampleAnalysisForPrompt(
  datasetEntries: RPEDatasetEntry[],
  failedExampleAnalysis: RPEAnalyzerFailedExampleAnalysis[],
  includeFailedExpectedResponses: boolean,
): string {
  let output = '';

  failedExampleAnalysis
    .filter(analysis => {
      return datasetEntries.some(entry => {
        return entry.datasetEntryId === analysis.datasetEntryId;
      });
    })
    .forEach((analysis, index) => {
      output += `FAILED EXAMPLE ${index + 1}\n\n`;

      // dataset entry
      const datasetEntry = datasetEntries.find(entry => {
        return entry.datasetEntryId === analysis.datasetEntryId;
      })!;

      // input
      const varNames = Object.keys(datasetEntry.vars ?? {});
      if (varNames.length > 0) {
        output += 'Input:\n';
        varNames.forEach(name => {
          output += `${name}: ${datasetEntry.vars![name]}\n`;
        });
        output += '\n';
      }

      // response
      output += `Response:\n${analysis.response}\n\n`;

      // expected response
      if (includeFailedExpectedResponses) {
        if (datasetEntry.expectedResponse) {
          output += `Expected Response:\n` +
            `${datasetEntry.expectedResponse}\n\n`;
        }
        if (datasetEntry.expectedResponseReasoning) {
          output += `Expected Response Reasoning:\n` +
            `${datasetEntry.expectedResponseReasoning}\n\n`;
        }
      }

      // failure reason
      output += `Failure Reason:\n` +
        `${ analysis.failureReason } \n\n`;

      // plausible cause
      output += `Plausible Cause:\n` +
        `${ analysis.plausibleCause } \n\n`;
      
      // missing conceptual distinction
      output += `Missing Conceptual Distinction:\n` +
        `${ analysis.missingConceptualDistinction } \n\n`;
      
      // general rule
      output += `General Rule:\n` +
        `${analysis.generalRule}\n\n`;
      
      // regression risks
      output += `Regression Risks:\n` +
        `${analysis.regressionRisks.join('\n')}\n`;
    });

  return output;
}