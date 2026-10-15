import { Style, Styles } from './styles.js';

const DEFAULT_WIDTH = 64;

export interface SeparatorOptions {
  width?: number;
  style?: Style;
}

export function separator(
  options: SeparatorOptions = {},
): string {
  const maxWidth = Math.min(
    options.width ?? DEFAULT_WIDTH,
    process.stdout.columns ?? DEFAULT_WIDTH,
  );
  const style = options.style ?? Styles.reset;
  return style('─'.repeat(maxWidth));
}