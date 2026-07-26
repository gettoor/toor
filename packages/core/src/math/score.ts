import { DistributionRange } from './distribution-types.js';

export function distributeScores(
  scores: number[],
  rangeSize: number,
): DistributionRange[] {
  const ranges: DistributionRange[] = [];

  let min = 0;
  while (min < 1) {
    const max = min + rangeSize;
    ranges.push({ min, max, count: 0 });
    min = max;
  }
  const max = ranges[ranges.length - 1].max;

  for (const score of scores) {
    for (const range of ranges) {
      if (score >= max) {
        ranges[ranges.length - 1].count++;
        break;
      }
      if (score >= range.min && score < range.max) {
        range.count++;
        break;
      }
    }
  }

  return ranges;
}