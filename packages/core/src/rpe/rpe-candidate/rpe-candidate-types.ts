/**
 * A candidate representation.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidate {
  /**
   * Parents of the candidate. Used to create a tree of candidates.
   * There can be multiple parents when a new candidate is created from
   * multiple parents. Typically, there is only one parent.
   */
  parentCandidateIds?: string[];

  /**
   * Candidate to evaluate.
   */
  candidate: string;

  /**
   * Unique identifier of the candidate.
   */
  candidateId: string;
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