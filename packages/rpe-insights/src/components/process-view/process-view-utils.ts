import { 
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPEIteration,
  type RPECandidate,
  RPEDatasetEntry,
} from '@gettoor/core';
import { CandidateDetailsData } from '../candidate-details';

export function getCandidateDetailsData(
  datasetEntries: RPEDatasetEntry[],
  candidates: RPECandidate[],
  iterations: RPEIteration[],
  selectedCandidateId: string | null,
): CandidateDetailsData | undefined {
  if (selectedCandidateId === null) {
    return undefined;
  }

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
    iteration: RPEIteration,
    candidateId: string
  ): RPEAnalyzerOutput | undefined => {
    const analysis = iteration.trainingAnalyses.find(analysis => {
      return analysis.candidateRef.candidateId === candidateId;
    });
    return analysis;
  };

  // seed candidates
  const firstIteration = iterations[0];
  const seedCandidateRef = firstIteration.candidateRefs.find(candidateRef => {
    return candidateRef.candidateId === selectedCandidateId;
  })
  if (seedCandidateRef !== undefined) {
    return {
      datasetEntries,
      candidate: findCandidateById(seedCandidateRef.candidateId),
      trainingAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
        firstIteration.trainingAggregatedEvaluations,
        selectedCandidateId,
      ),
      analysis: findAnalysisByCandidateId(firstIteration, selectedCandidateId),
    };
  }

  let data: CandidateDetailsData | undefined;
  // candidates from each iteration
  for (const iteration of iterations) {
    const candidate = iteration.generatedCandidates.find(candidate => {
      return candidate.candidateRef.candidateId === selectedCandidateId;
    });
    if (candidate !== undefined) {
      data = {
        datasetEntries,
        candidate: findCandidateById(candidate.candidateRef.candidateId),
        changesSummary: candidate.changesSummary,
        changes: candidate.changes,
        trainingAggregatedEvaluation: findAggregatedEvaluationByCandidateId(
          iteration.trainingAggregatedEvaluations,
          selectedCandidateId,
        ),
        analysis: findAnalysisByCandidateId(iteration, selectedCandidateId),
      };
      break;
    }
  }
  if (prompt === undefined) {
    return undefined;
  }

  return data;
}