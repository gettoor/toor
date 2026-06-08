import { noStyle, Style } from './styles.js';

const DEFAULT_WIDTH = 64;

export interface SeparatorOptions {
  width?: number;
  color?: Style;
}

export function separator(
  options: SeparatorOptions = {},
): string {
  const maxWidth = Math.min(
    options.width ?? DEFAULT_WIDTH,
    process.stdout.columns ?? DEFAULT_WIDTH,
  );
  const style = options.color ?? noStyle;
  return style('─'.repeat(maxWidth));
}