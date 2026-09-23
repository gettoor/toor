import { LLMModelUsage, LLMUsage } from '../../llm/index.js';
import { RPEInput } from '../rpe-process/rpe-types.js';
import { RPEInsights, RPEInsightsInfo } from './rpe-insights-types.js';

/**
 * Sum the usage of the insights.
 * @category Reflective Prompt Evolution
 * @param insights - Insights to sum the usage of.
 * @returns Sum of the usage of the insights.
 */
export function sumRPEInsightsUsage(insights: RPEInsights): Required<LLMUsage> {
  const usage: Required<LLMUsage> = {
    modelUsage: [],
  };
  const pushModelUsage = (modelUsage: LLMModelUsage) => {
    const index = usage.modelUsage.findIndex(itr => {
      return itr.modelName === modelUsage.modelName;
    });
    if (index >= 0) {
      const existing = usage.modelUsage[index]!;
      existing.inputTokens! += modelUsage.inputTokens ?? 0;
      existing.outputTokens! += modelUsage.outputTokens ?? 0;
    }
    else {
      usage.modelUsage.push(modelUsage);
    }
  };
  const pushLLMUsage = (usage?: LLMUsage) => {
    if (!usage) {
      return;
    }
    usage.modelUsage.forEach(modelUsage => {
      pushModelUsage(modelUsage);
    });
  };

  insights.iterationHistory.forEach(iteration => {
    iteration.trainingResponses.forEach(response => {
      pushLLMUsage(response.usage);
    });

    iteration.trainingEvaluations.forEach(evaluation => {
      evaluation.evaluatorOutputs.forEach(output => {
        pushLLMUsage(output.usage);
      });
    });

    iteration.trainingAggregatedEvaluations.forEach(aggregatedEvaluation => {
      pushLLMUsage(aggregatedEvaluation.usage);
    });

    iteration.trainingAnalyses.forEach(analysis => {
      pushLLMUsage(analysis.usage);
    });

    iteration.generatedCandidates?.forEach(candidate => {
      pushLLMUsage(candidate.usage);
    });

    iteration.candidateResponses?.forEach(response => {
      pushLLMUsage(response.usage);
    });

    iteration.candidateEvaluations?.forEach(evaluation => {
      evaluation.evaluatorOutputs.forEach(output => {
        pushLLMUsage(output.usage);
      });
    });

    iteration.candidateAggregatedEvaluations?.forEach(aggregatedEvaluation => {
      pushLLMUsage(aggregatedEvaluation.usage);
    });
  });

  return usage;
}

/**
 * Builds the insights info for the RPE process.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE process.
 * @returns Insights info for the RPE process.
 */
export async function buildRPEInsightsInfo(
  input: RPEInput,
): Promise<RPEInsightsInfo> {
  return {
    executorInfo: await input.trainingExecutor.getInfo(),
    evaluatorInfo: await input.trainingEvaluator.getInfo(),
    aggregatorInfo: await input.aggregator.getInfo(),
    analyzerInfo: await input.analyzer.getInfo(),
    candidateGeneratorInfo: await input.candidateGenerator.getInfo(),
    candidateSelectorInfo: await input.candidateSelector.getInfo(),
    finalCandidateSelectorInfo: await input.finalCandidateSelector.getInfo(),
  };
}