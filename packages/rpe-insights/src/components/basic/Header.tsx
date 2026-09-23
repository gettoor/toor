import clsx from 'clsx';
import { ComponentChildren, toChildArray } from 'preact';
import type { PropsWithChildren } from 'preact/compat';

import styles from './Header.module.scss';
import { findChildrenByType } from '../../preact';

export interface HeaderProps extends PropsWithChildren {
  title: string;
  level?: 1 | 2;
  className?: string;
  onTitleClick?: () => void;
}

function Actions({ children }: { children: ComponentChildren }) {
  return <>{children}</>;
}

function Toolbar({ children }: { children: ComponentChildren }) {
  return <>{children}</>;
}

export function Header(props: HeaderProps) {
  const { title, level = 1, children, className, onTitleClick } = props;

  const [actions, toolbar] = findChildrenByType(children, [Actions, Toolbar]);

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
      <div className={styles['header-actions']}>
        {actions ?? null}
      </div>
      <div className={styles['header-toolbar']}>
        {toolbar ?? null}
      </div>
    </div>
  );
}

Header.Actions = Actions;
Header.Toolbar = Toolbar;