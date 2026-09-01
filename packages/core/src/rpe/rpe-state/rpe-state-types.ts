import { RPECandidate, RPECandidateRef } from '../rpe-candidate/index.js';
import { RPEExecutorOutput } from '../rpe-executor/index.js';
import { EvaluatorCandidateOutput } from '../evaluator-types.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import { PromptGeneratorCandidate } from '../candidate-generator-types.js';

/**
 * Represents a completed iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEIteration {
  /**
   * References to the candidates evaluated in the current iteration.
   */
  candidateRefs: RPECandidateRef[];
  
  /**
   * The responses generated for the candidates in the current iteration.
   */
  responses: RPEExecutorOutput[];

  /**
   * The evaluations of the responses in the current iteration.
   */
  evaluations: EvaluatorCandidateOutput[];

  /**
   * The aggregated evaluations of the responses in the current iteration.
   */
  aggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * The analyses of the aggregated evaluations in the current iteration.
   */
  analyses: RPEAnalyzerOutput[];

  /**
   * The candidates generated for the candidates in the current iteration.
   */
  candidates: PromptGeneratorCandidate[];

  /**
   * The responses generated for the candidates in the current iteration.
   */
  candidateResponses: RPEExecutorOutput[];

  /**
   * The evaluations of the candidate responses in the current iteration. 
   */
  candidateEvaluations: EvaluatorCandidateOutput[];

  /**
   * The aggregated evaluations of the candidate responses
   * in the current iteration.
   */
  candidateAggregatedEvaluations: RPEAggregatorOutput[];

  /**
   * References to the candidates selected for the next iteration.
   */
  selectedCandidateRefs: RPECandidateRef[];
}

/**
 * Represents an in-progress iteration of the RPE process.
 * @category Reflective Prompt Evolution
 */
export type RPEIterationInProgress =
  Partial<Omit<RPEIteration, 'candidateRefs'>> &
  Pick<RPEIteration, 'candidateRefs'>;

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
   * The current iteration number of the RPE process (starting from 0).
   */
  iterationNo: number;

  /**
   * The current iteration of the RPE process.
   */
  iteration: RPEIterationInProgress;

  /**
   * The history of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];
}