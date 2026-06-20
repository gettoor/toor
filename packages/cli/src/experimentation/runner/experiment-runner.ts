import { 
  DatasetEntryEvaluationMetrics,
  Experiment,
  ExperimentDatasetEntryEvaluationCompletedInput,
  ExperimentDatasetEntryEvaluationStartedInput,
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
      input: ExperimentDatasetEntryEvaluationStartedInput,
    ) => {
      section = newSection();
      section.property('Model', input.modelName);
      section.property('Parameters', input.parametersName);
      section.property('Prompt', input.promptName);
      section.property('Dataset', input.datasetName);
    },

    datasetEntryEvaluationCompleted: async (
      input: ExperimentDatasetEntryEvaluationCompletedInput,
    ) => {
      const { score, metrics } = input;
      const scoreColor = colorForScore(input.score);
      section.property(
        'Score',
        score.scoreAsString,
        {
          valueColor: scoreColor,
        }
      );
      if (score.reasoning) {
        section.property(
          'Reason',
          score.reasoning,
          {
            valueColor: scoreColor,
          }
        );
      }
      if (score.metrics) {
        const metricNames = Object.keys(score.metrics ?? {});
        for (const metricName of metricNames) {
          const metricValue = score.metrics[metricName];
          section.property(capitalize(metricName), metricValue.toString());
        }
      }

      // metrics
      const metricsNameWidth = 36;
      if (metrics.responseGenerationTime) {
        section.property(
          'Prompt generation time',
          `${metrics.responseGenerationTime} ${dim('ms')}`,
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.responseGenerationUsage.inputTokens) {
        section.property(
          'Prompt generation input tokens',
          metrics.responseGenerationUsage.inputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.responseGenerationUsage.outputTokens) {
        section.property(
          'Prompt generation output tokens',
          metrics.responseGenerationUsage.outputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.evaluationTime) {
        section.property(
          'Evaluation time',
          `${metrics.evaluationTime} ${dim('ms')}`,
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (metrics.evaluationUsage) {
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
      }

      console.log(' ' + separator({ width: 32, color: dim }));
    },

    generatingResponse: async () => {
      spinner.start(
        `Generating response`,
        {
          color: green,
          prefix: section.getValuePrefix(),
        },
      );
    },

    responseGenerated: async () => {
      spinner.stop();
    },

    runningEvaluation: async () => {
      spinner.start(
        `Running evaluation`,
        {
          color: green,
          prefix: section.getValuePrefix(),
        },
      );
    },

    evaluationCompleted: async () => {
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