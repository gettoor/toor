import { AggregationFunc } from '../math/index.js';
import { ModelParameters } from '../llm/index.js';
import { ModelProvider } from '../model-provider/index.js';
import { ScalarMetric } from '../llm-as-a-judge/index.js';
import { RPECandidate, RPEDataset } from '../rpe-core/index.js';
import {
  SinglePromptRPECandidateGeneratorInstruction,
} from './rpe-candidate-generator/index.js';

/**
 * Input for the RPE lightweight preset.
 * @category Reflective Prompt Evolution
 */
export interface RPELightweightInput {
  /**
   * The initial candidates (seed candidates).
   */
  seed: RPECandidate[];

  /**
   * Dataset used for candidate improvement.
   */
  trainingDataset: RPEDataset;

  /**
   * Dataset used for validation of generated candidates. This dataset
   * helps select candidates.
   */
  validationDataset: RPEDataset;

  /**
   * Metrics to use for the evaluation.
   */
  metrics?: ScalarMetric[];

  /**
   * Function to aggregate the scores and metrics of the evaluations.
   * If not provided, `average` is be used.
   * @default {@link average}
   */
  aggregationFunc?: AggregationFunc;

  /**
   * Score threshold for the passed evaluation. An dataset entry evaluation is
   * considered passed if its score is greater than or equal to this threshold.
   * @default {@link DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD}
   */
  passedEvaluationThreshold?: number;

  /**
   * Instructions to use for the candidate generator.
   * If not provided, the default instruction will be used.
   * @default {@link
   *   SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.defaultInstruction}
   */
  candidateInstructions?: SinglePromptRPECandidateGeneratorInstruction[];

  /**
   * Parallelism for the RPE process.
   * If not provided, the default parallelism will be used.
   * @default {@link DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM}
   */
  parallelism?: number;

  /**
   * Model provider to use for the candidate generator.
   * If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Default model name used when other model names are not provided.
   */
  modelName: string;

  /**
   * Default model parameters used when other model parameters are not provided.
   */
  modelParameters?: ModelParameters;

  /**
   * Model name to use for the executor.
   * If not provided, the default model name will be used.
   */
  executorModelName?: string;

  /**
   * Model parameters to use for the executor.
   * If not provided, the default model parameters will be used.
   */
  executorModelParameters?: ModelParameters;

  /**
   * Model name to use for the evaluator.
   * If not provided, the default model name will be used.
   */
  evaluatorModelName?: string;

  /**
   * Model parameters to use for the evaluator.
   * If not provided, the default model parameters will be used.
   */
  evaluatorModelParameters?: ModelParameters;

  /**
   * Model name to use for the analyzer.
   * If not provided, the default model name will be used.
   */
  analyzerModelName?: string;

  /**
   * Model parameters to use for the analyzer.
   * If not provided, the default model parameters will be used.
   */
  analyzerModelParameters?: ModelParameters;

  /**
   * Model name to use for the candidate generator.
   * If not provided, the default model name will be used.
   */
  candidateGeneratorModelName?: string;

  /**
   * Model parameters to use for the candidate generator.
   * If not provided, the default model parameters will be used.
   */
  candidateGeneratorModelParameters?: ModelParameters;
}