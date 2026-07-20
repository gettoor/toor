import { DistributionRange } from './distribution-types.js';

export function distribution(
  values: number[],
  rangeSize: number,
): DistributionRange[] {
  const ranges: DistributionRange[] = [];
  for (const value of values) {
    let found = false;
    for (const range of ranges) {
      if (value >= range.min && value <= range.max) {
        range.count++;
        found = true;
        break;
      }
    }
    if (!found) {
      const min = Math.floor(value / rangeSize) * rangeSize;
      const max = min + rangeSize;
      ranges.push({ min, max, count: 1 });
    }
  }
  return ranges;
}