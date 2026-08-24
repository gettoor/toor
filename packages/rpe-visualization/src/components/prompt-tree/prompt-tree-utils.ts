import { RPEPrompt } from '@gettoor/core';
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
  prompts: RPEPrompt[],
  iterations: PromptTreeProps['iterations'],
  onBoxClick: (promptId: string) => void,
): PromptBoxProps[] {
  const boxes: PromptBoxProps[] = [];
  let y = PADDING;

  const findPromptById = (promptId: string) => {
    const prompt = prompts.find((prompt) => {
      return prompt.promptId === promptId;
    });
    if (prompt === undefined) {
      throw new Error(`Prompt ${promptId} not found`);
    }
    return prompt;
  };

  const findAggregatedEvaluation = (promptId: string) => {
    const aggregatedEvaluations = iterations.flatMap((iteration) => {
      return iteration.aggregatedEvaluations;
    });
    const aggregatedEvaluation = aggregatedEvaluations.find(
      (aggregatedEvaluation) => {
        return aggregatedEvaluation.promptRef.promptId === promptId;
      },
    );
    return aggregatedEvaluation;
  };

  const findCandidateAggregatedEvaluation = (promptId: string) => {
    const candidateAggregatedEvaluations = iterations.flatMap((iteration) => {
      return iteration.candidateAggregatedEvaluations;
    });
    const candidateAggregatedEvaluation = candidateAggregatedEvaluations.find(
      (candidateAggregatedEvaluation) => {
        return candidateAggregatedEvaluation.promptRef.promptId === promptId;
      },
    );
    return candidateAggregatedEvaluation;
  };

  // seed prompts
  const firstIteration = iterations[0];
  let x = PADDING;
  for (const promptRef of firstIteration.promptRefs) {
    const prompt = findPromptById(promptRef.promptId);
    const aggregatedEvaluation = findAggregatedEvaluation(promptRef.promptId);
    boxes.push({
      data: {
        promptId: promptRef.promptId,
        parentPromptIds: prompt.parentPromptIds,
        aggregatedScore: aggregatedEvaluation?.aggregatedScore,
      },
      x: x,
      y: y,
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      isSelected: false,
      onClick: () => onBoxClick(promptRef.promptId),
    });
    x += BOX_WIDTH + BOX_X_SPACING;
  }
  y += BOX_HEIGHT + BOX_Y_SPACING;

  // candidates from each iteration
  for (const iteration of iterations) {
    let x = PADDING;
    for (const candidate of iteration.candidates) {
      const prompt = findPromptById(candidate.promptRef.promptId);
      const aggregatedEvaluation = findAggregatedEvaluation(prompt.promptId);
      const candidateAggregatedEvaluation = findCandidateAggregatedEvaluation(
        prompt.promptId,
      );
      const isSelected = iteration.selectedPromptRefs?.some(
        (selectedPromptRef) => {
          return selectedPromptRef.promptId === prompt.promptId;
        },
      );
      boxes.push({
        data: {
          promptId: prompt.promptId,
          parentPromptIds: prompt.parentPromptIds,
          aggregatedScore:
            aggregatedEvaluation?.aggregatedScore ??
            candidateAggregatedEvaluation?.aggregatedScore,
        },
        x: x,
        y: y,
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        isSelected,
        onClick: () => onBoxClick(prompt.promptId),
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