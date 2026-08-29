import { 
  Experiment,
  ExperimentDatasetEntryEvaluationCompletedInput,
  ExperimentDatasetEntryEvaluationStartedInput,
  ExperimentListeners,
  runExperiment as runExperimentFromCore,
  sumLLMUsage,
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
import { isVerbose } from '../../args/args.js';

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
      const responseGenerationUsage = sumLLMUsage(
        metrics.responseGenerationUsage,
      );
      if (responseGenerationUsage.inputTokens) {
        section.property(
          'Prompt generation input tokens',
          responseGenerationUsage.inputTokens.toString(),
          {
            nameWidth: metricsNameWidth,
          }
        );
      }
      if (responseGenerationUsage.outputTokens) {
        section.property(
          'Prompt generation output tokens',
          responseGenerationUsage.outputTokens.toString(),
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
        const evaluationUsage = sumLLMUsage(
          metrics.evaluationUsage,
        );
        if (evaluationUsage.inputTokens) {
          section.property(
            'Evaluation input tokens',
            evaluationUsage.inputTokens.toString(),
            {
              nameWidth: metricsNameWidth,
            }
          );
        }
        if (evaluationUsage.outputTokens) {
          section.property(
            'Evaluation output tokens',
            evaluationUsage.outputTokens.toString(),
            {
              nameWidth: metricsNameWidth,
            }
          );
        }
      }

      if (isVerbose()) {
        console.log('\n' + dim('Prompt:'));
        console.log(input.prompt);
        console.log('\n' + dim('Response:'));
        console.log(input.response + '\n');
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