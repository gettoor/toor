import { 
  DatasetEntryEvaluationMetrics,
  Experiment,
  ExperimentListeners,
  ExperimentScore,
  runExperiment as runExperimentFromCore,
} from '@gettoor/core';

import {
  green,
  newSection,
  newSpinner,
  Section,
  separator,
  dim,
} from '../../console/index.js';
import { colorForScore } from './experiment-styles.js';
import { printResults } from './experiment-results.js';

export async function runExperiment(
  experiment: Experiment,
): Promise<void> {
  let section: Section;
  const spinner = newSpinner();

  const listeners: ExperimentListeners = {
    datasetEntryEvaluationStarted: async (
      modelName: string,
      parametersName: string,
      promptName: string,
      datasetName: string,
    ) => {
      section = newSection();
      section.property('Model', modelName);
      section.property('Parameters', parametersName);
      section.property('Prompt', promptName);
      section.property('Dataset', datasetName);
    },

    datasetEntryEvaluationCompleted: async (
      _modelName: string,
      _parametersName: string,
      _promptName: string,
      _datasetName: string,
      score: ExperimentScore,
      metrics: DatasetEntryEvaluationMetrics,
    ) => {
      const scoreColor = colorForScore(score);
      section.property(
        'Score',
        score.scoreAsString,
        {
          valueColor: scoreColor,
        }
      );
      section.property(
        'Reason',
        score.reasoning,
        {
          valueColor: scoreColor,
        }
      );
      if (score.metrics) {
        const metricNames = Object.keys(score.metrics ?? {});
        for (const metricName of metricNames) {
          const metricValue = score.metrics[metricName];
          section.property(capitalize(metricName), metricValue.toString());
        }
      }

      // metrics
      const metricsNameWidth = 36;
      if (metrics.promptGenerationTime) {
        section.property(
          'Prompt generation time',
          `${metrics.promptGenerationTime}${dim('ms')}`,
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.promptGenerationUsage.inputTokens) {
        section.property(
          'Prompt generation input tokens',
          metrics.promptGenerationUsage.inputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.promptGenerationUsage.outputTokens) {
        section.property(
          'Prompt generation output tokens',
          metrics.promptGenerationUsage.outputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.evaluationTime) {
        section.property(
          'Evaluation time',
          `${metrics.evaluationTime}${dim('ms')}`,
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.evaluationUsage.inputTokens) {
        section.property(
          'Evaluation input tokens',
          metrics.evaluationUsage.inputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.evaluationUsage.outputTokens) {
        section.property(
          'Evaluation output tokens',
          metrics.evaluationUsage.outputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }

      console.log(' ' + separator({ width: 32, color: dim }));
    },

    generatingResponse: async (
      _modelName: string,
      _parametersName: string,
      _promptName: string,
      _datasetName: string,
    ) => {
      spinner.start(
        `Generating response`,
        {
          color: green,
          prefix: section.getValuePrefix(),
        },
      );
    },

    responseGenerated: async (
      _modelName: string,
      _parametersName: string,
      _promptName: string,
      _datasetName: string,
      _response: string,
    ) => {
      spinner.stop();
    },

    runningEvaluation: async (
      _modelName: string,
      _parametersName: string,
      _promptName: string,
      _datasetName: string,
    ) => {
      spinner.start(
        `Running evaluation`,
        {
          color: green,
          prefix: section.getValuePrefix(),
        },
      );
    },

    evaluationCompleted: async (
      _modelName: string,
      _parametersName: string,
      _promptName: string,
      _datasetName: string,
      _score: ExperimentScore,
    ) => {
      spinner.stop();
    },
  };

  // run experiment
  const results = await runExperimentFromCore({
    ...experiment,
    listeners,
  });

  // print results
  console.log();
  printResults(results);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}