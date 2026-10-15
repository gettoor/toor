import { ExperimentScore } from '@gettoor/core';
import { Styles, Style } from '@gettoor/core/console';

export function colorForScore(score: ExperimentScore): Style {
  return colorForNormalizedScore(score.normalizedScore);
}

export function colorForNormalizedScore(normalizedScore: number): Style {
  if (normalizedScore <= 0.33) {
    return Styles.error;
  }
  if (normalizedScore <= 0.66) {
    return Styles.warning;
  }
  return Styles.success;
}