import type { PropsWithChildren } from 'preact/compat';
import styles from './Center.module.scss';

export function Center(props: PropsWithChildren) {
  return (
    <div className={styles['center']}>
      {props.children}
    </div>
  );
}