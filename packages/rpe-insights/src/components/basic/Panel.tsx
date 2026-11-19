import type { PropsWithChildren } from 'preact/compat';
import clsx from 'clsx';

import styles from './Panel.module.scss';
import { IconButton } from './IconButton';
import { VNode } from 'preact';

export interface PanelProps extends PropsWithChildren {
  title: string;
  subtitle?: string | VNode;
  className?: string;
  onMinimizeClick?: () => void;
  onCloseClick: () => void;
  onHeaderClick?: () => void;
}

export function Panel(props: PanelProps) {
  const onMinimizeClick = (event: MouseEvent) => {
    event.stopPropagation();
    props.onMinimizeClick?.();
  };

  const onHeaderClick = (event: MouseEvent) => {
    event.stopPropagation();
    props.onHeaderClick?.();
  };

  const panelClassName = clsx(
    styles['panel'],
    props.className,
  );
  const headerClassName = clsx(
    styles['panel-header'],
    { [styles['panel-header-clickable']]: props.onHeaderClick !== undefined },
  );

  return (
    <div className={panelClassName}>
      <div className={styles['panel-top-bar']}>
        <div
          className={headerClassName}
          onClick={(event: MouseEvent) => onHeaderClick(event)}
        >
          <div className={styles['panel-header-title']}>
            <div>{props.title}</div>
          </div>
          <div className={styles['panel-header-actions']}>
            { props.onMinimizeClick &&
              <IconButton
                name='minimize'
                title='Minimize'
                onClick={(event) => onMinimizeClick(event)}
              />        
            }
            <IconButton
              name='close'
              title='Close'
              onClick={props.onCloseClick}
            />        
          </div>
        </div>
        { props.subtitle &&
          <div className={styles['panel-header-subtitle']}>
            {props.subtitle}
          </div>
        }
      </div>
      <div className={styles['panel-content']}>
        {props.children}
      </div>
    </div>
  );
}