import clsx from 'clsx';
import type { PropsWithChildren } from 'preact/compat';
import styles from './Header.module.scss';

export interface HeaderProps extends PropsWithChildren {
  title: string;
  level?: 1 | 2;
}

export function Header(props: HeaderProps) {
  const { title, level = 1, children } = props;

  const headerTitleClassName = clsx(
    styles['header-title'],
    {
      [styles['header-title-level-1']]: level === 1,
      [styles['header-title-level-2']]: level === 2,
    },
  );
  return (
    <div className={styles['header']}>
      <div className={headerTitleClassName}>{title}</div>
      { children &&
        <div className={styles['header-side-bar']}>
          {children}
        </div>
      }
    </div>
  );
}