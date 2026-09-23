import clsx from 'clsx';
import styles from './CandidateBox.module.scss';
import { MiddotSeparator } from '../basic';

export interface CandidateBoxData {
  candidateId: string;
  parentCandidateIds?: string[];
  aggregatedScore?: number;
  finalAggregatedScore?: number;
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
  const { data } = props;

  const infoClassName = clsx(
    styles['candidate-box-foreign-object'],
    {
      [styles.muted]: props.isHighlighted == false,
    },
  );
  const passedEvaluationsCountClassName = clsx(
    styles['candidate-box-info-value'],
    { [styles['candidate-box-info-value-green']]:
        data.passedEvaluationsCount !== undefined &&
        data.passedEvaluationsCount > 0
    },
  );  
  const failedEvaluationsCountClassName = clsx(
    styles['candidate-box-info-value'],
    { [styles['candidate-box-info-value-red']]:
        data.failedEvaluationsCount !== undefined &&
        data.failedEvaluationsCount > 0
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
          { data.aggregatedScore !== undefined &&
            <>
              <div className={styles['candidate-box-score-name']}>
                Score
              </div>
              <div className={styles['candidate-box-score-value']}>
                { data.aggregatedScore.toFixed(2) }
                { data.finalAggregatedScore !== undefined &&
                  <>
                    <MiddotSeparator/>
                    <span className='green'>
                      { data.finalAggregatedScore.toFixed(2) }
                    </span>
                  </>
                }
              </div>
            </>
          }
          <div className={styles['candidate-box-info-properties']}>
            <div className={styles['candidate-box-info-name']}>
              Passed:
            </div>
            <div className={passedEvaluationsCountClassName}>
              { data.passedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['candidate-box-info-name']}>
              Failed:
            </div>
            <div className={failedEvaluationsCountClassName}>
              { data.failedEvaluationsCount ?? '-'}
            </div>
            <div className={styles['candidate-box-info-name']}>
              Changes:
            </div>
            <div className={styles['candidate-box-info-value']}>
              { data.candidateChangesCount ?? '-'}
            </div>
          </div>
        </div>
      </foreignObject>
    </>
  );
}