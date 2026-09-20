import * as YAML from 'yaml';
import { useState } from 'preact/hooks';
import {
  type RPEResponse,
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
  LinkButton,
  MiddotSeparator,
} from '../basic';
import { Metrics } from './Metrics';
import styles from './CandidateAggregatedEvaluation.module.scss';
import { ExpandableList } from '../basic/ExpandableList';

export interface CandidateAggregatedEvaluationProps {
  aggregatedEvaluation: RPEAggregatorOutput;
}

export function CandidateAggregatedEvaluation(
  props: CandidateAggregatedEvaluationProps,
) {
  const { aggregatedEvaluation } = props;
  const { 
    aggregatedScore,
    passedEvaluations,
    failedEvaluations,
  } = aggregatedEvaluation;
  const totalEvaluations = passedEvaluations.length + failedEvaluations.length;

  // const [more, setMore] = useState(false);
  const [
    moreEvaluations,
    setMoreEvaluations
  ] = useLocalStorage(false, 'moreCandidateAggregatedEvaluations');

  const responseToString = (response: RPEResponse) => {
    if (typeof response === 'string') {
      return response;
    }
    return YAML.stringify(response);
  };

  const renderSummary = () => {
    return (
      <>
      <span>
        Aggregated score:&nbsp;
        <Score score={aggregatedScore}/>
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
    </>
    )
  };

  const renderDatasetEntry = (datasetEntry: RPEDatasetEntry) => {
    if (datasetEntry.vars == undefined) {
      return;
    }
    const keys = Object.keys(datasetEntry.vars).sort();
    return (
      <>
        <h2>Dataset entry ({datasetEntry.datasetEntryId})</h2>
        <p>
          {keys.map(key => {
            const value = datasetEntry.vars![key];
            const valueString = typeof value === 'object'
              ? JSON.stringify(value)
              : value.toString();
            return (
              <div key={key}>
                <code
                  className={styles['candidate-aggregated-evaluation-key']}
                >
                  {key}
                </code>
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
        <div
          key={key}
          className={styles['candidate-aggregated-evaluation-evaluation']}
        >
          <div>
            Score:&nbsp;
            <Score score={evaluation.score}/>
            <Tag 
              label={status}
              color={status === 'passed' ? 'green' : 'red'}
              className={styles['candidate-aggregated-evaluation-status']}
            />
          </div>
          {renderDatasetEntry(evaluation.datasetEntry)}
          <h2>Response</h2>
          <p>
            <Markdown content={responseToString(evaluation.response)}/>
          </p>
          { expectedResponse &&
            <p>
              <h2>Expected response</h2>
              <Markdown content={responseToString(expectedResponse)}/>
            </p>
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
      title='Training Evaluations'
      expanded={moreEvaluations}
      onToggle={() => { setMoreEvaluations(!moreEvaluations); }}
    >
      <ExpandableSection.Summary>
        { renderSummary() }
        <LinkButton
          label='More...'
          onClick={() => { setMoreEvaluations(true); }}
        />
      </ExpandableSection.Summary>
      <ExpandableSection.Details>
        <div className={styles['candidate-aggregated-evaluation']}>
          <div className={styles['aggregated-score']}>
            { renderSummary() }
            <LinkButton
              label='Less...'
              onClick={() => { setMoreEvaluations(false); }}
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