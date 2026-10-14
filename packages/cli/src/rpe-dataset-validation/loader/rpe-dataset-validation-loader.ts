import path, { dirname } from 'path';
import { ZodError } from 'zod';
import {
  ToorError,
  RPEDataset,
  RPEDatasetValidatorInput,
} from '@gettoor/core';
import { readRPEDatasetFromFile, RPEIOFormat } from '@gettoor/core/rpe-io';

import { FatalError } from '../../errors/index.js';
import { prettyZodError } from '../../zod/index.js';
import { resolvePath } from '../../io/index.js';
import { RPEDatasetValidationCfg } from '../cfg/index.js';

export function loadRPEDatasetValidation(
  cfg: RPEDatasetValidationCfg,
  cfgFilePath: string,
): RPEDatasetValidatorInput {
  const cfgDir = dirname(cfgFilePath);
  return {
    datasets: loadDatasets(cfg, cfgDir),
    additionalContext: cfg.additionalContext,
    modelName: cfg.modelName,
    embeddingsModelName: cfg.embeddingsModelName,
    modelParameters: cfg.modelParameters,
    expectedResponseDistributionImbalanceThreshold:
      cfg.expectedResponseDistributionImbalanceThreshold,
  };
}

function loadDatasets(
  cfg: RPEDatasetValidationCfg,
  cfgDir: string,
): Record<string, RPEDataset> {
  const datasets: Record<string, RPEDataset> = {};
  Object.entries(cfg.datasets).forEach(([name, dataset]) => {
    datasets[name] = loadDataset(dataset.file, cfgDir);
  });
  return datasets;
}

function loadDataset(
  filePath: string,
  cfgDir: string,
): RPEDataset {
  const fullFilePath = resolvePath(filePath, cfgDir);
  try {
    return readRPEDatasetFromFile(fullFilePath, resolveFormat(fullFilePath));
  } catch (error) {
    if (error instanceof ZodError) {
      throw new FatalError(
        `Invalid RPE dataset file ${ToorError.quote(filePath)}:\n` +
        `${prettyZodError(error)}`,
      );
    }
    throw error;
  }
}

function resolveFormat(filePath: string): RPEIOFormat {
  const suffix = path.extname(filePath);
  if (suffix === '.json') {
    return 'json';
  }
  if (suffix === '.yaml' || suffix === '.yml') {
    return 'yaml';
  }
  throw new FatalError(
    `Unsupported file extension for RPE dataset validation ` +
    `${ToorError.quote(suffix)}`
  );
}