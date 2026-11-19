import { clsx } from 'clsx';
import { useState, useEffect } from 'preact/hooks';
import { 
  type RPECandidate,
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPECandidateGeneratorChange,
  RPEDatasetEntry,
  RPECandidateValidatorViolation,
} from '@gettoor/core';

import { useLocalStorage } from '../../hooks';
import { 
  Panel,
  Header,
  ExpandableSection,
  LinkButton,
  Metadata,
  MiddotSeparator,
  Separator,
} from '../basic';
import { CandidateModules } from '../common';
import { CandidateAggregatedEvaluation } from './CandidateAggregatedEvaluation';
import { CandidateAnalysis } from './CandidateAnalysis';
import { CandidateChanges } from './CandidateChanges';
import styles from './CandidateDetails.module.scss';
import { countLabel } from '../../string';
import { VNode } from 'preact';
import { CandidateRejectionReasons } from './CandidateRejectionReasons';

export interface CandidateDetailsData {
  datasetEntries: RPEDatasetEntry[];
  candidate: RPECandidate;
  changesSummary?: string;
  changes?: RPECandidateGeneratorChange[];
  validationAggregatedEvaluation?: RPEAggregatorOutput;
  trainingAggregatedEvaluation?: RPEAggregatorOutput;
  trainingAnalysis?: RPEAnalyzerOutput;
  finalAggregatedEvaluation?: RPEAggregatorOutput;
  isFinalCandidate: boolean;
  rejectionReasons?: RPECandidateValidatorViolation[];
}

export interface CandidateDetailsProps {
  data?: CandidateDetailsData;
  visible: boolean;
  onCloseClick: () => void;
}

