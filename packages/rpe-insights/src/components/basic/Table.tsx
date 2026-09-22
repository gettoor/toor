import type { VNode } from 'preact';
import clsx from 'clsx';

import styles from './Table.module.scss';

export type BasicCell = string | number | boolean | null | undefined | VNode;

export type TableColumnStyle = 'narrow' | 'narrow-left';

export type Cell = BasicCell | {
  value: BasicCell;
  className?: string;
}

export interface TableProps {
  header?: Cell[];
  rows: Cell[][];
  columnStyles?: TableColumnStyle[];
  templateColumns?: string;
}

export function Table(props: TableProps) {
  const { header = [], rows, columnStyles = [], templateColumns } = props;

  const columnCount = header.length || rows?.[0]?.length || 0;
  const defaultTemplateColumns = `repeat(${columnCount}, 1fr)`;

  const getColumnClassName = (columnIndex: number) => {
    const style = columnStyles?.[columnIndex] ?? '';
    return style ? styles[`cell-${style}`] : undefined;
  };

  const renderHeaderCells = () => {
    return header.map((cell, columnIndex) => {
      const className = clsx(
        styles['cell'],
        styles['header-cell'],
        getColumnClassName(columnIndex),
      );
      const style = {
        gridColumn: columnIndex + 1,
        gridRow: 1,
      };
      return <div className={className} style={style}>{cell}</div>;
    });
  };

  const basicCellToValue = (cell: BasicCell): string | VNode => {
    let value: string | VNode = '';
    if (typeof cell === 'string') {
      value = cell;
    } else if (typeof cell === 'number') {
      value = cell.toString();
    } else if (typeof cell === 'boolean') {
      value = cell ? 'Yes' : 'No';
    } else if (cell === null) {
      value = '';
    } else if (cell === undefined) {
      value = '';
    } else if (typeof cell === 'object' && 'props' in cell) {
      value = cell; // VNode
    }
    return value;
  }

  const renderRowCells = (row: Cell[], rowIndex: number) => {
    return row.map((cell, columnIndex) => {
      const style = {
        gridColumn: columnIndex + 1,
        gridRow: rowIndex + 2,
      };

      let value: string | VNode = '';
      let cellClassNames: (string | undefined)[] = [
        getColumnClassName(columnIndex)
      ];

      if (!cell) {
        value = '';
      } else if (typeof cell === 'object' && 'value' in cell) {
        value = basicCellToValue(cell.value);
        cellClassNames.push(cell.className);
      } else {
        value = basicCellToValue(cell);
      }

      return (
        <div
          className={clsx(styles['cell'], ...cellClassNames)}
          style={style}
        >
          {value}
        </div>
      );
  });
  };
  
  const renderRows = () => {
    return rows.map((row, rowIndex) => renderRowCells(row, rowIndex));
  };

  return (
    <div
      className={styles.table}
      style={{
        gridTemplateColumns: templateColumns ?? defaultTemplateColumns,
      }}
    >
      {renderHeaderCells()}
      {renderRows()}
    </div>
  );
}