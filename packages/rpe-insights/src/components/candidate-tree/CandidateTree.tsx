import clsx from 'clsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import { RPEInsights } from '@gettoor/core';

import styles from './CandidateTree.module.scss';
import { PADDING, PAN_THRESHOLD } from './candidate-tree-consts';
import { CandidateBox } from './CandidateBox';
import { CandidateBoxConnection } from './CandidateBoxConnection';
import { 
  type TreeOffset,
  clampTreeOffset,
  isHighlighted,
  isInsideCandidateBox,
  resolveBoxes,
  resolveConnections,
} from './candidate-tree-utils';

export interface CandidateTreeProps {
  rpeInsights: RPEInsights;
  selectedCandidateId: string | null;
  detailsVisible: boolean;
  onSelectCandidateId: (candidateId: string) => void;
  onBackgroundClick: () => void;
}

interface PanState {
  pointerId: number;
  startX: number;
  startY: number;
  startOffset: TreeOffset;
}

export function CandidateTree(props: CandidateTreeProps) {
  const { rpeInsights, selectedCandidateId: selectedPromptId, detailsVisible } = props;

  const viewportRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const offsetRef = useRef<TreeOffset>({ x: 0, y: 0 });
  const panRef = useRef<PanState | null>(null);
  const pannedRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);

  const onBoxClick = (promptId: string) => {
    props.onSelectCandidateId(promptId);
  };

  const boxes = resolveBoxes(rpeInsights, onBoxClick);
  const connections = resolveConnections(boxes);

  const width = PADDING + boxes.reduce(
    (max, box) => Math.max(max, box.x + box.width),
    0,
  );
  const height = PADDING + boxes.reduce(
    (max, box) => Math.max(max, box.y + box.height),
    0,
  );

  const applyOffset = (offset: TreeOffset) => {
    const viewport = viewportRef.current;
    const svg = svgRef.current;
    if (viewport === null || svg === null) {
      return;
    }
    const clampedOffset = clampTreeOffset(
      offset,
      width,
      height,
      viewport.clientWidth,
      viewport.clientHeight,
    );
    offsetRef.current = clampedOffset;
    svg.style.transform =
      `translate(${clampedOffset.x}px, ${clampedOffset.y}px)`;
  };

  useEffect(
    () => {
      const onResize = () => {
        return applyOffset(offsetRef.current);
      };
      onResize();
      window.addEventListener('resize', onResize);
      return () => {
        return window.removeEventListener('resize', onResize);
      };
    },
    [width, height],
  );

  const onPointerDown = (event: PointerEvent) => {
    // if no the main button or inside a candidate box
    if (event.button !== 0 || isInsideCandidateBox(event.target)) {
      return;
    }
    event.preventDefault();
    viewportRef.current?.setPointerCapture(event.pointerId);
    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
    };
    pannedRef.current = false;
    setIsPanning(true);
  };

  const onPointerMove = (event: PointerEvent) => {
    const pan = panRef.current;
    if (pan === null || pan.pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - pan.startX;
    const dy = event.clientY - pan.startY;
    if (Math.abs(dx) > PAN_THRESHOLD || Math.abs(dy) > PAN_THRESHOLD) {
      pannedRef.current = true;
    }
    if (pannedRef.current) {
      applyOffset({
        x: pan.startOffset.x + dx,
        y: pan.startOffset.y + dy,
      });
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    const pan = panRef.current;
    if (pan === null || pan.pointerId !== event.pointerId) {
      return;
    }
    viewportRef.current?.releasePointerCapture(event.pointerId);
    panRef.current = null;
    setIsPanning(false);
  };

  const onClick = (event: MouseEvent) => {
    if (pannedRef.current) {
      pannedRef.current = false;
      return;
    }
    if (!isInsideCandidateBox(event.target)) {
      props.onBackgroundClick();
    }
  };
  
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

  const viewportClassName = clsx(
    styles['candidate-tree-viewport'],
    { [styles.panning]: isPanning },
  );

  return (
    <div
      ref={viewportRef}
      className={viewportClassName}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <svg
        ref={svgRef}
        className={styles['candidate-tree']}
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
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
    </div>
  );
}
