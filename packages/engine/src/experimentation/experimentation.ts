/**
 * Runs an experiment.
 */
import { generateText, jsonSchema, LanguageModel, Output } from 'ai';
import yaml from 'yaml';

import { LLMUsage } from '../llm/index.js';
import { replacePlaceholders } from '../string/index.js';
import { ModelProvider } from '../model-provider/index.js';
import { 
  SCALAR_SCORING_1_10,
  SCALAR_SCORING_1_3,
  SCALAR_SCORING_1_5,
} from '../llm-as-a-judge/index.js';
import { 
  UnknownExperimentEvaluationTypeError,
  UnknownExperimentStructuredOutputFormatError,
} from './experimentation-errors.js';
import { 
  Experiment,
  ExperimentDatasetVarValue,
  ExperimentSettings,
  ExperimentModel,
  ExperimentModelParameters,
  ExperimentScore,
  ExperimentResult,
  DatasetEntryEvaluationMetrics,
  ExperimentStructuredOutput,
} from './experimentation-types.js';
import { runBinaryExperimentEvaluation } from './experimentation-binary.js';
import { runScalarExperimentEvaluation } from './experimentation-scalar.js';

/**
 * Runs an experiment.
 * @param experiment - The experiment to run.
 * @returns A promise that resolves when the online evaluation is complete.
 */
export async function runExperiment(
  experiment: Experiment,
): Promise<ExperimentResult[]> {
  // do checks before running the experiment
  await checkModels(experiment.models, experiment.modelProvider);

  // results of the experiment
  const results: ExperimentResult[] = [];

  // for each model
  for (const evalModel of experiment.models) {
    const model = await experiment.modelProvider.getModel(
      evalModel.name,
    );

    // for each model parameter set
    for (const evalModelParameters of experiment.modelParameters) {
      
      // for each prompt
      for (const evalPrompt of experiment.prompts) {

        // for each dataset entry
        for (const evalDatasetEntry of experiment.dataset) {
          // notify
          if (experiment.listeners?.datasetEntryEvaluationStarted) {
            await experiment.listeners.datasetEntryEvaluationStarted(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
            );
          }

          // create prompt
          const prompt = replacePlaceholders(
            evalPrompt.prompt,
            varsToPlaceholders(evalDatasetEntry.vars),
          );

          // notify
          if (experiment.listeners?.generatingResponse) {
            await experiment.listeners.generatingResponse(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
            );
          }

          // generate response
          const promptGenerationStartTime = Date.now();
          const {
            response,
            usage: promptGenerationUsage,
          } = await generateResponse(
            model,
            evalModelParameters,
            prompt.text,
            experiment.structuredOutput,
          )
          const promptGenerationTime = Date.now() - promptGenerationStartTime;

          // notify
          if (experiment.listeners?.responseGenerated) {
            await experiment.listeners.responseGenerated(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
              response,
            );
          }

          // notify
          if (experiment.listeners?.runningEvaluation) {
            await experiment.listeners.runningEvaluation(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
            );
          }

          // run evaluation
          const evaluationStartTime = Date.now();
          const { score, usage: evaluationUsage } = await runEvaluation(
            experiment.settings,
            experiment.modelProvider,
            prompt.text,
            response,
          );
          const evaluationTime = Date.now() - evaluationStartTime;

          // notify
          if (experiment.listeners?.evaluationCompleted) {
            await experiment.listeners.evaluationCompleted(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
              score,
            );
          }

          // metrics
          const metrics: DatasetEntryEvaluationMetrics = {
            promptGenerationTime,
            promptGenerationUsage,
            evaluationTime,
            evaluationUsage,
          };

          // keep result
          results.push({
            modelName: evalModel.name,
            parametersName: evalModelParameters.name,
            promptName: evalPrompt.name,
            datasetName: evalDatasetEntry.name,
            score,
            metrics,
          });

          // notify
          if (experiment.listeners?.datasetEntryEvaluationCompleted) {
            await experiment.listeners.datasetEntryEvaluationCompleted(
              evalModel.name,
              evalModelParameters.name,
              evalPrompt.name,
              evalDatasetEntry.name,
              score,
              metrics,
            );
          }
        }
      }
    }
  }

  return results;
}

/**
 * Runs an evaluation using the appropriate evaluation function.
 */
async function runEvaluation(
  evalSettings: ExperimentSettings,
  modelProvider: ModelProvider,
  prompt: string,
  answer: string,
): Promise<{ score: ExperimentScore, usage: LLMUsage }> {
  const model = await modelProvider.getModel(evalSettings.model);
  switch (evalSettings.type) {
    case 'binary':
      return runBinaryExperimentEvaluation(
        model,
        evalSettings.modelParameters,
        prompt,
        answer,
      );
    case '1-3':
      return runScalarExperimentEvaluation(
        model,
        evalSettings.modelParameters,
        prompt,
        answer,
        SCALAR_SCORING_1_3,
      );
    case '1-5':
      return runScalarExperimentEvaluation(
        model,
        evalSettings.modelParameters,
        prompt,
        answer,
        SCALAR_SCORING_1_5,
      );
    case '1-10':
      return runScalarExperimentEvaluation(
        model,
        evalSettings.modelParameters,
        prompt,
        answer,
        SCALAR_SCORING_1_10,
      );
    default:
      throw new UnknownExperimentEvaluationTypeError(evalSettings.type);
  }
}

/**
 * Generates a response from a model for an experiment prompt.
 */
async function generateResponse(
  model: LanguageModel,
  modelParameters: ExperimentModelParameters,
  prompt: string,
  structuredOutput?: ExperimentStructuredOutput,
): Promise<{ response: string, usage: LLMUsage }> {
  // generate structured response
  if (structuredOutput) {
    return generateStructuredResponse(
      model,
      modelParameters,
      prompt,
      structuredOutput,
    );
  }

  // generate text response
  const response = await generateText({
    model,
    prompt,
    temperature: modelParameters.temperature,
  });
  const usage: LLMUsage = {
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
  };
  return {
    response: response.text,
    usage,
  };
}

async function generateStructuredResponse(
  model: LanguageModel,
  modelParameters: ExperimentModelParameters,
  prompt: string,
  structuredOutput: ExperimentStructuredOutput,
): Promise<{ response: string, usage: LLMUsage }> {
  const response = await generateText({
    model,
    prompt,
    temperature: modelParameters.temperature,
    output: Output.object({
      schema: jsonSchema(structuredOutput.schema),
    }),
  });

  const output = response.output;
  const usage: LLMUsage = {
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
  };

  // format
  let responseAsText: string | undefined;
  switch (structuredOutput.format) {
    case 'json':
      responseAsText = JSON.stringify(output);
      break;
    case 'yaml':
      responseAsText = yaml.stringify(output);
      break;
    default:
      throw new UnknownExperimentStructuredOutputFormatError(
        structuredOutput.format,
      );
  }

  return { response: responseAsText, usage };
}

/**
 * Checks if the models are valid.
 */
async function checkModels(
  models: ExperimentModel[],
  modelProvider: ModelProvider,
): Promise<void> {
  for (const model of models) {
    await modelProvider.getModel(model.name);
  }
}

/**
 * Converts a record of variables to placeholders.
 */
function varsToPlaceholders(
  vars?: Record<string, ExperimentDatasetVarValue>,
): Record<string, any> {
  if (!vars) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(vars).map(([key, value]) => [
      key,
      value,
    ]),
  );
}