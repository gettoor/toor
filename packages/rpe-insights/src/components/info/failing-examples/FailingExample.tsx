import { RPEDatasetEntry, RPEEvaluatorOutput } from '@gettoor/core';
import { useState } from 'preact/hooks';

import { 
  ExpandableList,
  ExpandableSection,
  LinkButton,
  Markdown,
  MiddotSeparator,
  Score,
  Separator,
  Tag,
} from '../../basic';
import { DatasetEntry, Response } from '../../common';
import { failingExamplePassRate } from './failing-examples-utils';
import styles from './FailingExample.module.scss';
import { FailedAtIterations } from './FailedAtIterations';

export interface FailingExampleEvaluation {
  evaluation: RPEEvaluatorOutput;
  iterationNo: number;
}

export interface FailingExampleData {
  datasetEntry: RPEDatasetEntry;
  passedEvaluationCount: number;
  failedEvaluations: FailingExampleEvaluation[];
  totalIterations: number;
}

export interface FailingExampleProps {
  example: FailingExampleData;
  className?: string;
}

export function FailingExample(props: FailingExampleProps) {
  const { example, className } = props;
  const passRate = failingExamplePassRate(example);
  const failedAtIterationNo = example.failedEvaluations.map(evaluation => {
    return evaluation.iterationNo;
  });

  const [ more, setMore ] = useState<boolean>(false);

  const renderSummary = () => {
    return (
      <span className={styles['failing-example-summary']}>
        <span>
          Pass rate:&nbsp;
          <Score
            score={passRate}
            className='text-normal'
          />
          <MiddotSeparator/>
        </span>
        <span className='green'>
          {example.passedEvaluationCount} passed
          <MiddotSeparator/>
        </span>
        <span className='red'>
          {example.failedEvaluations.length} failed
          <MiddotSeparator/>
        </span>
      </span>
    );
  };

  const renderEvaluation = (
    index: number,
    evaluation: RPEEvaluatorOutput,
    iterationNo: number,
  ) => {
    const key = `${evaluation.datasetEntry.datasetEntryId}e${index}`;
    const expectedResponse = evaluation.datasetEntry.expectedResponse;

    return (
      <div 
        className={styles['failing-example-evaluation']}
        key={key}
      >
        { index > 0 && <Separator/> }
        <p>
          Iteration:&nbsp;
          <span className='text-normal'>
            {iterationNo}
          </span>
          <MiddotSeparator/>
          Score:&nbsp;
          <Score
            score={evaluation.score}
            className='text-normal'
          />
          <Tag 
            label='failed'
            color='red'
            className={styles['failing-example-evaluation-status']}
          />
        </p>
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
      </div>
    )
  };
  const renderEvaluationItem = (index: number) => {
    const evaluation = example.failedEvaluations[index];
    return renderEvaluation(
      index,
      evaluation.evaluation,
      evaluation.iterationNo,
    );
  };

  return (
    <div className={className}>
      <ExpandableSection
        title={example.datasetEntry.datasetEntryId}
        headerLevel={2}
        expanded={more}
        onToggle={() => { setMore(!more); }}
      >
        <ExpandableSection.Summary>
          <p>
            { renderSummary() }
            <LinkButton
              label='More'
              onClick={() => { setMore(true); }}
            />
            <FailedAtIterations
              failedAtIterationNo={failedAtIterationNo}
              totalIterations={example.totalIterations}
            />
          </p>       
        </ExpandableSection.Summary>
        <ExpandableSection.Details>
          <p>
            { renderSummary() }
            <LinkButton
              label='Less'
              onClick={() => { setMore(false); }}
            /> 
            <FailedAtIterations
              failedAtIterationNo={failedAtIterationNo}
              totalIterations={example.totalIterations}
            />
          </p>
          <h2>Dataset entry</h2>
          <p>
            <DatasetEntry datasetEntry={example.datasetEntry}/>
          </p>
          <h2>Evaluations</h2>
          <ExpandableList
            totalItems={example.failedEvaluations.length}
            itemRenderer={renderEvaluationItem}
          />          
        </ExpandableSection.Details>
      </ExpandableSection>
    </div>
  );
}