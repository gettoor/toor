import clsx from 'clsx';
import styles from './PromptBox.module.scss';
export interface PromptBoxData {
  promptId: string;
  parentPromptIds?: string[];
  aggregatedScore?: number;
}

export interface PromptBoxProps {
  data: PromptBoxData;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

export function PromptBox(props: PromptBoxProps) {
  const infoClassName = clsx(
    styles['prompt-box-foreign-object'],
    {
      [styles.muted]: props.isHighlighted == false,
    },
  );
  return (
    <>
      <rect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill='var(--fill)'
        stroke='var(--stroke)'
        strokeWidth={1}
        opacity={props.isHighlighted == false ? 0.25 : 1}
        rx={`var(--border-radius)`}
        ry={`var(--border-radius)`}
        cursor='pointer'
        onClick={props.onClick}
      />
      <foreignObject
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        onClick={props.onClick}
      >
        { props.data.aggregatedScore !== undefined &&
          <div className={infoClassName}>
            <div className={styles['prompt-box-info-score-label']}>
              Score
            </div>
            <div className={styles['prompt-box-info-score']}>
              {props.data.aggregatedScore.toFixed(2)}
            </div>
          </div>
        }
      </foreignObject>
    </>
  );
}