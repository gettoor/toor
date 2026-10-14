import { RPECandidate, RPEFinalCandidate } from '@gettoor/core';
import { useState } from 'preact/hooks';

import { ExpandableList, ExpandableSection, LinkButton, MiddotSeparator, Score, Separator } from '../../basic';
import { CandidateModules, Evaluation } from '../../common';
import styles from './FinalCandidate.module.scss';

export interface FinalCandidateProps {
  index: number;
  candidate: RPECandidate;
  finalCandidate: RPEFinalCandidate;
}

export function FinalCandidate(props: FinalCandidateProps) {
  const { index, candidate, finalCandidate } = props;
  const { aggregatedEvaluation } = finalCandidate;
  const { 
    passedEvaluations = [],
    failedEvaluations = [],
  } = aggregatedEvaluation ?? {};
  const totalEvaluations = passedEvaluations.length + failedEvaluations.length;

  const [ more, setMore ] = useState<boolean>(true);
  const [ 
    moreTestEvaluations,
    setMoreTestEvaluations,
  ] = useState<boolean>(false);

  const renderSummary = () => {
    // no summary without aggregated evaluation
    const aggregatedEvaluation = finalCandidate.aggregatedEvaluation;
    if (!aggregatedEvaluation) {
      return;
    }

    // pass rate
    const { passedEvaluations, failedEvaluations } = aggregatedEvaluation;
    const passRate = passedEvaluations.length /
      (passedEvaluations.length + failedEvaluations.length);

    return (
      <span className={styles['final-candidate-summary']}>
        <span>
          Evaluation score:&nbsp;
          <Score
            score={aggregatedEvaluation.aggregatedScore}
            className='text-normal'
          />
          <MiddotSeparator/>
        </span>
        <span>
          Pass rate:&nbsp;
          <Score
            score={passRate}
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

  const renderTestEvaluationsSummary = () => {
    return (
      <span className={styles['final-candidate-summary']}>
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
      title={`Candidate #${index + 1}`}
      headerLevel={1}
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
        { renderSummary() }
        <LinkButton
          label='Less'
          onClick={() => { setMore(false); }}
        /> 
        <CandidateModules
          className={styles['final-candidate-modules']}
          candidate={candidate}
        />
        { totalEvaluations > 0 &&
          <div className={styles['final-candidate-test-evaluations']}>
            <ExpandableSection
              title='Test evaluations'
              headerLevel={2}
              expanded={moreTestEvaluations}
              onToggle={() => { setMoreTestEvaluations(!moreTestEvaluations); }}
            >
              <ExpandableSection.Summary>
                { renderTestEvaluationsSummary() }
                <LinkButton
                  label='More'
                  onClick={() => { setMoreTestEvaluations(true); }}
                />
              </ExpandableSection.Summary>
              <ExpandableSection.Details>
                { renderTestEvaluationsSummary() }
                <LinkButton
                  label='Less'
                  onClick={() => { setMoreTestEvaluations(false); }}
                />
                <div className={styles['final-candidate-test-evaluations-gap']}/>
                <ExpandableList
                  totalItems={totalEvaluations}
                  itemRenderer={renderEvaluationItem}
                />
              </ExpandableSection.Details>
            </ExpandableSection>
          </div>
        }
      </ExpandableSection.Details>
    </ExpandableSection>
  );
}