import clsx from 'clsx';
import styles from './Icon.module.scss';

export interface IconProps {
  name: string;
  title?: string;
  className?: string;
}

export function Icon(props: IconProps) {
  const className = clsx(styles['material-symbols-outlined'], props.className);
  return (
    <span className={className} title={props.title}>
      {props.name}
    </span>
  );
}