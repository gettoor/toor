import { RPEMetadata } from '../rpe-core/index.js';
import { RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPECandidate, RPECandidateRef } from '../rpe-candidate/index.js';
import { RPEExecutorResponse } from '../rpe-executor/index.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import {
  EvaluatorCandidateOutput,
  CandidateGeneratorOutputCandidate,
} from '../rpe-process/index.js';

/**
 * Represents a final candidate of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEFinalCandidate {
  /**
   * Reference to the candidate.
   */
  candidateRef: RPECandidateRef;

  /**
   * Aggregated evaluations of the candidate. Typically against a test dataset.
   */
  aggregatedEvaluation?: RPEAggregatorOutput;
}

/**
 * Represents a rejected candidate of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPERejectedCandidate {
  /**
   * Rejected candidate.
   */
  candidate: CandidateGeneratorOutputCandidate;

  /**
   * Reason for the rejection.
   */
  reason: string;
}

/**
 * Represents a completed iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEIteration {
  /**
   * Iteration number. Starting from 1.
   */
  iterationNo: number;

  /**
   * References to the candidates evaluated in the current iteration.
   */
  candidateRefs?: RPECandidateRef[];
  
  /**
   * Responses generated for the candidates in the current iteration.
   */
  trainingResponses: RPEExecutorResponse[];

  /**
   * Evaluations of the responses in the current iteration.
   */
  trainingEvaluations: EvaluatorCandidateOutput[];

  /**
   * Aggregated evaluations of the responses in the current iteration.
   */
  trainingAggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * Analyses of the aggregated evaluations in the current iteration.
   */
  trainingAnalyses: RPEAnalyzerOutput[];

  /**
   * Valid (not rejected) candidates in the current iteration.
   */
  validCandidates?: CandidateGeneratorOutputCandidate[];

  /**
   * Rejected candidates in the current iteration.
   */
  rejectedCandidates?: RPERejectedCandidate[];

  /**
   * Responses generated for the candidates in the current iteration.
   */
  candidateResponses?: RPEExecutorResponse[];

  /**
   * Evaluations of the candidate responses in the current iteration. 
   */
  candidateEvaluations?: EvaluatorCandidateOutput[];

  /**
   * Aggregated evaluations of the candidate responses in the current iteration.
   */
  candidateAggregatedEvaluations?: RPEAggregatorOutput[];

  /**
   * References to candidates selected for the next iteration.
   */
  selectedCandidateRefs?: RPECandidateRef[];
}

/**
 * Represents an in-progress iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export type RPEIterationInProgress =
  Partial<Omit<RPEIteration, 'iterationNo' | 'candidateRefs'>> &
  Pick<RPEIteration, 'iterationNo' | 'candidateRefs'>;

/**
 * State of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEState {
  /**
   * All the candidates from an RPE process.
   */
  candidates: RPECandidate[];

  /**
   * All the dataset entries used in the RPE process.
   */
  datasetEntries: RPEDatasetEntry[];

  /**
   * Evaluations of the seed and generated candidates for comparison.
   * Evaluations are added as the RPE process progresses.
   */
  aggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * Current iteration number of the RPE process (starting from 0).
   */
  iterationNo: number;

  /**
   * Current iteration of the RPE process.
   */
  iteration: RPEIterationInProgress;

  /**
   * History of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];

  /**
   * Metadata for the RPE process.
   */
  metadata: RPEMetadata;

  /**
   * Final candidates of the RPE process.
   */
  finalCandidates: RPEFinalCandidate[];
}

/**
 * Function to update the RPE state.
 * @category Reflective Prompt Evolution
 */
export type RPEUpdateStateFunc = (state: RPEState) => Promise<void>;