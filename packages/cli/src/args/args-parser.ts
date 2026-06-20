import { parseArgs as nodeParseArgs } from 'node:util';

export type ArgsConfig = {
  name: string;
  description: string;
  options: Record<
    string,
    {
      type: 'string' | 'boolean';
      short?: string;
      required?: boolean;
      default?: string | boolean;
      description?: string;
    }
  >;
};

export function parseArgsByConfig(config: ArgsConfig): {
  values: { [name: string]: string | boolean | undefined; };
  positionals: string[];
} {
  const { values, positionals } = nodeParseArgs({
    options: config.options,
    allowPositionals: true,
    strict: true,
  });

  if (values.help) {
    printHelp(config);
    process.exit(0);
  }

  for (const [name, option] of Object.entries(config.options)) {
    if (option.required && values[name] == null) {
      console.error(
        `Missing required option --${name}. Try --help for more information.`
      );
      process.exit(1);
    }
  }

  

  return {
    values,
    positionals,
  };
}

function printHelp(config: ArgsConfig): void {
  const optionPadding = 20;
  const options = Object.entries(config.options)
    .map(([name, option]) => {
      const short = option.short ? `-${option.short}, ` : '    ';
      const type = option.type === 'string' ? ' <value>' : '';
      const optionStr = `${short}--${name}${type}`.padEnd(optionPadding);
      return `  ${optionStr}\t${option.description ?? ''}`;
    })
    .join('\n');

  console.log(`${config.name}: ${config.description}

Usage:
  ${config.name} [options] <config-file>

Options:
${options}`);
}