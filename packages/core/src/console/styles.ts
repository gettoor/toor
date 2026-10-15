export type Style = (str: string) => string;

const GRAY = 37;
const DARK_GRAY = 90;
const BRIGHT_BLUE = 94;
const BRIGHT_GREEN = 92;
const BRIGHT_RED = 91;
const BRIGHT_YELLOW = 93;
const RESET = 0;
const BOLD = 1;
const UNDERLINE = 4;

function colorize(code: number): Style {
  return (text: string) => {
    return `\x1b[${code}m${text}\x1b[0m`;
  };
}

export const Styles = {
  info: colorize(GRAY),
  muted: colorize(DARK_GRAY),
  highlight: colorize(BRIGHT_YELLOW),
  progress: colorize(BRIGHT_BLUE),
  success: colorize(BRIGHT_GREEN),
  error: colorize(BRIGHT_RED),
  warning: colorize(BRIGHT_YELLOW),
  reset: colorize(RESET),
  underline: colorize(UNDERLINE),
  bold: colorize(BOLD),
};