import { ToorError } from '@gettoor/core';

import { FatalError } from './errors/index.js';
import { Args, ProcessType, parseArgs } from './args/index.js';
import { readExperimentCfg } from './cfg/index.js';
import { loadExperiment } from './experimentation/loader/index.js';
import { runExperiment } from './experimentation/runner/index.js';

async function runExperimentCli(args: Args): Promise<void> {
  const cfgFile = readExperimentCfg(args.cfgFile);
  const experiment = loadExperiment(cfgFile, args.cfgFile);
  await runExperiment(experiment);
}

function resolveType(args: Args): ProcessType {
  if (args.type === 'experiment') {
    return 'experiment';
  }
  if (args.cfgFile.includes('experiment')) {
    return 'experiment';
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
  throw new FatalError(
    `Evaluation ${ToorError.quote(args.type)} not yet implemented.`
  );
}

run().catch((error) => {
  if (error instanceof FatalError) {
    console.error(error.message);
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});