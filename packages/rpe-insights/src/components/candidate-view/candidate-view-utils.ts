import { 
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPEIteration,
  type RPECandidate,
} from '@gettoor/core';
import { CandidateDetailsData } from '../candidate-details';

export function getCandidateDetailsData(
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
    iteration: RPEIteration,
    candidateId: string
  ): RPEAggregatorOutput => {
    const { aggregatedEvaluations } = iteration;
    const aggregatedEvaluation = aggregatedEvaluations.find(
      aggregatedEvaluation => {
        return aggregatedEvaluation.candidateRef.candidateId === candidateId;
      },
    );
    if (aggregatedEvaluation !== undefined) {
      return aggregatedEvaluation;
    }

    const { candidateAggregatedEvaluations } = iteration;
    const candidateAggregatedEvaluation = candidateAggregatedEvaluations.find(
      valuation => {
        return valuation.candidateRef.candidateId === candidateId;
      },
    );
    if (candidateAggregatedEvaluation !== undefined) {
      return candidateAggregatedEvaluation;
    }
    throw new Error(
      `Aggregated evaluations for candidate ${candidateId} not found`,
    );
  };

  const findAnalysisByCandidateId = (
    iteration: RPEIteration,
    candidateId: string
  ): RPEAnalyzerOutput | undefined => {
    const analysis = iteration.analyses.find(analysis => {
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
      candidate: findCandidateById(seedCandidateRef.candidateId),
      aggregatedEvaluation: findAggregatedEvaluationByCandidateId(
        firstIteration,
        selectedCandidateId,
      ),
      analysis: findAnalysisByCandidateId(firstIteration, selectedCandidateId),
    };
  }

  let data: CandidateDetailsData | undefined;
  // candidates from each iteration
  for (const iteration of iterations) {
    const candidate = iteration.candidates.find(candidate => {
      return candidate.candidateRef.candidateId === selectedCandidateId;
    });
    if (candidate !== undefined) {
      data = {
        candidate: findCandidateById(candidate.candidateRef.candidateId),
        candidateChanges: candidate.changes,
        aggregatedEvaluation: findAggregatedEvaluationByCandidateId(
          iteration,
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