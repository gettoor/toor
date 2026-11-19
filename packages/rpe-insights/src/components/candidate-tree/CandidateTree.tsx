import clsx from 'clsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import { RPEInsights } from '@gettoor/core';

import styles from './CandidateTree.module.scss';
import { 
  BOX_HEIGHT,
  BOX_Y_SPACING,
  PADDING_TOP,
  PADDING_RIGHT,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PAN_THRESHOLD,
  BOX_BORDER_RADIUS,
} from './candidate-tree-consts';
import { CandidateBox } from './CandidateBox';
import { CandidateBoxConnection } from './CandidateBoxConnection';
import { 
  type TreeOffset,
  clampTreeOffset,
  getCandidateBoxId,
  isHighlighted,
  isInsideCandidateBox,
  resolveBoxes,
  resolveConnections,
} from './candidate-tree-utils';
import { VNode } from 'preact';
import { IterationLabel } from './IterationLabel';

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
  candidateId: string | null;
}

const WHEEL_LINE_HEIGHT = 16;

function wheelDeltaToPixels(
  delta: number,
  deltaMode: number,
  pageSize: number,
): number {
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return delta * WHEEL_LINE_HEIGHT;
  }
  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return delta * pageSize;
  }
  return delta;
}

const DISABLE_BACKGROUND_CLICK = true;

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

  const boxesWidth = boxes.reduce(
    (max, box) => Math.max(max, box.x + box.width),
    0,
  );
  const boxesHeight = boxes.reduce(
    (max, box) => Math.max(max, box.y + box.height),
    0,
  );
  const width = PADDING_LEFT + boxesWidth + PADDING_RIGHT;
  const height = PADDING_TOP + boxesHeight + PADDING_BOTTOM;

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
      const viewport = viewportRef.current;
      const onResize = () => {
        return applyOffset(offsetRef.current);
      };
      const onWheel = (event: WheelEvent) => {
        if (viewport === null || event.ctrlKey) {
          return;
        }
        event.preventDefault();
        const deltaY = wheelDeltaToPixels(
          event.deltaY,
          event.deltaMode,
          viewport.clientHeight,
        );
        applyOffset({
          x: offsetRef.current.x,
          y: offsetRef.current.y - deltaY,
        });
      };
      onResize();
      window.addEventListener('resize', onResize);
      viewport?.addEventListener('wheel', onWheel, { passive: false });
      return () => {
        window.removeEventListener('resize', onResize);
        viewport?.removeEventListener('wheel', onWheel);
      };
    },
    [width, height],
  );

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }
    // Suppress the compatibility click. A press that stays within the pan
    // threshold is delivered as a box click on release.
    event.preventDefault();
    viewportRef.current?.setPointerCapture(event.pointerId);
    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      candidateId: getCandidateBoxId(event.target),
    };
    pannedRef.current = false;
  };

  const onPointerMove = (event: PointerEvent) => {
    const pan = panRef.current;
    if (pan === null || pan.pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - pan.startX;
    const dy = event.clientY - pan.startY;
    const isPanThreshold =
      Math.abs(dx) > PAN_THRESHOLD || Math.abs(dy) > PAN_THRESHOLD;
    if (!pannedRef.current && isPanThreshold) {
      pannedRef.current = true;
      setIsPanning(true);
    }
    if (pannedRef.current) {
      applyOffset({
        x: pan.startOffset.x + dx,
        y: pan.startOffset.y + dy,
      });
    }
  };

  const endPan = (event: PointerEvent, commitClick: boolean) => {
    const pan = panRef.current;
    if (pan === null || pan.pointerId !== event.pointerId) {
      return;
    }
    viewportRef.current?.releasePointerCapture(event.pointerId);
    const { candidateId } = pan;
    const panned = pannedRef.current;
    panRef.current = null;
    setIsPanning(false);
    if (commitClick && !panned && candidateId !== null) {
      props.onSelectCandidateId(candidateId);
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    endPan(event, true);
  };

  const onPointerCancel = (event: PointerEvent) => {
    endPan(event, false);
  };

  const onClickCapture = (event: MouseEvent) => {
    if (!pannedRef.current) {
      return;
    }
    pannedRef.current = false;
    event.stopPropagation();
    event.preventDefault();
  };

  const onClick = (event: MouseEvent) => {
    if (pannedRef.current) {
      pannedRef.current = false;
      return;
    }
    if (!DISABLE_BACKGROUND_CLICK && !isInsideCandidateBox(event.target)) {
      props.onBackgroundClick();
    }
  };

  const renderCorners = () => {
    const inset = 0.5;
    const arm = 48;
    const radius = 8;
    const left = inset;
    const top = inset;
    const right = width - inset;
    const bottom = height - inset;

    const corners = [
      `M ${left} ${top + arm} ` +
      `L ${left} ${top + radius} ` + 
      `A ${radius} ${radius} 0 0 1 ${left + radius} ${top} ` +
      `L ${left + arm} ${top}`,

      `M ${right - arm} ${top} ` +
      `L ${right - radius} ${top} ` +
      `A ${radius} ${radius} 0 0 1 ${right} ${top + radius} ` +
      `L ${right} ${top + arm}`,

      `M ${right} ${bottom - arm} ` +
      `L ${right} ${bottom - radius} ` +
      `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom} ` +
      `L ${right - arm} ${bottom}`,
      
      `M ${left + arm} ${bottom} ` +
      `L ${left + radius} ${bottom} ` +
      `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius} ` +
      `L ${left} ${bottom - arm}`,
    ];

    return (
      <g
        stroke="var(--text-muted)"
        strokeWidth={1}
        strokeDasharray="8 4"
        fill="none"
        opacity={0.25}
      >
        {corners.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
    );
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

  const renderIterationLabels = () => {
    const nodes: VNode[] = [];
    const iterationCount = rpeInsights.iterationHistory.length;
    for (let index = 0; index < iterationCount + 1; index++) {
      const label = index === 0 ? 'Seed' : `Iteration ${index}`;
      const x = 36;
      const y = index * (BOX_HEIGHT + BOX_Y_SPACING) +
        BOX_HEIGHT + PADDING_TOP - BOX_BORDER_RADIUS;
      nodes.push(
        <IterationLabel
          key={index}
          label={label}
          x={x}
          y={y}
          fill='var(--text-muted)'
        />
      );
    }
    return <>{nodes}</>;
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
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
      onClick={onClick}
    >
      <svg
        ref={svgRef}
        className={styles['candidate-tree']}
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {renderCorners()}
        {renderConnections()}
        {renderBoxes()}
        {renderIterationLabels()}
      </svg>
    </div>
  );
}
