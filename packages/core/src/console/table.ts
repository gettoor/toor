import { separator } from './separator.js';
import { Style, Styles } from './styles.js';

export type TableCell = {
  value: string;
  style?: Style;
} | string;

export function printTable(table: TableCell[][]): void {
  const SPACER = '   ';

  const cellValue = (cell: TableCell): string => {
    if (typeof cell === 'string') {
      return cell;
    }
    return cell.value;
  };

  const cellStyle = (cell: TableCell): Style | undefined => {
    if (typeof cell === 'string') {
      return undefined;
    }
    return cell.style;
  };

  const maxWidths = table[0].map((_, index) => {
    return Math.max(...table.map((row) => cellValue(row[index]).length));
  });

  const printRow = (cells: TableCell[]): void => {
    const row = cells
      .map((cell, index) => {
        const style = cellStyle(cell) ?? Styles.reset;
        return style(cellValue(cell).padEnd(maxWidths[index]));
      })
      .join(SPACER);
    console.log(row)
  };

  // header
  printRow(table[0]);
  const headerWidth =
    maxWidths.reduce((acc, width) => acc + width, 0) +
    SPACER.length * (maxWidths.length - 1);
  console.log(separator({ width: headerWidth, style: Styles.muted }));

  // body
  for (const row of table.slice(1)) {
    printRow(row);
  }
}