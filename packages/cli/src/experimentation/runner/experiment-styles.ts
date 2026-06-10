import { ExperimentScore } from '@gettoor/core';
import { red, yellow, green, Style } from '../../console/index.js';

export function colorForScore(score: ExperimentScore): Style {
  return colorForNormalizedScore(score.normalizedScore);
}

export function colorForNormalizedScore(normalizedScore: number): Style {
  if (normalizedScore <= 0.33) {
    return red;
  }
  if (normalizedScore <= 0.66) {
    return yellow;
  }
  return green;
}