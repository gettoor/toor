export function dim(text: string): string {
  return `\x1b[90m${text}\x1b[0m`;
}

export function red(text: string): string {
  return `\x1b[31m${text}\x1b[0m`;
}

export function green(text: string): string {
  return `\x1b[32m${text}\x1b[0m`;
}

export function table(headers: string[], rows: string[][]): void {
  const SPACER = '   ';

  const maxWidths = headers.map((_, index) => {
    return Math.max(
      ...rows.map((row) => row[index].length),
      headers[index].length,
    );
  });
  const width = maxWidths.reduce((acc, width) => acc + width + SPACER.length, 0);

  const printRow = (cells: string[]): void => {
    console.log(cells.map((cell, index) => {
      return cell.padEnd(maxWidths[index]);
    }).join(SPACER));
  };

  printRow(headers);
  console.log(dim('─'.repeat(width)));
  rows.forEach((row) => {
    printRow(row);
  });
}