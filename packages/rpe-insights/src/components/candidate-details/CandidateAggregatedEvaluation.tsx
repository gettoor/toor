import { type RPEAggregatorOutput } from '@gettoor/core';

import { useLocalStorage } from '../../hooks';
import { 
  Score,
  Separator,
  ExpandableSection,
  ExpandableList,
  LinkButton,
  MiddotSeparator,
} from '../basic';
import { Evaluation, hasMetrics, Metrics } from '../common';
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
      <span>
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

  const renderEvaluationItem = (index: number) => {
    const allEvaluations = [...failedEvaluations, ...passedEvaluations];
    const evaluation = allEvaluations[index];
    const key = `${evaluation.candidateRef.candidateId}e${index}`;
    return (
      <>
        <Separator/>
        <Evaluation
          key={key}
          status={passedEvaluations.includes(evaluation) ? 'passed' : 'failed'}
          evaluation={evaluation}
        />
      </>
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
          <div className={styles['candidate-aggregated-evaluation-summary']}>
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