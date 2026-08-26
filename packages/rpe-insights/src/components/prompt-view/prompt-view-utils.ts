import { 
  RPEAggregatorOutput,
  RPEAnalyzerOutput,
  RPEIteration,
  RPEPrompt,
  PromptGeneratorCandidate,
} from '@gettoor/core';
import { PromptDetailsData } from '../prompt-details';

export function getPromptDetailsData(
  prompts: RPEPrompt[],
  iterations: RPEIteration[],
  selectedPromptId: string | null,
): PromptDetailsData | undefined {
  if (selectedPromptId === null) {
    return undefined;
  }

  const findPromptById = (promptId: string) => {
    const prompt = prompts.find((prompt) => {
      return prompt.promptId === promptId;
    });
    if (prompt === undefined) {
      throw new Error(`Prompt ${promptId} not found`);
    }
    return prompt;
  };

  const findAggregatedEvaluationByPromptId = (
    iteration: RPEIteration,
    promptId: string
  ): RPEAggregatorOutput => {
    const { aggregatedEvaluations } = iteration;
    const aggregatedEvaluation = aggregatedEvaluations.find(
      aggregatedEvaluation => {
        return aggregatedEvaluation.promptRef.promptId === promptId;
      },
    );
    if (aggregatedEvaluation !== undefined) {
      return aggregatedEvaluation;
    }

    const { candidateAggregatedEvaluations } = iteration;
    const candidateAggregatedEvaluation = candidateAggregatedEvaluations.find(
      candidateAggregatedEvaluation => {
        return candidateAggregatedEvaluation.promptRef.promptId === promptId;
      },
    );
    if (candidateAggregatedEvaluation !== undefined) {
      return candidateAggregatedEvaluation;
    }
    throw new Error(
      `Aggregated evaluations for prompt ${promptId} not found`,
    );
  };

  const findAnalysisByPromptId = (
    iteration: RPEIteration,
    promptId: string
  ): RPEAnalyzerOutput | undefined => {
    const analysis = iteration.analyses.find(analysis => {
      return analysis.promptRef.promptId === promptId;
    });
    return analysis;
  };

  // seed prompts
  const firstIteration = iterations[0];
  const seedPromptRef = firstIteration.promptRefs.find(promptRef => {
    return promptRef.promptId === selectedPromptId;
  })
  if (seedPromptRef !== undefined) {
    return {
      prompt: findPromptById(seedPromptRef.promptId),
      aggregatedEvaluation: findAggregatedEvaluationByPromptId(
        firstIteration,
        selectedPromptId,
      ),
      analysis: findAnalysisByPromptId(firstIteration, selectedPromptId),
    };
  }

  let data: PromptDetailsData | undefined;
  // candidates from each iteration
  for (const iteration of iterations) {
    const candidate = iteration.candidates.find(candidate => {
      return candidate.promptRef.promptId === selectedPromptId;
    });
    if (candidate !== undefined) {
      data = {
        prompt: findPromptById(candidate.promptRef.promptId),
        promptChanges: candidate.changes,
        aggregatedEvaluation: findAggregatedEvaluationByPromptId(
          iteration,
          selectedPromptId,
        ),
        analysis: findAnalysisByPromptId(iteration, selectedPromptId),
      };
      break;
    }
  }
  if (prompt === undefined) {
    return undefined;
  }

  return data;
}