import { ExperimentDatasetEntry } from '@gettoor/core';

import { loadFile } from '../../loader/index.js';
import { 
  ExperimentDatasetScheme,
  ExperimentDataset,
  ExperimentCfg,
} from '../../cfg/index.js';

export function loadExperimentDataset(
  cfg: ExperimentCfg['datasets'],
  cfgDir: string,
): ExperimentDatasetEntry[] {
  const entries: ExperimentDatasetEntry[] = [];
  for (const entryCfg of cfg) {
    if ('file' in entryCfg) {
      entries.push(...loadExperimentDatasetFromFile(entryCfg.file, cfgDir));
    } else {
      entries.push(entryCfg);
    }
  }
  return entries;
}

export function loadExperimentDatasetFromFile(
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