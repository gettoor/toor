import { RPEDatasetEntry, RPEInsights } from '@gettoor/core';
import { FailingExampleData } from './FailingExample';

export function resolveFailingExamples(
  rpeInsights: RPEInsights,
): FailingExampleData[] {
  const failingExamples: FailingExampleData[] = [];

  const getFailingExample = (datasetEntry: RPEDatasetEntry) => {
    const { datasetEntryId } = datasetEntry;

    // existing
    const failingExample = failingExamples.find(example => {
      return example.datasetEntry.datasetEntryId === datasetEntryId;
    });
    if (failingExample) {
      return failingExample;
    }

    // new
    const newFailingExample: FailingExampleData = {
      datasetEntry,
      passedEvaluationCount: 0,
      failedEvaluations: [],
      totalIterations: rpeInsights.iterationHistory.length,
    };
    failingExamples.push(newFailingExample);
    return newFailingExample;
  };

  // resolve
  rpeInsights.iterationHistory.forEach(iteration => {
    (iteration.candidateAggregatedEvaluations ?? []).forEach(
      aggregatedEvaluation => {
        // passed evaluations
        aggregatedEvaluation.passedEvaluations.forEach(passedEvaluation => {
          const example = getFailingExample(
            passedEvaluation.datasetEntry,
          );
          example.passedEvaluationCount++;
        });

        // failed evaluations
        aggregatedEvaluation.failedEvaluations.forEach(failedEvaluation => {
          const example = getFailingExample(
            failedEvaluation.datasetEntry,
          );
          example.failedEvaluations.push({
            evaluation: failedEvaluation,
            iterationNo: iteration.iterationNo,
          });
        });
      },
    );
  });

  // take only failing examples and sort by pass rate
  return failingExamples
    .filter(example => {
      return example.failedEvaluations.length > 0;
    })
    .sort((a, b) => {
      return failingExamplePassRate(a) - failingExamplePassRate(b);
    });
}

export function failingExamplePassRate(example: FailingExampleData): number {
  return example.passedEvaluationCount /
    (example.passedEvaluationCount + example.failedEvaluations.length);
}