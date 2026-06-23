import { dirname } from 'path';
import {
  binaryEvaluator,
  DefaultModelProvider,
  Experiment,
  ExperimentDatasetEntry,
  ExperimentEvaluator,
  ExperimentModel,
  ExperimentModelParameters,
  ExperimentPrompt,
  ExperimentSettings,
  SCALAR_SCORING_1_10,
  SCALAR_SCORING_1_3,
  SCALAR_SCORING_1_5,
  scalarEvaluator,
} from '@gettoor/core';

import { FatalError } from '../../errors/index.js';
import { ExperimentCfg } from '../../cfg/index.js';
import { loadTextBySpec } from '../../loader/index.js';
import { loadExperimentDataset, loadExperimentDatasetFromFile } from './dataset-loader.js';

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
  const commonInput = {
    modelName: cfg.evaluation.model,
    modelProvider: new DefaultModelProvider(),
    ...(cfg.evaluation.prompt
      ? { evalPrompt: cfg.evaluation.prompt }
      : {}
    ),
  };

  let evaluator: ExperimentEvaluator;
  switch (cfg.evaluation.type) {
    case 'binary':
      evaluator = binaryEvaluator({
        ...commonInput,
      });
      break;
    case '1-3':
      evaluator = scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_3,
        ...commonInput,
      });
      break;
    case '1-5':
      evaluator = scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_5,
        ...commonInput,
      });
      break;
    case '1-10':
      evaluator = scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_10,
        ...commonInput,
      });
      break;
    default:
      throw new FatalError(`Unknown evaluation type: ${cfg.evaluation.type}`);
  }

  return { evaluator };
}

function loadModelParameters(
  cfg: ExperimentCfg,
): ExperimentModelParameters[] {
  return cfg['model-parameters'].map(parameter => ({
    name: parameter.name,
    maxOutputTokens: parameter.maxOutputTokens,
    temperature: parameter.temperature,
    topP: parameter.topP,
    topK: parameter.topK,
    presencePenalty: parameter.presencePenalty,
    frequencyPenalty: parameter.frequencyPenalty,
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
  // load
  const entries = loadExperimentDataset(cfg.dataset, cfgDir);

  // check for duplicates
  const nameCounts = entries.reduce<Record<string, number>>(
    (acc, entry) => {
      acc[entry.name] = (acc[entry.name] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const duplicates = Object.entries(nameCounts)
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);
  if (duplicates.length > 0) {
    const duplicateNames = duplicates.join(', ');
    throw new FatalError(`Duplicated dataset names: "${duplicateNames}"`);
  }

  return entries;
}