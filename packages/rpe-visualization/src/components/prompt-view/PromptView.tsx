import { useState } from 'preact/hooks';
import { RPEIteration, RPEPrompt } from '@gettoor/core';

import styles from './PromptView.module.scss';
import { PromptTree } from '../prompt-tree';
import { PromptDetails } from '../prompt-details';
import { getPromptDetailsData } from './prompt-view-utils';

export interface PromptViewProps {
  prompts: RPEPrompt[];
  iterations: RPEIteration[];
}

export function PromptView(props: PromptViewProps) {
  const { prompts, iterations } = props;

  const [
    selectedPromptId,
    setSelectedPromptId,
  ] = useState<string | null>(null);
  const [ detailsVisible, setDetailsVisible ] = useState<boolean>(false);

  const selectPromptId = (promptId: string) => {
    setSelectedPromptId(promptId);
    setDetailsVisible(promptId !== null);
  };
  const clearPromptId = () => {
    setSelectedPromptId(null);
  };
  const onBackgroundClick = () => {
    if (detailsVisible) {
      setDetailsVisible(false);
      return;
    }
    clearPromptId();
  };

  const promptTreeIterations = iterations.map(iteration => {
    return {
      promptRefs: iteration.promptRefs,
      candidates: iteration.candidates,
      selectedPromptRefs: iteration.selectedPromptRefs,
      aggregatedEvaluations: iteration.aggregatedEvaluations,
      candidateAggregatedEvaluations: iteration.candidateAggregatedEvaluations,
    };
  });
  const promptDetailsData = selectedPromptId !== null
    ? getPromptDetailsData(prompts, iterations, selectedPromptId)
    : undefined;

  return (
    <>
      <div 
        className={styles['prompt-view-background']}
        onClick={onBackgroundClick}
      />
      <PromptTree
        prompts={prompts}
        iterations={promptTreeIterations}
        selectedPromptId={selectedPromptId}
        onSelectPromptId={selectPromptId}
        onBackgroundClick={onBackgroundClick}
      />
      <PromptDetails
        data={promptDetailsData}
        visible={detailsVisible}
        onOverlayClick={() => {}}
      />
    </>
  );
}