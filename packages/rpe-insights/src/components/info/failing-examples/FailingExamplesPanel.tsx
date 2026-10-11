import clsx from 'clsx';
import { useMemo } from 'preact/hooks';
import { type RPEInsights } from '@gettoor/core';

import { Panel, Separator } from '../../basic';
import { resolveFailingExamples } from './failing-examples-utils';
import { FailingExample } from './FailingExample';
import styles from './FailingExamplesPanel.module.scss';

export interface FailingExamplesPanelProps {
  rpeInsights: RPEInsights;
  visible: boolean;
  onCloseClick: () => void;
}

export function FailingExamplesPanel(props: FailingExamplesPanelProps) {
  const { rpeInsights, visible, onCloseClick } = props;

  const failingExamples = useMemo(
    () => resolveFailingExamples(rpeInsights),
    [rpeInsights],
  );

  const renderFailingExamples = () => {
    return failingExamples.map((example, index) => {
      return (
        <>
          { index > 0 && <Separator className={styles['separator']}/> }
          <FailingExample
            key={example.datasetEntry.datasetEntryId}
            example={example}
          />
        </>
      );
    });
  };

  const panelClassName = clsx(
    styles['failing-examples-panel'],
    {
      [styles['visible']]: visible,
      [styles['hidden']]: !visible,
    },
  );

  return (
    <Panel
      title='Failing examples'
      onCloseClick={onCloseClick}
      className={panelClassName}
    >
      { renderFailingExamples() }
    </Panel>
  );
}