export function CandidateDetails(props: CandidateDetailsProps) {
  const { data, visible, onCloseClick } = props;

  const [
    moreMetadata,
    setMoreMetadata,
  ] = useLocalStorage(false, 'moreCandidateMetadata');
  const [
    moreCandidateChanges,
    setMoreCandidateChanges,
  ] = useLocalStorage(false, 'moreCandidateChanges');
  const [
    moreRejectionReason,
    setMoreRejectionReason,
  ] = useLocalStorage(false, 'moreRejectionReason');


  // minimized
  const [isMinimized, setIsMinimized] = useState(false);
  useEffect(
    () => {
      if (!visible) {
        setIsMinimized(false);
      }
    },
    [visible],
  );
  const onMinimizeClick = () => {
    setIsMinimized(!isMinimized);
  };

  const renderPanelSubtitle = () => {
    const nodes: VNode[] = [];

    const appendNode = (node: VNode) => {
      if (nodes.length > 0) {
        nodes.push(<MiddotSeparator/>);
      }
      nodes.push(node);
    };

    if (data) {
      appendNode(
        <div>
          <span>Identifier:</span>&nbsp;
          <span className='text-normal'>{data.candidate.candidateId}</span>
        </div>
      );
    }

    const isRejected = (data?.rejectionReasons ?? []).length > 0;
    if (isRejected) {
      appendNode(
        <div key='rejected' className='red'>
          Rejected
        </div>
      );
    }

    if (data?.isFinalCandidate) {
      appendNode(
        <div key='final' className='green'>
          Final Candidate
        </div>
      );
    }

    return (
      <div
        className={styles['candidate-details-panel-subtitle']}
      >
        {nodes}
      </div>
    );
  };

  const renderMetadataSummary = () => {
    const keys = Object.keys(data?.candidate.metadata ?? {});
    return (
      <span>
        { countLabel(keys.length, 'metadata entry', 'metadata entries') }
        <MiddotSeparator/>
      </span>
    );
  };

  const renderChangesSummary = () => {
    return (
      <span className='text-muted'>
        {data?.changesSummary}&nbsp;
      </span>
    );
  };

  const renderRejectionReasons = (reasons: string[]) => {
    return (
      <div className='text-muted'>
        { reasons.map((reason, index) => {
          return (
            <>
              { index > 0 && <Separator/> }
              <div
                key={index.toString()}
              >
                { reason }
              </div>
            </>
          );
        }) }
      </div>
    );
  };

  const boxClassName = clsx(
    styles['candidate-details-panel'],
    {
      [styles['visible']]: visible,
      [styles['hidden']]: !visible,
      [styles['minimized']]: isMinimized,
    },
  );

  return (
    <Panel
      className={boxClassName}
      title='Candidate details'
      subtitle={renderPanelSubtitle()}
      onMinimizeClick={onMinimizeClick}
      onHeaderClick={onMinimizeClick}
      onCloseClick={onCloseClick}
    >
      { !!data &&
        <>
          <Header title='Modules'/>
          <CandidateModules candidate={data!.candidate}/>
          { data?.candidate.metadata &&
            <ExpandableSection
              title='Metadata'
              expanded={moreMetadata}
              onToggle={
                () => { setMoreMetadata(!moreMetadata); }
              }
            > 
              <ExpandableSection.Summary>
                { renderMetadataSummary() }
                <LinkButton
                  label='More'
                  onClick={() => { setMoreMetadata(true); }}
                />
              </ExpandableSection.Summary>
              <ExpandableSection.Details>
                { renderMetadataSummary() }
                <LinkButton
                  label='Less'
                  onClick={() => { setMoreMetadata(false); }}
                />
                <Metadata metadata={data.candidate.metadata}/>
              </ExpandableSection.Details>
            </ExpandableSection>
          }
          { data?.changes && data?.changesSummary &&
            <ExpandableSection
              title='Candidate Changes'
              expanded={moreCandidateChanges}
              onToggle={
                () => { setMoreCandidateChanges(!moreCandidateChanges); }
              }
            > 
              <ExpandableSection.Summary>
                { renderChangesSummary() }
                <LinkButton
                  label='More'
                  onClick={() => { setMoreCandidateChanges(true); }}
                />
              </ExpandableSection.Summary>
              <ExpandableSection.Details>
                { renderChangesSummary() }
                <LinkButton
                  label='Less'
                  onClick={() => { setMoreCandidateChanges(false); }}
                />
                <CandidateChanges 
                  candidateId={data!.candidate.candidateId}
                  changes={data!.changes}
                />
              </ExpandableSection.Details>
            </ExpandableSection>
          }
          { data?.rejectionReasons &&
            <ExpandableSection
              title='Rejection Reasons'
              expanded={moreRejectionReason}
              onToggle={() => { setMoreRejectionReason(!moreRejectionReason); }}
            >
              <ExpandableSection.Details>
                <CandidateRejectionReasons reasons={data.rejectionReasons}/>
              </ExpandableSection.Details>
            </ExpandableSection>
          }
          { data!.validationAggregatedEvaluation &&
            <CandidateAggregatedEvaluation
              title='Validation Evaluations'
              moreLocalStorageKey='moreCandidateValidationEvaluations'
              aggregatedEvaluation={data!.validationAggregatedEvaluation}
            />
          }
          { data!.trainingAggregatedEvaluation &&
            <CandidateAggregatedEvaluation
              title='Training Evaluations'
              moreLocalStorageKey='moreCandidateTrainingEvaluations'
              aggregatedEvaluation={data!.trainingAggregatedEvaluation}
            />
          }
          { data!.trainingAnalysis &&
            <CandidateAnalysis 
              datasetEntries={data!.datasetEntries}
              analysis={data!.trainingAnalysis}
            />
          }
          { data!.finalAggregatedEvaluation &&
            <CandidateAggregatedEvaluation
              title='Final Candidate Evaluations'
              moreLocalStorageKey='moreCandidateFinalEvaluations'
              aggregatedEvaluation={data!.finalAggregatedEvaluation}
            />
          }
        </>
      }
    </Panel>
  );
}