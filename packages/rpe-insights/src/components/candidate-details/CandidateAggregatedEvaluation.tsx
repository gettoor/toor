import {
  type RPEAggregatorOutput,
  type RPEDatasetEntry,
  type RPEEvaluatorOutput,
} from '@gettoor/core';

import { useLocalStorage } from '../../hooks';
import { hasMetrics } from './metrics';
import { 
  Markdown,
  Score,
  Tag,
  Separator,
  ExpandableSection,
  ExpandableList,
  LinkButton,
  MiddotSeparator,
} from '../basic';
import { DatasetEntry, Response } from '../common';
import { Metrics } from './Metrics';
import styles from './CandidateAggregatedEvaluation.module.scss';

export interface CandidateAggregatedEvaluationProps {
  title: string;
  moreLocalStorageKey: string;
  aggregatedEvaluation: RPEAggregatorOutput;
}

export function CandidateAggregatedEvaluation(
  props: CandidateAggregatedEvaluationProps,
) {
  const { title, moreLocalStorageKey, aggregatedEvaluation } = props;
  const { 
    aggregatedScore,
    passedEvaluations,
    failedEvaluations,
  } = aggregatedEvaluation;
  const totalEvaluations = passedEvaluations.length + failedEvaluations.length;

  const [ more, setMore ] = useLocalStorage(false, moreLocalStorageKey);

  const renderSummary = () => {
    return (
      <span className={styles['candidate-aggregated-evaluation-summary']}>
        <span>
          Aggregated score:&nbsp;
          <Score
            score={aggregatedScore}
            className='text-normal'
          />
          <MiddotSeparator/>
        </span>
        <span className='green'>
          {passedEvaluations.length} passed
          <MiddotSeparator/>
        </span>
        <span className='red'>
          {failedEvaluations.length} failed
          <MiddotSeparator/>
        </span>
      </span>
    );
  };

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
        <div
          key={key}
          className={styles['candidate-aggregated-evaluation-evaluation']}
        >
          <div className={styles['candidate-aggregated-evaluation-summary']}>
            Score:&nbsp;
            <Score
              score={evaluation.score}
              className='text-normal'
            />
            <Tag 
              label={status}
              color={status === 'passed' ? 'green' : 'red'}
              className={styles['candidate-aggregated-evaluation-status']}
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
      </>
    );
  };
  const renderEvaluationItem = (index: number) => {
    const allEvaluations = [...failedEvaluations, ...passedEvaluations];
    const evaluation = allEvaluations[index];
    return renderEvaluation(
      index,
      passedEvaluations.includes(evaluation) ? 'passed' : 'failed',
      evaluation,
    );
  };

  return (
    <ExpandableSection
      title={title}
      expanded={more}
      onToggle={() => { setMore(!more); }}
    >
      <ExpandableSection.Summary>
        { renderSummary() }
        <LinkButton
          label='More'
          onClick={() => { setMore(true); }}
        />
      </ExpandableSection.Summary>
      <ExpandableSection.Details>
        <div className={styles['candidate-aggregated-evaluation']}>
          <div className={styles['candidate-aggregated-evaluation-score']}>
            { renderSummary() }
            <LinkButton
              label='Less'
              onClick={() => { setMore(false); }}
            />
            { hasMetrics(aggregatedEvaluation.aggregatedMetrics) &&
              <>
                <h2>Aggregated metrics</h2>
                <p>
                  <Metrics metrics={aggregatedEvaluation.aggregatedMetrics!}/>
                </p>
              </>
            }
          </div>
          <ExpandableList
            totalItems={totalEvaluations}
            itemRenderer={renderEvaluationItem}
          />
          </div>
        </ExpandableSection.Details>
    </ExpandableSection>
  );
}