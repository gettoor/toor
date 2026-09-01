import { 
  type RPEAggregatorOutput,
  type RPEDatasetEntry,
  type RPEEvaluatorOutput,
} from '@gettoor/core';

import { Markdown, Score, Tag } from '../basic';
import { Separator } from './Separator';
import { Metrics } from './Metrics';
import styles from './PromptAggregatedEvaluation.module.scss';

export interface PromptAggregatedEvaluationProps {
  aggregatedEvaluation: RPEAggregatorOutput;
}

export function PromptAggregatedEvaluation(
  props: PromptAggregatedEvaluationProps,
) {
  const { aggregatedEvaluation } = props;

  const renderDatasetEntry = (datasetEntry: RPEDatasetEntry) => {
    if (datasetEntry.vars == undefined) {
      return;
    }
    const keys = Object.keys(datasetEntry.vars).sort();
    return (
      <>
        <h2>Dataset entry</h2>
        <p>
          {keys.map(key => {
            const value = datasetEntry.vars![key];
            const valueString = typeof value === 'object'
              ? JSON.stringify(value)
              : value.toString();
            return (
              <div key={key}>
                <code className={styles['dataset-entry-key']}>{key}</code>
                &nbsp;{valueString}
              </div>
            );
          })}
        </p>
      </>
    );
  };

  const renderEvaluation = (
    index: number,
    status: 'passed' | 'failed',
    evaluation: RPEEvaluatorOutput,
  ) => {
    const key = `${evaluation.candidateRef.candidateId}e${index}`;
    const expectedResponse = evaluation.datasetEntry.expectedResponse;
    return (
      <>
        <Separator/>
        <div key={key}>
          <div>
            Score:&nbsp;
            <Score score={evaluation.score}/>
            <Tag 
              label={status}
              color={status === 'passed' ? 'green' : 'red'}
              className={styles['status']}
            />
          </div>
          {renderDatasetEntry(evaluation.datasetEntry)}
          <h2>Response</h2>
          <div><Markdown content={evaluation.response}/></div>
          { expectedResponse &&
            <div>
              <h2>Expected response</h2>
              <Markdown content={expectedResponse}/>
            </div>
          }
          <h2>Reasoning</h2>
          <div><Markdown content={evaluation.reasoning}/></div>
          { evaluation.metrics &&
            <>
              <h2>Metrics</h2>
              <p>
                <Metrics metrics={evaluation.metrics}/>
              </p>
            </>
          }
        </div>
      </>
    );
  };
  const renderEvaluations = () => {
    const passedEvaluations = aggregatedEvaluation.passedEvaluations
      .map((evaluation, index) => {
        return renderEvaluation(index, 'passed', evaluation);
      });
    const failedEvaluations = aggregatedEvaluation.failedEvaluations
      .map((evaluation, index) => {
        return renderEvaluation(index, 'failed', evaluation);
      });
    return [...passedEvaluations, ...failedEvaluations];
  };

  return (
    <div className={styles['prompt-aggregated-evaluation']}>
      <div className={styles['aggregated-score']}>
        Aggregated score:&nbsp;
        <Score score={aggregatedEvaluation.aggregatedScore}/>
        { aggregatedEvaluation.aggregatedMetrics &&
          <>
            <h2>Aggregated metrics</h2>
            <p>
              <Metrics metrics={aggregatedEvaluation.aggregatedMetrics}/>
            </p>
          </>
        }
      </div>
      {renderEvaluations()}
    </div>
  );
}