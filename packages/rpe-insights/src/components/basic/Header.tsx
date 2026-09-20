import clsx from 'clsx';
import type { PropsWithChildren } from 'preact/compat';

import styles from './Header.module.scss';

export interface HeaderProps extends PropsWithChildren {
  title: string;
  level?: 1 | 2;
  className?: string;
  onTitleClick?: () => void;
}

export function Header(props: HeaderProps) {
  const { title, level = 1, children, className, onTitleClick } = props;

  const headerClassName = clsx(styles['header'], className);
  const headerTitleClassName = clsx(
    styles['header-title'],
    {
      [styles['header-title-level-1']]: level === 1,
      [styles['header-title-level-2']]: level === 2,
      [styles['header-title-clickable']]: !!onTitleClick,
    },
  );

  return (
    <div className={headerClassName}>
      <div
        className={headerTitleClassName}
        onClick={onTitleClick}
      >
        {title}
      </div>
      { children &&
        <div className={styles['header-side-bar']}>
          {children}
        </div>
      }
    </div>
  );
}