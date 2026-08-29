import type { VNode } from 'preact';
import clsx from 'clsx';

import styles from './Table.module.scss';

export type Cell = string | VNode;

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
      return <div className={styles['cell']} style={style}>{cell}</div>;
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