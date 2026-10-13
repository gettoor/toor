import { MetricResult } from '@gettoor/core';

export function hasMetrics(metrics?: Record<string, MetricResult>): boolean {
  if (!metrics) {
    return false;
  }
  return Object.keys(metrics).length > 0;
}