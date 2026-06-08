import { blue, dim, reset, Style } from './styles.js';

export interface PropertyOptions {
  nameColor?: Style;
  valueColor?: Style;
  nameWidth?: number;
}

export interface Section {
  property: (name: string, value: string, options?: PropertyOptions) => void;
  getValuePrefix: () => string;
}

export function newSection(): Section {
  const bar = blue('│') + ' ';
  const defaultNameWidth = 16;
  const valuePrefix = bar + ' '.repeat(defaultNameWidth);

  return {
    property: (
      name: string,
      value: string,
      options: PropertyOptions = {},
    ) => {
      const nameWidth = options.nameWidth ?? defaultNameWidth;
      const nameColor = options.nameColor ?? dim;
      process.stdout.write(bar + nameColor((name + ': ').padStart(nameWidth)));

      // determine width available for value
      const width = process.stdout.columns || 80;
      const start = bar.length + nameWidth;
      const max = Math.max(32, width - start);

      // split value by words for wrapping
      const words = value.split(' ');
      let currentLine = '';
      const lines: string[] = [];
  
      // split into lines
      words.forEach((word) => {
        if (
          (currentLine.length > 0 && (currentLine + ' ' + word).length > max) ||
          (currentLine.length === 0 && word.length > max)
        ) {
          // push current line and start new
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += (currentLine.length ? ' ' : '') + word;
        }
      });
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      // print lines
      const valueColor = options.valueColor ?? reset;
      lines.forEach((line, idx) => {
        if (idx === 0) {
          process.stdout.write(valueColor(line) + '\n');
        } else {
          process.stdout.write(bar + ' '.repeat(nameWidth) + valueColor(line) + '\n');
        }
      });
    },

    getValuePrefix: () => {
      return valuePrefix;
    }
  }
}