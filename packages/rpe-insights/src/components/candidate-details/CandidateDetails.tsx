import { clsx } from 'clsx';
import { 
  type RPECandidate,
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPECandidateGeneratorChange,
  RPEDatasetEntry,
} from '@gettoor/core';

import { useLocalStorage } from '../../hooks';
import { Panel, Header, ExpandableSection, LinkButton } from '../basic';
import { CandidateAggregatedEvaluation } from './CandidateAggregatedEvaluation';
import { CandidateAnalysis } from './CandidateAnalysis';
import { CandidateChanges } from './CandidateChanges';
import { CandidateModule } from './CandidateModule';
import styles from './CandidateDetails.module.scss';

export interface CandidateDetailsData {
  datasetEntries: RPEDatasetEntry[];
  candidate: RPECandidate;
  changesSummary?: string;
  changes?: RPECandidateGeneratorChange[];
  trainingAggregatedEvaluation?: RPEAggregatorOutput;
  analysis?: RPEAnalyzerOutput;
}

export interface CandidateDetailsProps {
  data?: CandidateDetailsData;
  visible: boolean;
  onCloseClick: () => void;
}

export function CandidateDetails(props: CandidateDetailsProps) {
  const { data, visible, onCloseClick } = props;

  const [
    moreCandidateChanges,
    setMoreCandidateChanges,
  ] = useLocalStorage(false, 'moreCandidateChanges');

  const renderModules = () => {
    const names = Object.keys(data?.candidate.modules || {}).sort();
    return names.map((name) => {
      const module = data?.candidate.modules[name]!;
      return (
        <CandidateModule
          key={name}
          name={name}
          module={module.content}
        />
      );
    });
  };

  const boxClassName = clsx(
    styles['candidate-details-panel'],
    {
      [styles.visible]: visible,
      [styles.hidden]: !visible,
    },
  );

  return (
    <Panel
      className={boxClassName}
      title='Candidate details'
      onCloseClick={onCloseClick}
    >
      { !!data &&
        <>
          <Header title='Modules'/>
          { renderModules() }
          { data?.changes && data?.changesSummary &&
            <ExpandableSection
              title='Candidate Changes'
              expanded={moreCandidateChanges}
              onToggle={
                () => { setMoreCandidateChanges(!moreCandidateChanges); }
              }
            > 
              <ExpandableSection.Summary>
                <span>
                  {data.changesSummary}&nbsp;
                </span>
                <LinkButton
                  label='More...'
                  onClick={() => { setMoreCandidateChanges(true); }}
                />
              </ExpandableSection.Summary>
              <ExpandableSection.Details>
                <span>
                  {data.changesSummary}&nbsp;
                </span>
                <LinkButton
                  label='Less...'
                  onClick={() => { setMoreCandidateChanges(false); }}
                />
                <CandidateChanges 
                  candidateId={data!.candidate.candidateId}
                  changes={data!.changes}
                />
              </ExpandableSection.Details>
            </ExpandableSection>
          }
          { data!.trainingAggregatedEvaluation &&
            <CandidateAggregatedEvaluation
              aggregatedEvaluation={data!.trainingAggregatedEvaluation}
            />
          }
          {/* { data!.analysis &&
            <>
              <Header title='Analysis'/>
              <CandidateAnalysis 
                datasetEntries={data!.datasetEntries}
                analysis={data!.analysis}
              />
            </>
          } */}
        </>
      }
    </Panel>
  );
}