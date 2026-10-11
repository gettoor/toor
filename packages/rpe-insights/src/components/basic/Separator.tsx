import clsx from 'clsx';
import styles from './Separator.module.scss';

export interface SeparatorProps {
  className?: string;
}

export function Separator(props: SeparatorProps) {
  const { className } = props;
  return (
    <div className={clsx(styles['separator'], className)} />
  );
}