import { useState } from 'preact/hooks';
import { type RPEInsights } from '@gettoor/core';

import { PromptTree } from '../prompt-tree';
import { PromptDetails } from '../prompt-details';
import { getPromptDetailsData } from './prompt-view-utils';
import { InfoPanel, Toolbar } from '../tools';

export interface PromptViewProps {
  rpeInsights: RPEInsights;
}

export function PromptView(props: PromptViewProps) {
  const { rpeInsights } = props;
  const { prompts, iterationHistory } = rpeInsights;

  const [
    selectedPromptId,
    setSelectedPromptId,
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

    // ...then clear the prompt identifier
    setTimeout(() => {
      clearPromptId();
    }, 340);
  };

  const selectPromptId = (promptId: string) => {
    setSelectedPromptId(promptId);
    setDetailsVisible(true);
    setInfoVisible(false);
  };
  const clearPromptId = () => {
    setSelectedPromptId(null);
  };
  const onCloseClick = () => {
    setDetailsVisible(false);
  };
  const onBackgroundClick = () => {
    if (!detailsVisible) {
      clearPromptId();
      return;
    }
    hideDetails();
  };
  const onInfoClick = () => {
    if (detailsVisible) {
      hideDetails();
    }
    setInfoVisible(!infoVisible);
  };

  const promptTreeIterations = iterationHistory.map(iteration => {
    return {
      promptRefs: iteration.promptRefs,
      candidates: iteration.candidates,
      selectedPromptRefs: iteration.selectedPromptRefs,
      aggregatedEvaluations: iteration.aggregatedEvaluations,
      candidateAggregatedEvaluations: iteration.candidateAggregatedEvaluations,
    };
  });
  const promptDetailsData = selectedPromptId !== null
    ? getPromptDetailsData(prompts, iterationHistory, selectedPromptId)
    : undefined;

  return (
    <>
      <PromptTree
        prompts={prompts}
        iterations={promptTreeIterations}
        selectedPromptId={selectedPromptId}
        detailsVisible={detailsVisible}
        onSelectPromptId={selectPromptId}
        onBackgroundClick={onBackgroundClick}
      />
      <PromptDetails
        data={promptDetailsData}
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