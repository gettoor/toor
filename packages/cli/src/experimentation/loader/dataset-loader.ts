import { ExperimentDatasetEntry } from '@gettoor/engine';

import { loadFile } from '../../loader/index.js';
import { ExperimentDataset, ExperimentDatasetScheme } from './dataset-types.js';

export function loadOnlineDataset(
  filePath: string,
  cfgDir: string,
): ExperimentDatasetEntry[] {
  const entries = loadFile<ExperimentDataset>(
    filePath,
    cfgDir,
    ExperimentDatasetScheme,
  );
  return entries.map(entry => ({
    name: entry.name,
    vars: entry.vars,
  }));
}