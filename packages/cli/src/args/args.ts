import { Args, EVALUATION_TYPES, EvaluationType } from './args-types.js';
import { ArgsConfig, parseArgsByConfig } from './args-parser.js';

export const argsConfig: ArgsConfig = {
  name: 'toor',
  description: 'CLI for Toor to evaluate models on datasets',
  options: {
    help: {
      type: 'boolean',
      short: 'h',
      description: 'Show help',
    },
    cfg: { 
      type: 'string',
      description: 'The path to the configuration file',
      required: true,
    },
    type: {
      type: 'string',
      description:
        `The type of evaluation to perform. ` +
        `One of: ${EVALUATION_TYPES.join(', ')}`,
      required: true,
    }
  },
}

export function parseArgs(): Args {
  const args = parseArgsByConfig(argsConfig);

  if (!EVALUATION_TYPES.includes(args.values.type as EvaluationType)) {
    console.error(
      `Invalid evaluation type "${args.values.type}". ` +
      `Try --help for more information.`
    );
    process.exit(1);
  }

  return {
    cfgFile: args.values.cfg as string,
    type: args.values.type as EvaluationType,
  }
}