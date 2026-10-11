import { VNode } from 'preact';
import clsx from 'clsx';

import { Info } from '../../basic';
import styles from './FailedAtIterations.module.scss';

export interface FailedAtIterationsProps {
  failedAtIterationNo: number[];
  totalIterations: number;
}

export function FailedAtIterations(props: FailedAtIterationsProps) {
  const { failedAtIterationNo, totalIterations } = props;

  const failedAt = (iterationNo: number) => {
    return failedAtIterationNo.includes(iterationNo);
  };

  const renderIterations = () => {
    const components: VNode[] = [];
    for (let iterationNo = 1; iterationNo <= totalIterations; iterationNo++) {
      const failed = failedAt(iterationNo);
      const className = clsx(
        styles['failed-at-iterations-dot'],
        failed ? 'red' : 'green',
      );
      components.push(
        <span
          className={className}
          key={iterationNo}
          title={`Iteration ${iterationNo}`}
        >
          ⏺
        </span>
      );
    }
    return components;
  };

  return (
    <div>
      <Info
        text='Iterations at which the example failed'
        className={styles['failed-at-iterations-info']}
      />
      Iterations:
      {renderIterations()}
    </div>
  );
}