import { 
  type RPEDatasetEntry,
  type RPEAnalyzerOutput,
  type RPEAnalyzerFailedExampleAnalysis,
} from '@gettoor/core';
import styles from './CandidateAnalysis.module.scss';

export interface CandidateAnalysisProps {
  datasetEntries: RPEDatasetEntry[];
  analysis: RPEAnalyzerOutput;
}

export function CandidateAnalysis(props: CandidateAnalysisProps) {
  const { datasetEntries, analysis } = props;

  const renderList = (list: string[]) => {
    return (
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderFailedExampleAnalysis = (
    failedExampleAnalysis: RPEAnalyzerFailedExampleAnalysis
  ) => {
    const datasetEntry = props.datasetEntries.find(itr => {
      return itr.datasetEntryId === failedExampleAnalysis.datasetEntryId;
    })!;
    const varNames = Object.keys(datasetEntry.vars ?? {}).sort();
    return (
      <p>
        <ul>
          <li>
            <b>Dataset entry: </b>
            <span>{datasetEntry.datasetEntryId}</span>
          </li>
          {varNames.length > 0 &&
            <li>
              <b>Variables: </b>
            </li>  
          }
        </ul>
      </p>
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
      <h2>Failed example analysis</h2>
      {failedExampleAnalysis.map(item => renderFailedExampleAnalysis(item))}
    </div>
  );
}