/**
 * Runs an experiment.
 */
import { generateText, jsonSchema, Output } from 'ai';
import yaml from 'yaml';

import { LLMModel, LLMUsage, buildModelCallSettings } from '../llm/index.js';
import { replacePlaceholders } from '../string/index.js';
import { 
  DefaultModelProvider,
  ModelProvider,
} from '../model-provider/index.js';
import { 
  UnknownExperimentStructuredOutputFormatError,
} from './experimentation-errors.js';
import { 
  Experiment,
  ExperimentSettings,
  ExperimentModel,
  ExperimentModelParameters,
  ExperimentScore,
  ExperimentResult,
  DatasetEntryEvaluationMetrics,
  ExperimentStructuredOutput,
} from './experimentation-types.js';

/**
 * Runs an experiment.
 * @category Experimentation
 * @param experiment - The experiment to run.
 * @returns A promise that resolves when the online evaluation is complete.
 */
export async function runExperiment(
  experiment: Experiment,
): Promise<ExperimentResult[]> {
  // TODO: validate the experiment configuration
  const modelProvider = experiment.modelProvider ?? new DefaultModelProvider();

  // do checks before running the experiment
  await checkModels(experiment.models, modelProvider);

  // results of the experiment
  const results: ExperimentResult[] = [];

  // for each model
  for (const evalModel of experiment.models) {
    const model = await modelProvider.getModel(
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
            await experiment.listeners.datasetEntryEvaluationStarted({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
            });
          }

          // create prompt
          const prompt = replacePlaceholders(
            evalPrompt.prompt,
            evalDatasetEntry.vars ?? {},
          );

          // notify
          if (experiment.listeners?.generatingResponse) {
            await experiment.listeners.generatingResponse({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
            });
          }

          // generate response
          const responseGenerationStartTime = Date.now();
          const {
            response,
            usage: responseGenerationUsage,
          } = await generateResponse(
            model,
            evalModelParameters,
            prompt.text,
            experiment.structuredOutput,
          )
          const responseGenerationTime =
            Date.now() - responseGenerationStartTime;

          // notify
          if (experiment.listeners?.responseGenerated) {
            await experiment.listeners.responseGenerated({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
              response,
            });
          }

          // notify
          if (experiment.listeners?.runningEvaluation) {
            await experiment.listeners.runningEvaluation({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
            });
          }

          // run evaluation
          const evaluationStartTime = Date.now();
          const { score, usage: evaluationUsage } = await runEvaluation(
            experiment.settings,
            evalPrompt.name,
            prompt.text,
            response,
          );
          const evaluationTime = Date.now() - evaluationStartTime;

          // notify
          if (experiment.listeners?.evaluationCompleted) {
            await experiment.listeners.evaluationCompleted({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
              score,
            });
          }

          // metrics
          const metrics: DatasetEntryEvaluationMetrics = {
            responseGenerationTime,
            responseGenerationUsage,
            evaluationTime,
            evaluationUsage,
          };

          // keep result
          results.push({
            modelName: evalModel.name,
            parametersName: evalModelParameters.name,
            promptName: evalPrompt.name,
            datasetName: evalDatasetEntry.name,
            prompt: prompt.text,
            response,
            score,
            metrics,
          });

          // notify
          if (experiment.listeners?.datasetEntryEvaluationCompleted) {
            await experiment.listeners.datasetEntryEvaluationCompleted({
              modelName: evalModel.name,
              parametersName: evalModelParameters.name,
              promptName: evalPrompt.name,
              datasetName: evalDatasetEntry.name,
              prompt: prompt.text,
              response,
              score,
              metrics,
            });
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
  promptName: string,
  prompt: string,
  response: string,
): Promise<{ score: ExperimentScore, usage?: LLMUsage }> {
  const result = await evalSettings.evaluator({
    promptName,
    prompt,
    response,
  });
  return result;
}

/**
 * Generates a response from a model for an experiment prompt.
 */
async function generateResponse(
  model: LLMModel,
  experimentModelParameters: ExperimentModelParameters,
  prompt: string,
  structuredOutput?: ExperimentStructuredOutput,
): Promise<{ response: string, usage: LLMUsage }> {
  // generate structured response
  if (structuredOutput) {
    return generateStructuredResponse(
      model,
      experimentModelParameters,
      prompt,
      structuredOutput,
    );
  }

  // model parameters
  const { name: _name, ...modelParameters } = experimentModelParameters;

  // generate text response
  const response = await generateText({
    model: model.model,
    prompt,
    ...buildModelCallSettings(modelParameters)
  });

  // build result
  const usage: LLMUsage = {
    modelUsage: [
      {
        modelName: model.name,
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    ],
  };
  return {
    response: response.text,
    usage,
  };
}

async function generateStructuredResponse(
  model: LLMModel,
  modelParameters: ExperimentModelParameters,
  prompt: string,
  structuredOutput: ExperimentStructuredOutput,
): Promise<{ response: string, usage: LLMUsage }> {
  const response = await generateText({
    model: model.model,
    prompt,
    temperature: modelParameters.temperature,
    output: Output.object({
      schema: jsonSchema(structuredOutput.schema),
    }),
  });

  const output = response.output;
  const usage: LLMUsage = {
    modelUsage: [
      {
        modelName: model.name,
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    ],
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
