#!/usr/bin/env node

import { ToorError } from '@gettoor/core';

import { Styles } from '@gettoor/core/console';
import { FatalError } from './errors/index.js';
import {
  Args,
  PROCESS_TYPES,
  ProcessType,
  isVerbose,
  parseArgs,
} from './args/index.js';
import {
  readExperimentCfg,
  loadExperiment,
  runExperiment,
} from './experimentation/index.js';
import {
  loadRPEDatasetValidation,
  readRPEDatasetValidationCfg,
  runRPEDatasetValidation,
} from './rpe-dataset-validation/index.js';

async function runExperimentCli(args: Args): Promise<void> {
  const cfgFile = readExperimentCfg(args.cfgFile);
  const experiment = loadExperiment(cfgFile, args.cfgFile);
  await runExperiment(experiment);
}

async function runRPEDatasetValidationCli(args: Args): Promise<void> {
  const cfg = readRPEDatasetValidationCfg(args.cfgFile);
  const input = loadRPEDatasetValidation(cfg, args.cfgFile);
  await runRPEDatasetValidation(input);
}

function resolveType(args: Args): ProcessType {
  for (const type of PROCESS_TYPES) {
    if (args.type === type) {
      return type;
    }
    if (args.cfgFile.includes(`.${type}.`)) {
      return type;
    }
  }

  throw new FatalError(
    `Use --type argument to specify the type of process to run. ` +
    `Try --help for more information.`
  );
}

async function run(): Promise<void> {
  const args = parseArgs();
  const type = resolveType(args);

  if (type === 'experiment') {
    await runExperimentCli(args);
    return;
  }

  if (type === 'rpe-dataset') {
    await runRPEDatasetValidationCli(args);
    return;
  }

  throw new FatalError(
    `Unknown process type ${ToorError.quote(args.type)}.`
  );
}

run().catch((error) => {
  const printError = (message: string) => {
    console.error(Styles.error(message));
  };

  if (error instanceof FatalError) {
    printError(error.message);
    process.exit(1);
  }
  if (error instanceof ToorError) {
    printError(error.message);
    process.exit(1);
  }
  printError(error.toString());
  if (isVerbose() && error instanceof Error) {
    const stack = error.stack;
    if (stack) {
      printError(Styles.muted(stack));
    }
  }
  process.exit(1);
});