import clsx from 'clsx';
import { 
  type RPEInsights,
  type RPEProperties,
  sumRPEInsightsUsage,
} from '@gettoor/core';

import { camelCaseToSentenceCase } from '../../../string';
import { Info, Panel, Table } from '../../basic';
import styles from './InfoPanel.module.scss';

export interface InfoPanelProps {
  rpeInsights: RPEInsights;
  visible: boolean;
  onCloseClick: () => void;
}

export function InfoPanel(props: InfoPanelProps) {
  const { rpeInsights, visible, onCloseClick } = props;

  const usage = sumRPEInsightsUsage(rpeInsights);
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
    const propertiesRows = (rpeProperties ?? []).map(property => {
      return [
        property.description
          ? <Info
              text={property.description}
              className={styles['info']}
            />
          : '-',
        camelCaseToSentenceCase(property.key),
        property.value,
      ];
    });
    return (
      <>
        <h2>{title}</h2>
        <p>
          <Table
            header={['', 'Key', 'Value']}
            rows={[
              ['', 'Name', name],
              ...propertiesRows,
            ]}
            templateColumns='max-content max-content 1fr'
            columnStyles={['narrow', 'narrow-left']}
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
      <p>{rpeInsights.stopReason}</p>

      <h2>Token usage by model</h2>
      <p>
        <Table
          header={['Model', 'Input tokens', 'Output tokens']}
          rows={usageRows}
          templateColumns='max-content max-content max-content'
        />
      </p>
      <h1>Components info</h1>
      {renderRPEProperties(
        'Executor',
        rpeInsights.info.executorInfo.name,
        rpeInsights.info.executorInfo.properties,
      )}
      {renderRPEProperties(
        'Evaluator',
        rpeInsights.info.evaluatorInfo.name,
        rpeInsights.info.evaluatorInfo.properties,
      )}
      {renderRPEProperties(
        'Aggregator',
        rpeInsights.info.aggregatorInfo.name,
        rpeInsights.info.aggregatorInfo.properties,
      )}
      {renderRPEProperties(
        'Analyzer',
        rpeInsights.info.analyzerInfo.name,
        rpeInsights.info.analyzerInfo.properties,
      )}
      {renderRPEProperties(
        'Candidate Generator',
        rpeInsights.info.candidateGeneratorInfo.name,
        rpeInsights.info.candidateGeneratorInfo.properties,
      )}
      {renderRPEProperties(
        'Candidate Selector',
        rpeInsights.info.candidateSelectorInfo.name,
        rpeInsights.info.candidateSelectorInfo.properties,
      )}
      {renderRPEProperties(
        'Final Candidate Selector',
        rpeInsights.info.finalCandidateSelectorInfo.name,
        rpeInsights.info.finalCandidateSelectorInfo.properties,
      )}
    </Panel>
  );
}