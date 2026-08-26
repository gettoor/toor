import clsx from 'clsx';
import { RPEInsights } from '@gettoor/core';

import { Panel } from '../basic';
import styles from './InfoPanel.module.scss';

export interface InfoPanelProps {
  rpeInsights: RPEInsights;
  visible: boolean;
  onCloseClick: () => void;
}

export function InfoPanel(props: InfoPanelProps) {
  const { visible, onCloseClick } = props;

  const panelClassName = clsx(
    styles['info-panel'],
    {
      [styles['visible']]: visible,
      [styles['hidden']]: !visible,
    },
  );

  return (
    <Panel
      title='Info'
      onCloseClick={onCloseClick}
      className={panelClassName}
    >
      <h2>Stop reason</h2>
      <p>{props.rpeInsights.stopReason}</p>
    </Panel>
  );
}