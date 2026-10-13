import { useState } from 'preact/hooks';
import { type RPEInsights } from '@gettoor/core';

import { CandidateTree } from '../candidate-tree';
import { CandidateDetails } from '../candidate-details';
import { getCandidateDetailsData } from './process-view-utils';
import { Toolbar } from '../tools';
import { InfoPanel, FailingExamplesPanel, FinalCandidatesPanel } from '../info';

export interface ProcessViewProps {
  rpeInsights: RPEInsights;
}

type VisiblePanel =
  | 'details'
  | 'info'
  | 'failing-examples'
  | 'final-candidates'
  | null;

export function ProcessView(props: ProcessViewProps) {
  const { rpeInsights } = props;

  const [
    selectedCandidateId,
    setSelectedCandidateId,
  ] = useState<string | null>(null);
  const [
    visiblePanel,
    setVisiblePanel,
  ] = useState<VisiblePanel>(null);

  const selectCandidateId = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    showPanel('details');
  };
  const clearCandidateId = () => {
    setSelectedCandidateId(null);
  };

  const hidePanel = () => {
    if (visiblePanel === 'details') {
      // let the details slide out first...
      setTimeout(() => {
        clearCandidateId();
      }, 340);  
    }
    setVisiblePanel(null);
  };

  const showPanel = (panel: VisiblePanel) => {
    if (visiblePanel === panel) {
      return;
    }

    if (visiblePanel === 'details') {
      // let the details slide out first...
      setTimeout(() => {
        clearCandidateId();
      }, 340);  
    }
    setVisiblePanel(panel);
  };

  const candidateDetailsData = selectedCandidateId !== null
    ? getCandidateDetailsData(
      rpeInsights,
      selectedCandidateId,
    )
    : undefined;

  return (
    <>
      <CandidateTree
        rpeInsights={rpeInsights}
        selectedCandidateId={selectedCandidateId}
        detailsVisible={visiblePanel === 'details'}
        onSelectCandidateId={selectCandidateId}
        onBackgroundClick={hidePanel}
      />
      <CandidateDetails
        data={candidateDetailsData}
        visible={visiblePanel === 'details'}
        onCloseClick={hidePanel}
      />
      <Toolbar 
        onInfoClick={() => showPanel('info')}
        onFailingExamplesClick={() => showPanel('failing-examples')}
        onFinalCandidatesClick={() => showPanel('final-candidates')}
      />
      <InfoPanel
        rpeInsights={rpeInsights}
        visible={visiblePanel === 'info'}
        onCloseClick={hidePanel}
      />
      <FailingExamplesPanel
        rpeInsights={rpeInsights}
        visible={visiblePanel === 'failing-examples'}
        onCloseClick={hidePanel}
      />
      <FinalCandidatesPanel
        rpeInsights={rpeInsights}
        visible={visiblePanel === 'final-candidates'}
        onCloseClick={hidePanel}
      />
    </>
  );
}