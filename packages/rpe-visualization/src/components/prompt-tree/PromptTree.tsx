import { RPEIteration, RPEPrompt } from '@gettoor/core';

import styles from './PromptTree.module.scss';
import { PADDING } from './prompt-tree-consts';
import { PromptBox } from './PromptBox';
import { PromptBoxConnection } from './PromptBoxConnection';
import { 
  isHighlighted,
  resolveBoxes,
  resolveConnections,
} from './prompt-tree-utils';

export interface PromptTreeProps {
  prompts: RPEPrompt[];
  iterations: Pick<RPEIteration, 
    | 'promptRefs'
    | 'candidates'
    | 'selectedPromptRefs'
    | 'aggregatedEvaluations'
    | 'candidateAggregatedEvaluations'
  >[];
  selectedPromptId: string | null;
  onSelectPromptId: (promptId: string) => void;
  onBackgroundClick: () => void;
}

export function PromptTree(props: PromptTreeProps) {
  const { selectedPromptId } = props;

  const onBoxClick = (promptId: string) => {
    props.onSelectPromptId(promptId);
  };
  const onBackgroundClick = () => {
    props.onBackgroundClick();
  };

  const boxes = resolveBoxes(props.prompts, props.iterations, onBoxClick);
  const connections = resolveConnections(boxes);
  
  const renderBoxes = () => {
    return boxes.map((box) => (
      <PromptBox
        key={box.data.promptId}
        {...box}
        isHighlighted={isHighlighted(boxes, box.data.promptId, selectedPromptId)}
      />
    ));
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const id = `${connection.fromPromptId}-${connection.toPromptId}`;
      const isConnectionHighlighted =
        isHighlighted(boxes, connection.fromPromptId, selectedPromptId) &&
        isHighlighted(boxes, connection.toPromptId, selectedPromptId);
      return <PromptBoxConnection
        key={id}
        {...connection}
        isHighlighted={isConnectionHighlighted}
      />;
    });
  };

  const width = PADDING + boxes.reduce((max, box) => {
    return Math.max(max, box.x + box.width);
  }, 0);
  const height = PADDING + boxes.reduce((max, box) => {
    return Math.max(max, box.y + box.height);
  }, 0);

  return (
    <svg
      className={styles['prompt-tree']}
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill='var(--bg)'
        stroke='none'
        opacity={1}
        onClick={onBackgroundClick}
      />
      {renderBoxes()}
      {renderConnections()}
    </svg>
  );
}