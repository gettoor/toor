import { clsx } from 'clsx';
import { 
  type RPECandidate,
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPECandidateGeneratorChange,
  RPEDatasetEntry,
} from '@gettoor/core';

import { useLocalStorage } from '../../hooks';
import { 
  Panel,
  Header,
  ExpandableSection,
  LinkButton,
  Metadata,
  MiddotSeparator,
} from '../basic';
import { CandidateAggregatedEvaluation } from './CandidateAggregatedEvaluation';
import { CandidateAnalysis } from './CandidateAnalysis';
import { CandidateChanges } from './CandidateChanges';
import { CandidateModule } from './CandidateModule';
import styles from './CandidateDetails.module.scss';
import { countLabel } from '../../string';

export interface CandidateDetailsData {
  datasetEntries: RPEDatasetEntry[];
  candidate: RPECandidate;
  changesSummary?: string;
  changes?: RPECandidateGeneratorChange[];
  validationAggregatedEvaluation?: RPEAggregatorOutput;
  trainingAggregatedEvaluation?: RPEAggregatorOutput;
  trainingAnalysis?: RPEAnalyzerOutput;
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
        </>
      }
    </Panel>
  );
}