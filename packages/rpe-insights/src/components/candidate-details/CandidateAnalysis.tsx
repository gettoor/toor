import { 
  type RPEDatasetEntry,
  type RPEAnalyzerOutput,
  type RPEAnalyzerFailedExampleAnalysis,
} from '@gettoor/core';

import { Separator } from '../basic';
import { DatasetEntry } from './DatasetEntry';
import styles from './CandidateAnalysis.module.scss';

export interface CandidateAnalysisProps {
  datasetEntries: RPEDatasetEntry[];
  analysis: RPEAnalyzerOutput;
}

export function CandidateAnalysis(props: CandidateAnalysisProps) {
  const { datasetEntries, analysis } = props;

  const renderList = (list: string[]) => {
    return (
      <p>
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </p>
    );
  };


  const renderFailedExampleAnalysis = (
    failedExampleAnalysis: RPEAnalyzerFailedExampleAnalysis
  ) => {
    const datasetEntry = props.datasetEntries.find(itr => {
      return itr.datasetEntryId === failedExampleAnalysis.datasetEntryId;
    })!;
    const regressionRisks = failedExampleAnalysis.regressionRisks;
    return (
      <>
        <Separator/>
        <DatasetEntry datasetEntry={datasetEntry}/>
        <h2>Response</h2>
        <p>{failedExampleAnalysis.response}</p>
        <h2>Failure reason</h2>
        <p>{failedExampleAnalysis.failureReason}</p>
        <h2>Plausible cause</h2>
        <p>{failedExampleAnalysis.plausibleCause}</p>
        <h2>Missing conceptual distinction</h2>
        <p>{failedExampleAnalysis.missingConceptualDistinction}</p>
        <h2>General rule</h2>
        <p>{failedExampleAnalysis.generalRule}</p>
        { regressionRisks.length > 0 &&
          <>
            <h2>Regression risks</h2>
            {renderList(regressionRisks)}
          </>
        }
      </>
    );
  };

  const failedExampleAnalysis = analysis.failedExampleAnalysis
    .filter(itr => {
      return datasetEntries.some(entry => {
        return entry.datasetEntryId === itr.datasetEntryId;
      });
    });


  return (
    <div className={styles['candidate-analysis']}>
      <h2>Strengths</h2>
      {renderList(analysis.strengths)}
      <h2>Recommendations</h2>
      {renderList(analysis.recommendations)}
      <h1>Failed example analysis</h1>
      {failedExampleAnalysis.map(item => renderFailedExampleAnalysis(item))}
    </div>
  );
}