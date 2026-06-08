import { ToorError } from '@gettoor/engine';

import { FatalError } from './errors/index.js';
import { Args, parseArgs } from './args/index.js';
import { readExperimentCfg } from './cfg/index.js';
import { loadExperiment } from './experimentation/loader/index.js';
import { runExperiment } from './experimentation/runner/index.js';

async function runExperimentCli(args: Args): Promise<void> {
  const cfgFile = readExperimentCfg(args.cfgFile);
  const experiment = loadExperiment(cfgFile, args.cfgFile);
  await runExperiment(experiment);
}

async function run(): Promise<void> {
  const args = parseArgs();
  if (args.type === 'experiment') {
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