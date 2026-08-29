import { type RPEInsights } from '@gettoor/core';

export function loadRPEInsights(): RPEInsights {
  const rpeInsightsElement = document.getElementById('rpe-insights');
  if (!rpeInsightsElement) {
    throw new Error('RPE insights not found');
  }
  const rpeInsights = JSON.parse(rpeInsightsElement.textContent || '{}');
  return rpeInsights;
}