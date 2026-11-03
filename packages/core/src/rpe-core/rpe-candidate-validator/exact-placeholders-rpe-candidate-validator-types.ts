export interface ExactPlaceholdersRPECandidateValidatorInput {
  /**
   * Placeholders to validate across all modules of the candidate.
   */
  validPlaceholders?: string[];

  /**
   * Placeholders to validate per module of the candidate.
   */
  validPlaceholdersPerModule?: Record<string, string[]>;

  /**
   * Whether to reject duplicates of the placeholders.
   * @default true
   */
  rejectDuplicates?: boolean;
}