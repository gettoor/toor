import { type RPECandidate } from '@gettoor/core';

import { 
  PADDING,
  BOX_WIDTH,
  BOX_HEIGHT,
  BOX_X_SPACING,
  BOX_Y_SPACING,
} from './prompt-tree-consts';
import { PromptBoxProps } from './PromptBox';
import { PromptBoxConnectionProps } from './PromptBoxConnection';
import { PromptTreeProps } from './PromptTree';

/**
 * Resolve the boxes for the prompt tree.
 */
export function resolveBoxes(
  candidates: RPECandidate[],
  iterations: PromptTreeProps['iterations'],
  onBoxClick: (promptId: string) => void,
): PromptBoxProps[] {
  const boxes: PromptBoxProps[] = [];
  let y = PADDING;

  const findCandidateById = (candidateId: string) => {
    const candidate = candidates.find((itr) => {
      return itr.candidateId === candidateId;
    });
    if (candidate === undefined) {
      throw new Error(`Candidate ${candidateId} not found`);
    }
    return candidate;
  };

  const findAggregatedEvaluation = (candidateId: string) => {
    const aggregatedEvaluations = iterations.flatMap((iteration) => {
      return iteration.aggregatedEvaluations;
    });
    const aggregatedEvaluation = aggregatedEvaluations.find(
      (evaluation) => {
        return evaluation.candidateRef.candidateId === candidateId;
      },
    );
    return aggregatedEvaluation;
  };

  const findCandidateAggregatedEvaluation = (candidateId: string) => {
    const candidateAggregatedEvaluations = iterations.flatMap((iteration) => {
      return iteration.candidateAggregatedEvaluations;
    });
    const candidateAggregatedEvaluation = candidateAggregatedEvaluations.find(
      (evaluation) => {
        return evaluation.candidateRef.candidateId === candidateId;
      },
    );
    return candidateAggregatedEvaluation;
  };

  // seed prompts
  const firstIteration = iterations[0];
  let x = PADDING;
  for (const candidateRef of firstIteration.candidateRefs) {
    const prompt = findCandidateById(candidateRef.candidateId);
    const aggregatedEvaluation = findAggregatedEvaluation(
      candidateRef.candidateId,
    );
    boxes.push({
      data: {
        promptId: candidateRef.candidateId,
        parentPromptIds: prompt.parentCandidateIds,
        aggregatedScore: aggregatedEvaluation?.aggregatedScore,
        passedEvaluationsCount: aggregatedEvaluation?.passedEvaluations.length,
        failedEvaluationsCount: aggregatedEvaluation?.failedEvaluations.length,
      },
      x,
      y,
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      isSelected: false,
      onClick: () => onBoxClick(candidateRef.candidateId),
    });
    x += BOX_WIDTH + BOX_X_SPACING;
  }
  y += BOX_HEIGHT + BOX_Y_SPACING;

  // candidates from each iteration
  for (const iteration of iterations) {
    let x = PADDING;
    for (const newCandidate of iteration.candidates) {
      const candidate = findCandidateById(
        newCandidate.candidateRef.candidateId,
      );
      const candidateAggregatedEvaluation = findCandidateAggregatedEvaluation(
        candidate.candidateId,
      );
      const isSelected = iteration.selectedCandidateRefs?.some(
        (selectedPromptRef) => {
          return selectedPromptRef.candidateId === candidate.candidateId;
        },
      );
      boxes.push({
        data: {
          promptId: candidate.candidateId,
          parentPromptIds: candidate.parentCandidateIds,
          aggregatedScore: candidateAggregatedEvaluation?.aggregatedScore,
          passedEvaluationsCount:
            candidateAggregatedEvaluation?.passedEvaluations.length,
          failedEvaluationsCount:
            candidateAggregatedEvaluation?.failedEvaluations.length,
          promptChangesCount: newCandidate.changes.length,
        },
        x,
        y,
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        isSelected,
        onClick: () => onBoxClick(candidate.candidateId),
      });
      x += BOX_WIDTH + BOX_X_SPACING;
    }
    y += BOX_HEIGHT + BOX_Y_SPACING;
  }

  return boxes;
}

/**
 * Resolve the connections for the prompt tree.
 */
export function resolveConnections(
  boxes: PromptBoxProps[],
): PromptBoxConnectionProps[] {
  const connections: PromptBoxConnectionProps[] = [];
  for (const boxA of boxes) {
    for (const boxB of boxes) {
      if (boxA.data.promptId === boxB.data.promptId) {
        continue;
      }
      const isAParentOfB = boxB.data.parentPromptIds?.includes(
        boxA.data.promptId,
      );
      if (isAParentOfB) {
        connections.push({
          fromPromptId: boxA.data.promptId,
          fromX: boxA.x + boxA.width / 2,
          fromY: boxA.y + boxA.height,
          toPromptId: boxB.data.promptId,
          toX: boxB.x + boxB.width / 2,
          toY: boxB.y,
        });
      }
    }
  }
  return connections;
};

function getAncestors(
  boxes: PromptBoxProps[],
  promptId: string,
): PromptBoxProps[] {
  let box = boxes.find((box) => {
    return box.data.promptId === promptId;
  });
  if (box === undefined) {
    return [];
  }
  const ancestors: PromptBoxProps[] = [];
  let currentBoxes: PromptBoxProps[] = [box];
  while (currentBoxes.length > 0) {
    const box = currentBoxes.shift()!;
    ancestors.push(box);
    const parentBoxes = (box.data.parentPromptIds ?? [])
      .map((parentPromptId) => {
        const parentBox = boxes.find((box) => {
          return box.data.promptId === parentPromptId;
        });
        if (parentBox === undefined) {
          throw new Error(`Parent prompt ${parentPromptId} not found`);
        }
        return parentBox;
      });
    currentBoxes.push(...parentBoxes);
  }

  return ancestors.filter((ancestor) => {
    return ancestor.data.promptId !== promptId;
  });
}

/**
 * Check if the prompt is highlighted.
 */
export function isHighlighted(
  boxes: PromptBoxProps[],
  promptId: string,
  selectedPromptId: string | null,
): boolean | undefined {
  if (selectedPromptId === null) {
    return undefined;
  }
  if (promptId === selectedPromptId) {
    return true;
  }

  // a prompt is highlighted if the prompt is an ancestor of the selected prompt
  const selectedPromptAncestors = getAncestors(boxes, selectedPromptId);
  const isSelectedPromptAncestor = selectedPromptAncestors.some((ancestor) => {
    return ancestor.data.promptId === promptId;
  });
  if (isSelectedPromptAncestor) {
    return true;
  }

  // a prompt is highlighted if the selected prompt is an ancestor of the prompt
  const checkPromptAncestors = getAncestors(boxes, promptId);
  const isCheckPromptAncestor = checkPromptAncestors.some((ancestor) => {
    return ancestor.data.promptId === selectedPromptId;
  });
  if (isCheckPromptAncestor) {
    return true;
  }

  return false;
}