/**
 * Types for experiments.
 */
import { JSONSchema7 } from 'json-schema';

import { LLMUsage } from '../llm/index.js';
import { ModelProvider } from '../model-provider/index.js';

export type ExperimentEvaluationType = 'binary' | '1-3' | '1-5' | '1-10';

export interface ExperimentModel {
  // model name
  name: string;
}

export interface ExperimentModelParameters {
  // parameters name
  name: string;

  // temperature
  temperature?: number;
}

export interface ExperimentPrompt {
  // prompt name (keep unique)
  name: string;

  // prompt to evaluate
  prompt: string;
}

export type ExperimentDatasetVarValue = any;

export interface ExperimentDatasetEntry {
  // dataset name (keep unique)
  name: string;

  // variables to replace in the prompt
  vars?: Record<string, ExperimentDatasetVarValue>;
}

export interface ExperimentSettings {
  // evaluation type
  type: ExperimentEvaluationType;

  // name of the model used to evaluate the prompt and response
  model: string;

  // model parameters
  modelParameters?: ExperimentModelParameters;
}

export interface DatasetEntryEvaluationMetrics {
  // evaluation time in milliseconds
  promptGenerationTime: number;

  // LLM usage for the evaluation
  promptGenerationUsage: LLMUsage;

  // evaluation time in milliseconds
  evaluationTime: number;

  // LLM usage for the evaluation
  evaluationUsage: LLMUsage;
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
 */
export interface ExperimentListeners {
  /**
   * Called when a dataset entry evaluation is started.
   */
  datasetEntryEvaluationStarted?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when a dataset entry evaluation is completed.
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
   */
  generatingResponse?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when a response has been generated.
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
   */
  runningEvaluation?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
  ) => Promise<void>;

  /**
   * Called when an evaluation is completed.
   */
  evaluationCompleted?: (
    modelName: string,
    parametersName: string,
    promptName: string,
    datasetName: string,
    score: ExperimentScore,
  ) => Promise<void>;
}

export type ExperimentStructuredOutputFormat = 'json' | 'yaml';

export interface ExperimentStructuredOutput {
  // schema of the structured output
  schema: JSONSchema7;

  // format of the structured output passed to evaluation
  format: ExperimentStructuredOutputFormat;
}

export interface Experiment {
  // experiment settings
  settings: ExperimentSettings;

  // models to evaluate
  models: ExperimentModel[];

  // model provider to resolve the models
  modelProvider: ModelProvider;

  // model parameters
  modelParameters: ExperimentModelParameters[];

  // prompts to evaluate
  prompts: ExperimentPrompt[];

  // structured output to evaluate
  structuredOutput?: ExperimentStructuredOutput;

  // dataset to evaluate
  dataset: ExperimentDatasetEntry[];

  // listeners to the experiment
  listeners?: ExperimentListeners;
}

export interface ExperimentScore {
  // score
  score: number;
  
  // score as string
  scoreAsString: string;

  // score normalized to 0..1
  normalizedScore: number;

  // reasoning for the score
  reasoning: string;

  // metrics for the score
  metrics?: Record<string, number>;
}

export interface ExperimentResult {
  // model name
  modelName: string;

  // parameters name
  parametersName: string;

  // prompt
  promptName: string;

  // dataset
  datasetName: string;

  // score
  score: ExperimentScore;

  // metrics
  metrics: DatasetEntryEvaluationMetrics;
}