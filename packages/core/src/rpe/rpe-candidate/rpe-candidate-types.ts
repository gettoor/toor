/**
 * A module of a candidate.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateModule {
  /**
   * Content of the module.
   */
  content: string;
}

/**
 * A collection of candidate modules.
 * @category Reflective Prompt Evolution
 */
export type RPECandidateModules = Record<string, RPECandidateModule>;

/**
 * A candidate representation.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidate {
  /**
   * Unique identifier of the candidate.
   */
  candidateId: string;

  /**
   * Parents of the candidate. Used to create a tree of candidates.
   * There can be multiple parents when a new candidate is created from
   * multiple parents. Typically, there is only one parent.
   */
  parentCandidateIds?: string[];

  /**
   * Candidate modules.
   */
  modules: RPECandidateModules;
}

/**
 * A reference to a candidate.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateRef {
  /**
   * Unique identifier of the referenced candidate.
   */
  candidateId: string;
}