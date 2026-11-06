import { 
  getGeneratedCandidates, RPEAggregatorOutput, RPEListeners, RPEState } from '@gettoor/core';
import { 
  Styles,
  TableCell,
  newSpinner,
  printTable,
} from '@gettoor/core/console';

export function consoleRPEListeners(): RPEListeners {
  const BAR = Styles.progress('│') + ' ';
  const bar = (text = '') => console.log(BAR + text);

  let spinner = newSpinner();
  const startSpinner = (message: string) => {
    spinner.start(message);
  };
  const startBarSpinner = (message: string) => {
    spinner.start(message, { prefix: BAR });
  };
  let state: RPEState;

  return {
    processStarted: async (processState: RPEState) => {
      state = processState;
    },

    startingStateInitialization: async () => {
      startSpinner('Initializing...');
    },

    iterationStarted: async (iteration) => {
      spinner.stop();
      bar(
        `${Styles.bold('Iteration')} ` +
        `${Styles.highlight(iteration.iterationNo.toString())}`
      );
      bar();
    },

    iterationCompleted: async (iteration) => {
      bar();
      const candidateEntries = (iteration.selectedCandidateRefs ?? [])
        .map(
          candidateRef => candidateRef.candidateId
        )
        .map(candidateId => {
          const evaluation = state.aggregatedEvaluations?.find(evaluation =>
            evaluation.candidateRef.candidateId === candidateId
          );
          return { candidateId, evaluation };
        })
        .filter(candidate => {
          return candidate.evaluation !== undefined;
        })
        .map(candidate => {
          return {
            candidateId: candidate.candidateId,
            evaluation: candidate.evaluation!,
          };
        });
      if (candidateEntries.length > 0) {
        printCandidateTable(candidateEntries, BAR);
        console.log('');
      }
      else {
        bar('No candidates evaluated');
        console.log('');
      }
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

    validatingCandidates: async (iteration) => {
      startBarSpinner('Validating candidates...');
    },

    candidatesValidated: async (iteration) => {
      spinner.stop();
      const validCount = iteration.validCandidates?.length ?? 0;
      const rejectedCount = iteration.rejectedCandidates?.length ?? 0;
      const generatedCount = validCount + rejectedCount;
      if (rejectedCount > 0) {
        bar(
          `Rejected ${Styles.error(rejectedCount.toString())} out of ` +
          `${Styles.highlight(generatedCount.toString())} candidates`,
        );
      }
      else {
        bar('No candidates rejected');
      }
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
      const generatedCandidates = getGeneratedCandidates(iteration);
      const generatedCount = generatedCandidates.length;
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

      console.log();
      if (insights.finalCandidates.length > 0) {
        printCandidateTable(insights.finalCandidates.map(candidate => {
          return {
            candidateId: candidate.candidateRef.candidateId,
            evaluation: candidate.aggregatedEvaluation!,
          }
        }));
      } else {
        console.log(`${Styles.error('No final candidates')}`);
      }
      console.log();
    },
  };
}

function printCandidateTable(
  candidates: Array<{
    candidateId: string;
    evaluation: RPEAggregatorOutput;
  }>,
  prefix = '',
): void {
  const rows: TableCell[][] = [
    [ 'Candidate', 'Passed', 'Failed', 'Aggregated Score' ],
  ];
  for (const { candidateId, evaluation } of candidates) {
    const score = evaluation!.aggregatedScore ?? 0;
        
    const passedCount = evaluation!.passedEvaluations.length ?? 0;
    const passedStyle = passedCount > 0 ? Styles.success : Styles.muted;

    const failedCount = evaluation!.failedEvaluations.length ?? 0;
    const failedStyle = failedCount > 0 ? Styles.error : Styles.muted;

    rows.push([
      candidateId,
      { value: passedCount.toString(), style: passedStyle },
      { value: failedCount.toString(), style: failedStyle },
      { value: score.toFixed(2), style: Styles.highlight },
    ]);
  }
  printTable(rows, { prefix });
}