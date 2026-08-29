import clsx from 'clsx';
import { type RPEInsights, sumRPEInsightsUsage } from '@gettoor/core';

import { Panel, Table } from '../basic';
import styles from './InfoPanel.module.scss';

export interface InfoPanelProps {
  rpeInsights: RPEInsights;
  visible: boolean;
  onCloseClick: () => void;
}

export function InfoPanel(props: InfoPanelProps) {
  const { visible, onCloseClick } = props;

  const usage = sumRPEInsightsUsage(props.rpeInsights);
  const usageRows = usage.modelUsage
    .sort((a, b) => a.modelName.localeCompare(b.modelName))
    .map(modelUsage => {
      const inputTokens = modelUsage.inputTokens ?? 0;
      const outputTokens = modelUsage.outputTokens ?? 0;
      return [
        modelUsage.modelName,
        inputTokens.toString(),
        outputTokens.toString(),
      ];
    });

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

      <h2>Token usage by model</h2>
      <p>
        <Table
          header={['Model', 'Input tokens', 'Output tokens']}
          rows={usageRows}
        />
      </p>

    </Panel>
  );
}