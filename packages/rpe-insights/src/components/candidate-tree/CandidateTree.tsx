import { type RPEIteration, type RPECandidate } from '@gettoor/core';

import styles from './CandidateTree.module.scss';
import { PADDING } from './candidate-tree-consts';
import { CandidateBox } from './CandidateBox';
import { CandidateBoxConnection } from './CandidateBoxConnection';
import { 
  isHighlighted,
  resolveBoxes,
  resolveConnections,
} from './candidate-tree-utils';

export interface CandidateTreeProps {
  candidates: RPECandidate[];
  iterations: Pick<RPEIteration, 
    | 'candidateRefs'
    | 'candidates'
    | 'selectedCandidateRefs'
    | 'aggregatedEvaluations'
    | 'candidateAggregatedEvaluations'
  >[];
  selectedCandidateId: string | null;
  detailsVisible: boolean;
  onSelectCandidateId: (candidateId: string) => void;
  onBackgroundClick: () => void;
}

export function CandidateTree(props: CandidateTreeProps) {
  const { selectedCandidateId: selectedPromptId, detailsVisible } = props;

  const onBoxClick = (promptId: string) => {
    props.onSelectCandidateId(promptId);
  };
  const onBackgroundClick = () => {
    props.onBackgroundClick();
  };

  const boxes = resolveBoxes(props.candidates, props.iterations, onBoxClick);
  const connections = resolveConnections(boxes);
  
  const renderBoxes = () => {
    return boxes.map((box) => (
      <CandidateBox
        key={box.data.candidateId}
        {...box}
        isSelected={box.data.candidateId === selectedPromptId && detailsVisible}
        isHighlighted={isHighlighted(
          boxes,
          box.data.candidateId,
          selectedPromptId,
        )}
      />
    ));
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const id = `${connection.fromCandidateId}-${connection.toCandidateId}`;
      const isConnectionHighlighted =
        isHighlighted(boxes, connection.fromCandidateId, selectedPromptId) &&
        isHighlighted(boxes, connection.toCandidateId, selectedPromptId);
      return <CandidateBoxConnection
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
      className={styles['candidate-tree']}
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
        opacity={0}
        rx={`var(--border-radius)`}
        ry={`var(--border-radius)`}        
        onClick={onBackgroundClick}
      />
      {renderConnections()}
      {renderBoxes()}
      {/* <text
        x="20"
        y="100"
        transform="rotate(-90 20 100)"
      >
        Vertical text
      </text>     */}
    </svg>
  );
}