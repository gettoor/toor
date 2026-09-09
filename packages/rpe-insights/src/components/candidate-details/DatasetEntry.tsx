import * as YAML from 'yaml';
import { type RPEResponse, type RPEDatasetEntry } from '@gettoor/core';

import { Markdown } from '../basic';
import styles from './DatasetEntry.module.scss';

export interface DatasetEntryProps {
  datasetEntry: RPEDatasetEntry;
}

export function DatasetEntry(props: DatasetEntryProps) {
  const { datasetEntry } = props;

  const responseToString = (response: RPEResponse) => {
    if (typeof response === 'string') {
      return response;
    }
    return YAML.stringify(response);
  };

  const renderVariables = () => {
    if (datasetEntry.vars == undefined) {
      return;
    }
    const keys = Object.keys(datasetEntry.vars).sort();
    return (
      <p>
        {keys.map(key => {
          const value = datasetEntry.vars![key];
          const valueString = typeof value === 'object'
            ? JSON.stringify(value)
            : value.toString();
          return (
            <div key={key}>
              <code className={styles['dataset-entry-key']}>{key}</code>
              &nbsp;{valueString}
            </div>
          );
        })}
      </p>
    );
  };

  return (
    <>
      <h2>Dataset entry ({datasetEntry.datasetEntryId})</h2>
      {renderVariables()}
      { datasetEntry.expectedResponse &&
        <>
          <h2>Expected response</h2>
          <p>
            <Markdown
              content={responseToString(datasetEntry.expectedResponse)}
            />
          </p>      
        </>
      }
      { datasetEntry.expectedResponseReasoning &&
        <>
          <h2>Expected response reasoning</h2>
          <p>
            {datasetEntry.expectedResponseReasoning}
          </p>
        </>
      }
    </>
  );
}