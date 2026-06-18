/**
 * Types for experiments.
 */
import { JSONSchema7 } from 'json-schema';

import { LLMUsage, MetricResult, ModelParameters } from '../llm/index.js';
import { ModelProvider } from '../model-provider/index.js';

/**
 * Input for `toExperimentScore`.
 * @category Experimentation
 */
export interface ToExperimentScoreInput {
  /**
   * Evaluated score.
   */
  score: number;

  /**
   * Minimum score.
   */
  minScore: number;

  /**
   * Maximum score.
   */
  maxScore: number;

  /**
   * Reasoning for the score.
   */
  reasoning?: string;
}

/**
 * Score for a single evaluation.
 * @category Experimentation
 */
export interface ExperimentScore {
  /**
   * Score.
   */
  score: number;
  
  /**
   * Score as string.
   */
  scoreAsString: string;

  /**
   * Score normalized to 0..1.
   */
  normalizedScore: number;

  /**
   * Reasoning for the score.
   */
  reasoning?: string;

  /**
   * Metrics for the score.
   */
  metrics?: Record<string, MetricResult>;
}

/**
 * Input for an experiment evaluator.
 * @category Experimentation
 */
export interface ExperimentEvaluatorInput {
  /**
   * Name of the prompt to evaluate.
   */
  promptName: string;

  /**
   * Prompt to evaluate.
   */
  prompt: string;

  /**
   * Response to evaluate.
   */
  response: string;
}

/**
 * Output for an experiment evaluator.
 * @category Experimentation
 */
export interface ExperimentEvaluatorOutput {
  /**
   * Score assigned to the response.
   */
  score: ExperimentScore;

  /**
   * LLM usage for LLM evaluators.
   */
  usage?: LLMUsage;
}

/**
 * Experiment evaluator.
 * @category Experimentation
 */
export type ExperimentEvaluator = (
  input: ExperimentEvaluatorInput,
) => Promise<ExperimentEvaluatorOutput>;

/**
 * Experiment model.
 * @category Experimentation
 */
export interface ExperimentModel {
  // model name
  name: string;
}

/**
 * Experiment model parameters.
 * @category Experimentation
 */
export interface ExperimentModelParameters extends ModelParameters {
  // parameters name
  name: string;
}

/**
 * Experiment prompt.
 * @category Experimentation
 */
export interface ExperimentPrompt {
  // prompt name (keep unique)
  name: string;

  // prompt to evaluate
  prompt: string;
}

/**
 * Experiment dataset variable value.
 * @category Experimentation
 */
export type ExperimentDatasetVarValue = any;

/**
 * Experiment dataset entry.
 * @category Experimentation
 */
export interface ExperimentDatasetEntry {
  /**
   * Dataset name (keep unique).
   */
  name: string;

  /**
   * Variables to replace in the prompt.
   */
  vars?: Record<string, ExperimentDatasetVarValue>;
}

/**
 * Experiment settings.
 * @category Experimentation
 */
export interface ExperimentSettings {
  /**
   * Evaluator to use for the experiment.
   */
  evaluator: ExperimentEvaluator;
}

/**
 * Dataset entry evaluation metrics.
 * @category Experimentation
 */
export interface DatasetEntryEvaluationMetrics {
  /**
   * Response generation time in milliseconds.
   */
  responseGenerationTime: number;

  /**
   * LLM usage for the response generation.
   */
  responseGenerationUsage: LLMUsage;

  /**
   * Evaluation time in milliseconds.
   */
  evaluationTime: number;

  /**
   * LLM usage for the evaluation.
   */
  evaluationUsage?: LLMUsage;
}

/**
 * Listeners for an experiment.
 * A dataset entry evaluation is a single evaluation of a prompt and response.
 * It comprises of:
 * - Generating the response based on the prompt and dataset entry
 * - Running the evaluation on the response
 * 
 * The listeners are called in the following order:
 * - datasetEntryEvaluationStarted
 * - generatingResponse
 * - responseGenerated
 * - runningEvaluation
 * - evaluationCompleted
 * - datasetEntryEvaluationCompleted
 * @category Experimentation
 */
export interface ExperimentListeners {
  /**
   * Called when a dataset entry evaluation is started.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
   */
  datasetEntryEvaluationStarted?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when a dataset entry evaluation is completed.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
   * @param score - Score of the evaluation
   * @param metrics - Metrics of the evaluation
   */
  datasetEntryEvaluationCompleted?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
    score: ExperimentScore,
    metrics: DatasetEntryEvaluationMetrics,
  ) => Promise<void>;

  /**
   * Called when a response is being generated.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
   */
  generatingResponse?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when a response has been generated.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
   * @param response - Response generated by the model
  */
  responseGenerated?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
    response: string,
  ) => Promise<void>;

  /**
   * Called when an evaluation is started.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
  */
  runningEvaluation?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when an evaluation is completed.
   * @param modelName - Name of the model
   * @param parametersName - Name of the model parameters
   * @param promptName - Name of the prompt
   * @param datasetName - Name of the dataset entry
   * @param score - Score of the evaluation
  */
  evaluationCompleted?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
    score: ExperimentScore,
  ) => Promise<void>;
}

/**
 * Experiment structured output format.
 * @category Experimentation
 */
export type ExperimentStructuredOutputFormat = 'json' | 'yaml';

/**
 * Experiment structured output.
 * @category Experimentation
 */
export interface ExperimentStructuredOutput {
  /**
   * Schema of the structured output.
   */
  schema: JSONSchema7;

  /**
   * Format of the structured output passed to evaluation.
   */
  format: ExperimentStructuredOutputFormat;
}

/**
 * Experiment settings and configuration.
 * @category Experimentation
 */
export interface Experiment {
  /**
   * Experiment settings.
   */
  settings: ExperimentSettings;

  /**
   * Models to evaluate.
   */
  models: ExperimentModel[];

  /**
   * Model provider to resolve the models.
   * If not provided, the default model provider will be used.
   * @see {@link DefaultModelProvider}
   */
  modelProvider?: ModelProvider;

  /**
   * Model parameters.
   */
  modelParameters: ExperimentModelParameters[];

  /**
   * Prompts to evaluate.
   */
  prompts: ExperimentPrompt[];

  /**
   * Structured output to evaluate.
   */
  structuredOutput?: ExperimentStructuredOutput;

  /**
   * Dataset to evaluate.
   */
  dataset: ExperimentDatasetEntry[];

  /**
   * Listeners to the experiment.
   */
  listeners?: ExperimentListeners;
}

/**
 * Experiment result of a single evaluation.
 * @category Experimentation
 */
export interface ExperimentResult {
  /**
   * Model name.
   */
  modelName: string;

  /**
   * Parameters name.
   */
  parametersName: string;

  /**
   * Prompt name.
   */
  promptName: string;

  /**
   * Dataset name.
   */
  datasetName: string;

  /**
   * Prompt used to generate the response.
   */
  prompt: string;

  /**
   * Response generated by the model.
   */
  response: string;

  /**
   * Score.
   */
  score: ExperimentScore;

  /**
   * Metrics.
   */
  metrics: DatasetEntryEvaluationMetrics;
}