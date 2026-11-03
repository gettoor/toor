import { MetricResult } from '@gettoor/core';

import { capitalize } from '../../string';
import { Table } from '../basic';

export interface MetricsProps {
  metrics: Record<string, MetricResult>;
}

export function Metrics(props: MetricsProps) {
  console.log(props.metrics);
  const names = Object.keys(props.metrics).sort();
  const rows = names.map(name => {
    return [capitalize(name), props.metrics[name].normalizedScore.toFixed(2)];
  });

  return (
    <Table
      header={['Metric', 'Score']}
      rows={rows}
      templateColumns='max-content max-content'
    />
  );
}