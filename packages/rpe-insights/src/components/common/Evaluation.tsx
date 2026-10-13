import { RPEDatasetEntry, RPEEvaluatorOutput } from '@gettoor/core';

import { Markdown, Score, Separator, Tag } from '../basic';
import { Response } from './Response';
import { hasMetrics } from './metrics';
import { Metrics } from './Metrics';
import { DatasetEntry } from './DatasetEntry';
import styles from './Evaluation.module.scss';

export interface EvaluationProps {
  evaluation: RPEEvaluatorOutput;
  status: 'passed' | 'failed';
}

export function Evaluation(props: EvaluationProps) {
  const { evaluation, status } = props;
  const expectedResponse = evaluation.datasetEntry.expectedResponse;

  const renderDatasetEntry = (datasetEntry: RPEDatasetEntry) => {
    if (datasetEntry.vars == undefined) {
      return;
    }
    return (
      <>
        <h2>Dataset entry ({datasetEntry.datasetEntryId})</h2>
        <p>
          <DatasetEntry datasetEntry={datasetEntry}/>
        </p>
      </>
    );
  };

  return (
    <div
      className={styles['evaluation-evaluation']}
    >
      <div className={styles['evaluation-summary']}>
        Score:&nbsp;
        <Score
          score={evaluation.score}
          className='text-normal'
        />
        <Tag 
          label={status}
          color={status === 'passed' ? 'green' : 'red'}
          className={styles['evaluation-status']}
        />
      </div>
      {renderDatasetEntry(evaluation.datasetEntry)}
      <h2>Response</h2>
      <p>
        <Response 
          response={evaluation.response}
          diffResponse={expectedResponse}
        />
      </p>
      { expectedResponse &&
        <>  
          <h2>Expected response</h2>
          <p>
            <Response
              response={expectedResponse}
              diffResponse={evaluation.response}
            />
          </p>
        </>
      }
      <h2>Reasoning</h2>
      <div><Markdown content={evaluation.reasoning}/></div>
      { hasMetrics(evaluation.metrics) &&
        <>
          <h2>Metrics</h2>
          <p>
            <Metrics metrics={evaluation.metrics!}/>
          </p>
        </>
      }
    </div>
  );
}