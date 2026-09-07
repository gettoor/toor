import { LLMUsage } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
import { RPECandidateRef } from '../rpe-candidate/index.js';
import { RPEState } from '../rpe-state/index.js';

/**
 * Input for the RPE candidate selector.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateSelectorInput {}

/**
 * Output for the RPE candidate selector.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateSelectorOutput {
  /**
   * References to the selected candidates.
   */
  candidateRefs: RPECandidateRef[];

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Info of the RPE candidate selector.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateSelectorInfo {
  /**
   * Name of the candidate selector.
   */
  name: string;

  /**
   * Properties of the candidate selector.
   */
  properties?: RPEProperties;
}

/**
 * Function to select the best candidates from the candidates.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateSelector {
  /**
   * Select the best candidates from the candidates.
   * @param state - State of the RPE process.
   * @param input - Input for the candidate selector.
   * @returns Candidate selector output.
   */
  run(
    state: RPEState,
    input: RPECandidateSelectorInput,
  ): Promise<RPECandidateSelectorOutput>;

  /**
   * Get the info of the candidate selector.
   * @returns Info of the candidate selector.
   */
  getInfo(): Promise<RPECandidateSelectorInfo>;
}