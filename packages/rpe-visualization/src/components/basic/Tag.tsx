import clsx from 'clsx';
import styles from './Tag.module.scss';

export interface TagProps {
  label: string;
  color: 'red' | 'green';
  className?: string;
}

export function Tag(props: TagProps) {
  const { label, color } = props;
  const className = clsx(
    styles.tag,
    styles[`tag-${color}`],
    props.className,
  );
  return (
    <span className={className}>
      {label}
    </span>
  );
}