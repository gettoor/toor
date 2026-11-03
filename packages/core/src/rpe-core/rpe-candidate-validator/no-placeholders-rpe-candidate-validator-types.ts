/**
 * Input for the no placeholders RPE candidate validator.
 * @category Reflective Prompt Evolution
 */
export interface NoPlaceholdersRPECandidateValidatorInput {
  /**
   * Modules that are forbidden to have placeholders.
   */
  modulesWithoutPlaceholders: string[];
}