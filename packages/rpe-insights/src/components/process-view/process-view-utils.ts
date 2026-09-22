import { 
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPEIteration,
  type RPECandidate,
  RPEDatasetEntry,
  RPEInsights,
} from '@gettoor/core';
import { CandidateDetailsData } from '../candidate-details';

export function getCandidateDetailsData(
  rpeInsights: RPEInsights,
  // datasetEntries: RPEDatasetEntry[],
  // candidates: RPECandidate[],
  // iterations: RPEIteration[],
  selectedCandidateId: string | null,
): CandidateDetailsData | undefined {
  if (selectedCandidateId === null) {
    return undefined;
  }

  const { dataset, candidates, iterationHistory } = rpeInsights;
  const datasetEntries = dataset.entries;

  const findCandidateById = (candidateId: string) => {
    const candidate = candidates.find((candidate) => {
      return candidate.candidateId === candidateId;
    });
    if (candidate === undefined) {
      throw new Error(`Candidate ${candidateId} not found`);
    }
    return candidate;
  };

  const findAggregatedEvaluationByCandidateId = (
    aggregatedEvaluations: RPEAggregatorOutput[],
    candidateId: string,
  ): RPEAggregatorOutput | undefined => {
    const aggregatedEvaluation = aggregatedEvaluations.find(
      aggregatedEvaluation => {
        return aggregatedEvaluation.candidateRef.candidateId === candidateId;
      },
    );
    return aggregatedEvaluation;
  };

  const findAnalysisByCandidateId = (
    analyses: RPEAnalyzerOutput[],
    candidateId: string
  ): RPEAnalyzerOutput | undefined => {
    return analyses.find(analysis => {
      return analysis.candidateRef.candidateId === candidateId;
    });
  };

  // seed candidates
  const firstIteration = iterationHistory[0];
  const seedCandidateRef = (firstIteration.candidateRefs ?? []).find(
    candidateRef => {
      return candidateRef.candidateId === selectedCandidateId;
    },
  );
  if (seedCandidateRef !== undefined) {
    return {
      datasetEntries,
      candidate: findCandidateById(seedCandidateRef.candidateId),
      validationAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
        rpeInsights.aggregatedEvaluations,
        selectedCandidateId,
      ),
      trainingAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
        firstIteration.trainingAggregatedEvaluations,
        selectedCandidateId,
      ),
      trainingAnalysis: findAnalysisByCandidateId(
        firstIteration.trainingAnalyses,
        selectedCandidateId,
      ),
    };
  }

  let data: CandidateDetailsData | undefined;
  // candidates from each iteration
  for (const iteration of iterationHistory) {
    const candidate = iteration.generatedCandidates?.find(candidate => {
      return candidate.candidateRef.candidateId === selectedCandidateId;
    });
    if (candidate !== undefined) {
      data = {
        datasetEntries,
        candidate: findCandidateById(candidate.candidateRef.candidateId),
        changesSummary: candidate.changesSummary,
        changes: candidate.changes,
        validationAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
          rpeInsights.aggregatedEvaluations,
          selectedCandidateId,
        ),
        trainingAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
          iteration.trainingAggregatedEvaluations,
          selectedCandidateId,
        ),
        trainingAnalysis: findAnalysisByCandidateId(
          iteration.trainingAnalyses,
          selectedCandidateId,
        ),
      };
      break;
    }
  }
  if (prompt === undefined) {
    return undefined;
  }

  return data;
}