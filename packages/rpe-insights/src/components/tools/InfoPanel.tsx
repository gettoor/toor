import clsx from 'clsx';
import { 
  type RPEInsights,
  type RPEProperties,
  sumRPEInsightsUsage,
} from '@gettoor/core';

import { camelCaseToSentenceCase } from '../../string';
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

  const renderRPEProperties = (
    title: string,
    name: string,
    rpeProperties?: RPEProperties,
  ) => {
    const propertiesRows = (rpeProperties ?? []).map(property => [
      camelCaseToSentenceCase(property.key),
      property.value,
      property.description,
    ]);
    return (
      <>
        <h2>{title}</h2>
        <p>
          <Table
            header={['Key', 'Value', 'Description']}
            rows={[
              ['Name', name, 'Name of the component.'],
              ...propertiesRows,
            ]}
          />
        </p>
      </>
    )
  }

  return (
    <Panel
      title='Info'
      onCloseClick={onCloseClick}
      className={panelClassName}
    >
      <h1>General</h1>
      <h2>Stop reason</h2>
      <p>{props.rpeInsights.stopReason}</p>

      <h2>Token usage by model</h2>
      <p>
        <Table
          header={['Model', 'Input tokens', 'Output tokens']}
          rows={usageRows}
        />
      </p>
      <h1>Components info</h1>
      {renderRPEProperties(
        'Executor',
        props.rpeInsights.info.executorInfo.name,
        props.rpeInsights.info.executorInfo.properties,
      )}
      {renderRPEProperties(
        'Evaluator',
        props.rpeInsights.info.evaluatorInfo.name,
        props.rpeInsights.info.evaluatorInfo.properties,
      )}
      {renderRPEProperties(
        'Aggregator',
        props.rpeInsights.info.aggregatorInfo.name,
        props.rpeInsights.info.aggregatorInfo.properties,
      )}
      {renderRPEProperties(
        'Analyzer',
        props.rpeInsights.info.analyzerInfo.name,
        props.rpeInsights.info.analyzerInfo.properties,
      )}
      {renderRPEProperties(
        'Candidate Generator',
        props.rpeInsights.info.candidateGeneratorInfo.name,
        props.rpeInsights.info.candidateGeneratorInfo.properties,
      )}
      {renderRPEProperties(
        'Candidate Selector',
        props.rpeInsights.info.candidateSelectorInfo.name,
        props.rpeInsights.info.candidateSelectorInfo.properties,
      )}
    </Panel>
  );
}