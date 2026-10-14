import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/model-provider.js';
import {
  RPEDataset,
  RPEDatasetEntry,
  RPEResponse,
} from '../../rpe-core/index.js';

/**
 * A dataset entry with a label.
 */
export type RPEDatasetEntryWithName = RPEDatasetEntry & {
  /**
   * Name of the dataset.
   */
  datasetName: string;
};

/**
 * A pair of dataset entries which are (near) duplicates.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorDuplicate {
  /**
   * Identifier of the first dataset entry.
   */
  datasetEntryIdA: string;

  /**
   * Identifier of the second dataset entry.
   */
  datasetEntryIdB: string;

  /**
   * Similarity score between the two dataset entries.
   * 0 is the lowest similarity, 1 is the highest similarity.
   */
  similarity: number;
}

/**
 * A conflicting duplicate which is a pair of dataset entries that are 
 * duplicates but have different expected responses.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorConflictingExactDuplicate {
  /**
   * Identifier of the first dataset entry.
   */
  datasetEntryIdA: string;

  /**
   * Identifier of the second dataset entry.
   */
  datasetEntryIdB: string;
}

/**
 * A split leakage which is a pair of dataset entries that are duplicates
 * but belong to different datasets.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorSplitLeak {
  /**
   * Identifier of the first dataset entry.
   */
  datasetEntryIdA: string;

  /**
   * Name of the first dataset.
   */
  datasetNameA: string;

  /**
   * Identifier of the second dataset entry.
   */
  datasetEntryIdB: string;

  /**
   * Name of the second dataset.
   */
  datasetNameB: string;

  /**
   * Similarity score between the two dataset entries.
   * 0 is the lowest similarity, 1 is the highest similarity.
   */
  similarity: number;
}

/**
 * A likely incorrect expected response which is a dataset entry that has
 * an expected response that is likely incorrect.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorLikelyIncorrectExpectedResponse {
  /**
   * Identifier of the dataset entry.
   */
  datasetEntryId: string;

  /**
   * Reasoning for the likely incorrect expected response.
   */
  reasoning: string;

  /**
   * Confidence in the likely incorrect expected response.
   */
  confidence: number;
}

/**
 * A contradiction which is a pair of dataset entries that are contradictions.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorContradiction {
  /**
   * Identifier of the first dataset entry.
   */
  datasetEntryIdA: string;

  /**
   * Identifier of the second dataset entry.
   */
  datasetEntryIdB: string;
  
  /**
   * Reasoning for the contradiction.
   */
  reasoning: string;

  /**
   * Confidence in the contradiction.
   */
  confidence: number;
}

/**
 * An ambiguity which is a dataset entry that is ambiguous.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorAmbiguity {
  /**
   * Identifier of the dataset entry.
   */
  datasetEntryId: string;
  
  /**
   * Reasoning for the ambiguity.
   */
  reasoning: string;
  
  /**
   * Confidence in the ambiguity.
   */
  confidence: number;

  /**
   * Alternative responses for the ambiguity.
   */
  alternativeResponses: RPEResponse[];

  /**
   * Fields that are ambiguous.
   */
  ambiguousFields?: string[];  
}

/**
 * An insufficient information which is a dataset entry that has
 * insufficient information to justify its expected response.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorInsufficientInformation {
  /**
   * Identifier of the dataset entry.
   */
  datasetEntryId: string;

  /**
   * Reasoning for the insufficient information.
   */
  reasoning: string;

  /**
   * Confidence in the insufficient information.
   */
  confidence: number;

  /**
   * Fields that are insufficient.
   */
  insufficientFields?: string[];
}

/**
 * A distribution of a field in a dataset.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorFieldDistribution {
  /**
   * Name of the field. Empty string for the expected response of type string.
   */
  fieldName: string;

  /**
   * Expected response distribution.
   */
  distribution: Record<string, number>;

  /**
   * Imbalance of the expected response distribution, between 0 and 1.
   * 0 means perfect distribution, 1 means worst distribution.
   */
  distributionImbalance: number;
}

/**
 * Expected response distribution for a dataset.
 * @category Reflective Prompt Evolution
 * @see {@link RPEDatasetValidatorIssues}
 */
export interface RPEDatasetValidatorExpectedResponseDistribution {
  /**
   * Name of the dataset.
   */
  datasetName: string;

  /**
   * Field distributions.
   */
  fieldDistributions: RPEDatasetValidatorFieldDistribution[];
}

/**
 * Input for the dataset validator.
 * @category Reflective Prompt Evolution
 * @see {@link validateRPEDataset}
 */
export interface RPEDatasetValidatorInput {
  /**
   * Datasets to validate. The key typically is: train, validation, test.
   */
  datasets: Record<string, RPEDataset>;

  /**
   * Additional context to use for the validation. It should describe how
   * the variables in the dataset entries are used to generate
   * the expected response.
   */
  additionalContext: string;

  /**
   * Name of the LLM model to use for the validation.
   */
  modelName: string;

  /**
   * Parameters to use for the LLM model.
   */
  modelParameters?: ModelParameters;

  /**
   * Model to use for embeddings.
   */
  embeddingsModelName: string;

  /**
   * Model provider to use for the models.
   * @default {@link DefaultModelProvider}
   */
  modelProvider?: ModelProvider;
  
  /**
   * Threshold for near duplicates. 0 is the lowest similarity,
   * 1 is the highest similarity.
   * @default 0.9
   */
  nearDuplicateThreshold?: number;

  /**
   * Threshold for expected response distribution imbalance, between 0 and 1.
   * 0 means perfect distribution, 1 means worst distribution.
   * @default 0.5
   */
  expectedResponseDistributionImbalanceThreshold?: number;
}

/**
 * Potential issues found in the dataset.
 * @category Reflective Prompt Evolution
 * @see {@link validateRPEDataset}
 */
export interface RPEDatasetValidatorIssues {
  /**
   * Pairs of dataset entries that have the exact same variables.
   */
  exactDuplicates: RPEDatasetValidatorDuplicate[];

  /**
   * Pairs of dataset entries that have similar variables.
   */
  nearDuplicates: RPEDatasetValidatorDuplicate[];

  /**
   * Pairs of dataset entries that have the exact same variables
   * but belong to different datasets.
   */
  exactSplitLeaks: RPEDatasetValidatorSplitLeak[];

  /**
   * Pairs of dataset entries that have similar variables
   * but belong to different datasets.
   */
  nearSplitLeaks: RPEDatasetValidatorSplitLeak[];

  /**
   * Pairs of dataset entries that are conflicting exact duplicates.
   */
  conflictingExactDuplicates: RPEDatasetValidatorConflictingExactDuplicate[];

  /**
   * Likely incorrect expected responses.
   */
  likelyIncorrectExpectedResponses:
    RPEDatasetValidatorLikelyIncorrectExpectedResponse[];
  
  /**
   * Contradictions.
   */
  contradictions: RPEDatasetValidatorContradiction[];

  /**
   * Ambiguities.
   */
  ambiguities: RPEDatasetValidatorAmbiguity[];

  /**
   * Insufficient information.
   */
  insufficientInformation: RPEDatasetValidatorInsufficientInformation[];

  /**
   * Expected response distributions.
   */
  expectedResponseDistributions:
    RPEDatasetValidatorExpectedResponseDistribution[];
}

/**
 * Output for the dataset validator.
 * @category Reflective Prompt Evolution
 * @see {@link validateRPEDataset}
 */
export interface RPEDatasetValidatorOutput {
  /**
   * Potential issues found in the dataset.
   */
  issues: RPEDatasetValidatorIssues;
}