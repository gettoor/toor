import styles from './MiddotSeparator.module.scss';

export function MiddotSeparator() {
  return (
    <span className={styles['middot-separator']}>&nbsp;·&nbsp;</span>
  );
}