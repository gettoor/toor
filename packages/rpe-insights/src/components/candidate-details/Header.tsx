import clsx from 'clsx';
import type { PropsWithChildren } from 'preact/compat';
import styles from './Header.module.scss';

export interface HeaderProps extends PropsWithChildren {
  title: string;
  level?: 1 | 2;
  className?: string;
}

export function Header(props: HeaderProps) {
  const { title, level = 1, children, className } = props;

  const headerClassName = clsx(styles['header'], className);
  const headerTitleClassName = clsx(
    styles['header-title'],
    {
      [styles['header-title-level-1']]: level === 1,
      [styles['header-title-level-2']]: level === 2,
    },
  );

  return (
    <div className={headerClassName}>
      <div className={headerTitleClassName}>{title}</div>
      { children &&
        <div className={styles['header-side-bar']}>
          {children}
        </div>
      }
    </div>
  );
}