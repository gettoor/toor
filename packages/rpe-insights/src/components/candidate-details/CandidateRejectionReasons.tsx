import { RPECandidateValidatorViolation } from '@gettoor/core';
import styles from './CandidateRejectionReasons.module.scss';
import { Separator } from '../basic';

export interface CandidateRejectionReasonsProps {
  reasons: RPECandidateValidatorViolation[];
}

export function CandidateRejectionReasons(
  props: CandidateRejectionReasonsProps,
) {
  const { reasons } = props;

  return (
    <div className={styles['rejection-reasons']}>
      { reasons.map((reason, index) => {
        return (
          <>
            { index > 0 && <Separator/> }
            <div
              key={index.toString()}
              className={styles['rejection-reason']}
            >
              { reason.module &&
                <>
                  <h2>Module</h2>
                  <p className='text-muted'>{ reason.module }</p>
                </>
              }
              { reason.requirement &&
                <>
                  <h2>Requirement</h2>
                  <p className='text-muted'>{ reason.requirement }</p>
                </>
              }
              { reason.evidence &&
                <>
                  <h2>Evidence</h2>
                  <p className='text-muted'>{ reason.evidence }</p>
                </>
              }
              { reason.reasoning &&
                <>
                  <h2>Reasoning</h2>
                  <p className='text-muted'>{ reason.reasoning }</p>
                </>
              }
            </div>
          </>
        );
      }) }
    </div>
  );
}