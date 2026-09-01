import clsx from 'clsx';
import styles from './CandidateBox.module.scss';

export interface CandidateBoxData {
  candidateId: string;
  parentCandidateIds?: string[];
  aggregatedScore?: number;
  passedEvaluationsCount?: number;
  failedEvaluationsCount?: number;
  candidateChangesCount?: number;
}

export interface CandidateBoxProps {
  data: CandidateBoxData;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

export function CandidateBox(props: CandidateBoxProps) {
  const infoClassName = clsx(
    styles['candidate-box-foreign-object'],
    {
      [styles.muted]: props.isHighlighted == false,
    },
  );
  const passedEvaluationsCountClassName = clsx(
    styles['candidate-box-info-value'],
    { [styles['candidate-box-info-value-green']]:
        props.data.passedEvaluationsCount !== undefined &&
        props.data.passedEvaluationsCount > 0
    },
  );  
  const failedEvaluationsCountClassName = clsx(
    styles['candidate-box-info-value'],
    { [styles['candidate-box-info-value-red']]:
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
              <div className={styles['candidate-box-score-name']}>
                Score
              </div>
              <div className={styles['candidate-box-score-value']}>
                {props.data.aggregatedScore.toFixed(2)}
              </div>
            </>
          }
          <div className={styles['candidate-box-info-properties']}>
            <div className={styles['candidate-box-info-name']}>
              Passed:
            </div>
            <div className={passedEvaluationsCountClassName}>
              { props.data.passedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['candidate-box-info-name']}>
              Failed:
            </div>
            <div className={failedEvaluationsCountClassName}>
              { props.data.failedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['candidate-box-info-name']}>
              Changes:
            </div>
            <div className={styles['candidate-box-info-value']}>
              { props.data.candidateChangesCount ?? '-'}
            </div>
          </div>
        </div>
      </foreignObject>
    </>
  );
}