import { Style, Styles } from './styles.js';

export interface SpinnerOptions {
  prefix?: string;
  style?: Style;
}

export interface Spinner {
  start: (
    message: string,
    options?: SpinnerOptions,
  ) => void;
  stop: () => void;
}

export function newSpinner(): Spinner {
  const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let current = 0;
  let interval: NodeJS.Timeout;

  let line = '';
  const clearLine = () => {
    process.stdout.write('\r' + ' '.repeat(line.length) + '\r');
    line = '';
  };

  return {
    start: (
      message: string,
      options?: SpinnerOptions,
    ) => {
      const prefix = options?.prefix ?? '';
      const style = options?.style ?? Styles.progress;
      current = 0;
      interval = setInterval(() => {
        current = (current + 1) % characters.length;
        clearLine();
        line = `${prefix}${style(characters[current])} ${message}`;
        process.stdout.write(line);
      }, 96);
    },
    stop: () => {
      clearInterval(interval);
      clearLine();
    },
  };
}