import clsx from 'clsx';
import styles from './PromptBox.module.scss';
export interface PromptBoxData {
  promptId: string;
  parentPromptIds?: string[];
  aggregatedScore?: number;
  passedEvaluationsCount?: number;
  failedEvaluationsCount?: number;
  promptChangesCount?: number;
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
  const passedEvaluationsCountClassName = clsx(
    styles['prompt-box-info-value'],
    { [styles['prompt-box-info-value-green']]:
        props.data.passedEvaluationsCount !== undefined &&
        props.data.passedEvaluationsCount > 0
    },
  );  
  const failedEvaluationsCountClassName = clsx(
    styles['prompt-box-info-value'],
    { [styles['prompt-box-info-value-red']]:
        props.data.failedEvaluationsCount !== undefined &&
        props.data.failedEvaluationsCount > 0
    },
  );
  const stroke = props.isSelected ? 'var(--stroke-selected)' : 'var(--stroke)';

  return (
    <>
      <rect
        x={props.x + 0.5}
        y={props.y + 0.5}
        width={props.width}
        height={props.height}
        fill='var(--fill)'
        stroke={stroke}
        strokeWidth={'1px'}
        vectorEffect='non-scaling-stroke'
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
        <div className={infoClassName}>
          { props.data.aggregatedScore !== undefined &&
            <>
              <div className={styles['prompt-box-score-name']}>
                Score
              </div>
              <div className={styles['prompt-box-score-value']}>
                {props.data.aggregatedScore.toFixed(2)}
              </div>
            </>
          }
          <div className={styles['prompt-box-info-properties']}>
            <div className={styles['prompt-box-info-name']}>
              Passed:
            </div>
            <div className={passedEvaluationsCountClassName}>
              { props.data.passedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['prompt-box-info-name']}>
              Failed:
            </div>
            <div className={failedEvaluationsCountClassName}>
              { props.data.failedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['prompt-box-info-name']}>
              Changes:
            </div>
            <div className={styles['prompt-box-info-value']}>
              { props.data.promptChangesCount ?? '-'}
            </div>
          </div>
        </div>
      </foreignObject>
    </>
  );
}