import type { PropsWithChildren } from 'preact/compat';
import clsx from 'clsx';

import styles from './Panel.module.scss';
import { IconButton } from './IconButton';
import { VNode } from 'preact';

export interface PanelProps extends PropsWithChildren {
  title: string;
  subtitle?: string | VNode;
  className?: string;
  onCloseClick: () => void;
}

export function Panel(props: PanelProps) {
  const panelClassName = clsx(styles['panel'], props.className);
  return (
    <div className={panelClassName}>
      <div className={styles['panel-header']}>
        <div className={styles['panel-header-title']}>
          <div>{props.title}</div>
          { props.subtitle &&
            <div className={styles['panel-header-subtitle']}>
              {props.subtitle}
            </div>
          }
        </div>
        <IconButton
          name='close'
          title='Close'
          onClick={props.onCloseClick}
        />        
      </div>
      <div className={styles['panel-content']}>
        {props.children}
      </div>
    </div>
  );
}