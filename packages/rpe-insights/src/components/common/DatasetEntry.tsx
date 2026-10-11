import { RPEDatasetEntry } from '@gettoor/core';
import styles from './DatasetEntry.module.scss';

export interface DatasetEntryProps {
  datasetEntry: RPEDatasetEntry;
}

export function DatasetEntry(props: DatasetEntryProps) {
  const { datasetEntry } = props;

  const keys = Object.keys(datasetEntry.vars).sort();
  return (
    <>
      {keys.map(key => {
        const value = datasetEntry.vars![key];
        const valueString = typeof value === 'object'
          ? JSON.stringify(value)
          : value.toString();
        return (
          <div key={key}>
            <code
              className={styles['dataset-entry-key']}
            >
              {key}
            </code>
            &nbsp;{valueString}
          </div>
        );
      })}
    </>
  );
}