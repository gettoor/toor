import { useState } from 'preact/hooks';
import { type RPEInsights } from '@gettoor/core';

import { CandidateTree } from '../candidate-tree';
import { CandidateDetails } from '../candidate-details';
import { getCandidateDetailsData } from './process-view-utils';
import { InfoPanel, Toolbar } from '../tools';

export interface ProcessViewProps {
  rpeInsights: RPEInsights;
}

export function ProcessView(props: ProcessViewProps) {
  const { rpeInsights } = props;

  const [
    selectedCandidateId,
    setSelectedCandidateId,
  ] = useState<string | null>(null);
  const [
    detailsVisible,
    setDetailsVisible,
  ] = useState<boolean>(false);
  const [
    infoVisible,
    setInfoVisible,
  ] = useState<boolean>(false);

  const hideDetails = () => {
    // let the details slide out first...
    setDetailsVisible(false);

    // ...then clear the candidate identifier
    setTimeout(() => {
      clearCandidateId();
    }, 340);
  };

  const selectCandidateId = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setDetailsVisible(true);
    setInfoVisible(false);
  };
  const clearCandidateId = () => {
    setSelectedCandidateId(null);
  };
  const onBackgroundClick = () => {
    clearCandidateId();
    setDetailsVisible(false);
    setInfoVisible(false);
  };
  const onCloseClick = () => {
    setDetailsVisible(false);
  };
  const onInfoClick = () => {
    if (detailsVisible) {
      hideDetails();
    }
    setInfoVisible(!infoVisible);
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
        detailsVisible={detailsVisible}
        onSelectCandidateId={selectCandidateId}
        onBackgroundClick={onBackgroundClick}
      />
      <CandidateDetails
        data={candidateDetailsData}
        visible={detailsVisible}
        onCloseClick={onCloseClick}
      />
      <Toolbar onInfoClick={onInfoClick}/>
      <InfoPanel
        rpeInsights={rpeInsights}
        visible={infoVisible}
        onCloseClick={onInfoClick}
      />
    </>
  );
}