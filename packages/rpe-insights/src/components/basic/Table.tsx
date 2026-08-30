import type { VNode } from 'preact';
import clsx from 'clsx';

import styles from './Table.module.scss';

export type Cell = string | number | boolean | null | undefined | VNode;

export interface TableProps {
  header?: Cell[];
  rows: Cell[][];
}

export function Table(props: TableProps) {
  const { header = [], rows } = props;

  const renderHeaderCells = () => {
    return header.map((cell, columnIndex) => {
      const className = clsx(styles['cell'], styles['header-cell']);
      const style = {
        gridColumn: columnIndex + 1,
        gridRow: 1,
      };
      return <div className={className} style={style}>{cell}</div>;
    });
  };

  const renderRowCells = (row: Cell[], rowIndex: number) => {
    return row.map((cell, columnIndex) => {
      const style = {
        gridColumn: columnIndex + 1,
        gridRow: rowIndex + 2,
      };

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
        value = cell;
      }
      return <div className={styles['cell']} style={style}>{value}</div>;
  });
  };
  
  const renderRows = () => {
    return rows.map((row, rowIndex) => renderRowCells(row, rowIndex));
  };

  return (
    <div className={styles.table}>
      {renderHeaderCells()}
      {renderRows()}
    </div>
  );
}