import { separator } from './separator.js';
import { dim, noStyle, Style } from './styles.js';

export interface TableCell {
  value: string;
  style?: Style;
}

export function printTable(table: TableCell[][]): void {
  const SPACER = '   ';

  const maxWidths = table[0].map((_, index) => {
    return Math.max(...table.map((row) => row[index].value.length));
  });

  const printRow = (cells: TableCell[]): void => {
    const row = cells
      .map((cell, index) => {
        const style = cell.style ?? noStyle;
        return style(cell.value.padEnd(maxWidths[index]));
      })
      .join(SPACER);
    console.log(row)
  };

  // header
  printRow(table[0]);
  const headerWidth =
    maxWidths.reduce((acc, width) => acc + width, 0) +
    SPACER.length * (maxWidths.length - 1);
  console.log(separator({ width: headerWidth, color: dim }));

  // body
  for (const row of table.slice(1)) {
    printRow(row);
  }
}