import { dirname } from 'path';
import {
  DefaultModelProvider,
  Experiment,
  ExperimentDatasetEntry,
  ExperimentModel,
  ExperimentModelParameters,
  ExperimentPrompt,
  ExperimentSettings,
} from '@gettoor/core';

import { FatalError } from '../../errors/index.js';
import { ExperimentCfg } from '../../cfg/index.js';
import { loadTextBySpec } from '../../loader/index.js';
import { loadOnlineDataset } from './dataset-loader.js';

export function loadExperiment(
  cfg: Omit<ExperimentCfg, 'listeners'>,
  cfgFilePath: string,
): Experiment {
  const cfgDir = dirname(cfgFilePath);
  return {
    settings: loadSettings(cfg),
    models: loadModels(cfg),
    modelProvider: new DefaultModelProvider(),
    modelParameters: loadModelParameters(cfg),
    prompts: loadPrompts(cfg, cfgDir),
    dataset: loadDatasets(cfg, cfgDir),
  };
}

function loadSettings(cfg: ExperimentCfg): ExperimentSettings {
  return {
    type: cfg.evaluation.type,
    modelName: cfg.evaluation.model,
  };
}

function loadModelParameters(
  cfg: ExperimentCfg,
): ExperimentModelParameters[] {
  return cfg['model-parameters'].map(parameter => ({
    name: parameter.name,
    temperature: parameter.temperature,
  }));
}

function loadModels(cfg: ExperimentCfg): ExperimentModel[] {
  return cfg.models.map(model => ({
    name: model.model,
  }));
}

function loadPrompts(
  cfg: ExperimentCfg,
  cfgDir: string,
): ExperimentPrompt[] {
  return cfg.prompts.map(prompt => {
    return {
      name: prompt.name,
      prompt: loadTextBySpec(prompt.prompt, cfgDir),
    }
  });
}

function loadDatasets(
  cfg: ExperimentCfg,
  cfgDir: string,
): ExperimentDatasetEntry[] {
  const entries: ExperimentDatasetEntry[] = [];

  for (const cfgDataset of cfg.datasets) {
    // load the dataset
    const dataset = loadOnlineDataset(cfgDataset.file, cfgDir);

    // check for duplicates
    const duplicates = entries.filter(dataset => dataset.name === dataset.name);
    if (duplicates.length > 0) {
      const duplicateNames = duplicates
        .map(duplicate => duplicate.name)
        .join(', ');
      throw new FatalError(`Dataset names "${duplicateNames}" are not unique`);
    }

    // add the dataset to the list
    entries.push(...dataset);
  }

  return entries;
}