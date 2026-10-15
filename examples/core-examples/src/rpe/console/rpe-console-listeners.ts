import { RPEListeners } from '@gettoor/core';
import { Styles, newSpinner } from '@gettoor/core/console';

export function consoleRPEListeners(): RPEListeners {
  const BAR = Styles.progress('│') + ' ';
  const bar = (text: string) => console.log(BAR + text);

  let spinner = newSpinner();
  const startSpinner = (message: string) => {
    spinner.start(message);
  };
  const startBarSpinner = (message: string) => {
    spinner.start(message, { prefix: BAR });
  };  

  return {
    startingStateInitialization: async () => {
      startSpinner('Initializing...');
    },

    iterationStarted: async (iteration) => {
      spinner.stop();
      bar(`Iteration ${Styles.highlight(iteration.iterationNo.toString())}`);
    },

    iterationCompleted: async (iteration) => {
      console.log('\n');
    },

    generatingTrainingResponses: async (iteration) => {
      startBarSpinner('Generating training responses...');
    },

    trainingResponsesGenerated: async (iteration) => {
      spinner.stop();
    },

    evaluatingTrainingResponses: async (iteration) => {
      startBarSpinner('Evaluating training responses...');
    },

    trainingResponsesEvaluated: async (iteration) => {
      spinner.stop();
    },

    aggregatingTrainingEvaluations: async (iteration) => {
      startBarSpinner('Aggregating training evaluations...');
    },

    trainingEvaluationsAggregated: async (iteration) => {
      spinner.stop();
    },

    analyzingTrainingEvaluations: async (iteration) => {
      startBarSpinner('Analyzing training evaluations...');
    },

    trainingEvaluationsAnalyzed: async (iteration) => {
      spinner.stop();
    },

    generatingCandidates: async (iteration) => {
      startBarSpinner('Generating candidates...');
    },

    candidatesGenerated: async (iteration) => {
      spinner.stop();
    },

    generatingValidationResponses: async (iteration) => {
      startBarSpinner('Generating candidate validation responses...');
    },

    validationResponsesGenerated: async (iteration) => {
      spinner.stop();
    },

    evaluatingValidationResponses: async (iteration) => {
      startBarSpinner('Evaluating validation responses...');
    },

    validationResponsesEvaluated: async (iteration) => {
      spinner.stop();
    },

    aggregatingValidationEvaluations: async (iteration) => {
      startBarSpinner('Aggregating candidate validation evaluations...');
    },

    validationEvaluationsAggregated: async (iteration) => {
      spinner.stop();
    },

    selectingCandidates: async (iteration) => {
      startBarSpinner('Selecting candidates...');
    },

    candidatesSelected: async (iteration) => {
      spinner.stop();
      const generatedCount = iteration.generatedCandidates?.length ?? 0;
      const selectedCount = iteration.selectedCandidateRefs?.length ?? 0;
      bar(
        `Generated ${Styles.highlight(generatedCount.toString())} and ` +
        `selected ${Styles.highlight(selectedCount.toString())} candidates`,
      );
    },

    processCompleted: async (insights) => {
      spinner.stop();

      console.log();
      console.log(
        `Process stopped due to: ${Styles.highlight(insights.stopReason)}`
      );

      const finalCandidatesCount = insights.finalCandidates.length;
      console.log(
        `Generated ${Styles.highlight(finalCandidatesCount.toString())} ` +
        `final candidates`,
      );
    },
  };
}