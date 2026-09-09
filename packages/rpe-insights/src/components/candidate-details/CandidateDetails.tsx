import { clsx } from 'clsx';
import { 
  type RPECandidate,
  type RPEAggregatorOutput,
  type RPEAnalyzerOutput,
  type RPECandidateGeneratorChange,
  RPEDatasetEntry,
} from '@gettoor/core';

import { Panel } from '../basic';
import { Header } from './Header';
import { CandidateAggregatedEvaluation } from './CandidateAggregatedEvaluation';
import { CandidateAnalysis } from './CandidateAnalysis';
import { CandidateChanges } from './CandidateChanges';
import { CandidateModule } from './CandidateModule';
import styles from './CandidateDetails.module.scss';

export interface CandidateDetailsData {
  datasetEntries: RPEDatasetEntry[];
  candidate: RPECandidate;
  candidateChanges?: RPECandidateGeneratorChange[];
  aggregatedEvaluation: RPEAggregatorOutput;
  analysis?: RPEAnalyzerOutput;
}

export interface CandidateDetailsProps {
  data?: CandidateDetailsData;
  visible: boolean;
  onCloseClick: () => void;
}

export function CandidateDetails(props: CandidateDetailsProps) {
  const { data, visible, onCloseClick } = props;
  const hasData = !!data;

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
      { hasData &&
        <>
          <Header title='Modules'>
          </Header>
          { renderModules() }
          { data?.candidateChanges &&
            <>
              <Header title='Candidate Changes'/>
              <CandidateChanges 
                candidateId={data!.candidate.candidateId}
                changes={data!.candidateChanges}
              />
            </>
          }
          <Header title='Evaluations'/>
          <CandidateAggregatedEvaluation
            aggregatedEvaluation={data!.aggregatedEvaluation}
          />
          { data!.analysis &&
            <>
              <Header title='Analysis'/>
              <CandidateAnalysis 
                datasetEntries={data!.datasetEntries}
                analysis={data!.analysis}
              />
            </>
          }
        </>
      }
    </Panel>
  );
}