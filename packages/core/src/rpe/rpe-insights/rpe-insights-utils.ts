import { LLMModelUsage, LLMUsage } from '../../llm/index.js';
import { RPEInsights } from './rpe-insights-types.js';

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
    iteration.responses.forEach(response => {
      pushLLMUsage(response.usage);
    });

    iteration.evaluations.forEach(evaluation => {
      evaluation.evaluatorOutputs.forEach(output => {
        pushLLMUsage(output.usage);
      });
    });

    iteration.aggregatedEvaluations.forEach(aggregatedEvaluation => {
      pushLLMUsage(aggregatedEvaluation.usage);
    });

    iteration.analyses.forEach(analysis => {
      pushLLMUsage(analysis.usage);
    });

    iteration.candidates.forEach(candidate => {
      pushLLMUsage(candidate.usage);
    });

    iteration.candidateResponses.forEach(response => {
      pushLLMUsage(response.usage);
    });

    iteration.candidateEvaluations.forEach(evaluation => {
      evaluation.evaluatorOutputs.forEach(output => {
        pushLLMUsage(output.usage);
      });
    });

    iteration.candidateAggregatedEvaluations.forEach(aggregatedEvaluation => {
      pushLLMUsage(aggregatedEvaluation.usage);
    });
  });

  return usage;
}