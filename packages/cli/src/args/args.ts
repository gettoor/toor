import { Args, PROCESS_TYPES, ProcessType } from './args-types.js';
import { ArgsConfig, parseArgsByConfig } from './args-parser.js';

let verbose = false;

export const argsConfig: ArgsConfig = {
  name: 'toor',
  description: 'CLI for Toor to evaluate models on datasets',
  options: {
    help: {
      type: 'boolean',
      short: 'h',
      description: 'Show help',
    },
    verbose: {
      type: 'boolean',
      short: 'v',
      description: 'Verbose output',
    },
    type: {
      type: 'string',
      description:
        `The type of process to run. ` +
        `One of: ${PROCESS_TYPES.join(', ')}`,
    }
  },
}

export function parseArgs(): Args {
  const args = parseArgsByConfig(argsConfig);

  if (args.positionals.length === 0) {
    console.error(
      `Missing required argument <config-file>. ` +
      `Try --help for more information.`
    );
    process.exit(1);
  }
  if (args.positionals.length > 1) {
    console.error(
      `Only one <config-file> is allowed. ` +
      `Try --help for more information.`
    );
    process.exit(1);
  }

  if (
    args.values.type &&
    !PROCESS_TYPES.includes(args.values.type as ProcessType)
  ) {
    console.error(
      `Invalid evaluation type "${args.values.type}". ` +
      `Try --help for more information.`
    );
    process.exit(1);
  }

  verbose = !!args.values.verbose;

  return {
    cfgFile: args.positionals[0],
    verbose,
    type: args.values.type as ProcessType,
  }
}

export function isVerbose(): boolean {
  return verbose;
}
