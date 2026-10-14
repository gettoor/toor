import { RPEInsights } from '@gettoor/core';
import clsx from 'clsx';

import { Panel, Separator } from '../../basic';
import { FinalCandidate } from './FinalCandidate';
import styles from './FinalCandidatesPanel.module.scss';

export interface FinalCandidatesPanelProps {
  rpeInsights: RPEInsights;
  visible: boolean;
  onCloseClick: () => void;
}

export function FinalCandidatesPanel(props: FinalCandidatesPanelProps) {
  const { rpeInsights, visible, onCloseClick } = props;

  const renderFinalCandidates = () => {
    return rpeInsights.finalCandidates.map((finalCandidate, index) => {
      const candidateId = finalCandidate.candidateRef.candidateId;
      const candidate = rpeInsights.candidates.find(
        (candidate) => candidate.candidateId === candidateId,
      )!;
      return (
        <>
          <FinalCandidate
            key={candidateId}
            index={index}
            candidate={candidate}
            finalCandidate={finalCandidate}
          />
        </>
      );
    });
  };

  const panelClassName = clsx(
    styles['final-candidates-panel'],
    {
      [styles['visible']]: visible,
      [styles['hidden']]: !visible,
    },
  );

  return (
    <Panel
      title='Final Candidates'
      onCloseClick={onCloseClick}
      className={panelClassName}
    >
      { renderFinalCandidates() }
    </Panel>
  );
}