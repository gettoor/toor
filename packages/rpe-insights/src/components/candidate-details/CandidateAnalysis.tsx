import { 
  type RPEDatasetEntry,
  type RPEAnalyzerOutput,
  type RPEAnalyzerFailedExampleAnalysis,
} from '@gettoor/core';

import { countLabel } from '../../string';
import { useLocalStorage } from '../../hooks';
import {
  ExpandableSection,
  ExpandableList,
  LinkButton,
  MiddotSeparator,
  Separator,
} from '../basic';
import { DatasetEntry } from './DatasetEntry';
import styles from './CandidateAnalysis.module.scss';

export interface CandidateAnalysisProps {
  datasetEntries: RPEDatasetEntry[];
  analysis: RPEAnalyzerOutput;
}

export function CandidateAnalysis(props: CandidateAnalysisProps) {
  const { datasetEntries, analysis } = props;

  const [
    more,
    setMore,
  ] = useLocalStorage(false, 'moreCandidateAnalysis');

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

  const renderSummary = () => {
    return (
      <span className={styles['candidate-analysis-summary']}>
        <span>
          {countLabel(analysis.strengths.length, 'strength')}
          <MiddotSeparator/>
        </span>
        <span>
          {countLabel(analysis.recommendations.length, 'recommendation')}
          <MiddotSeparator/>
        </span>
        <span className='red'>
          {countLabel(analysis.failedExampleAnalysis.length, 'failed example')}
          <MiddotSeparator/>
        </span>
      </span>
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

  const renderFailedExampleAnalysisItem = (index: number) => {
    const failedExampleAnalysis = analysis.failedExampleAnalysis[index];
    return renderFailedExampleAnalysis(failedExampleAnalysis);
  };


  return (
    <ExpandableSection
      title='Training Analysis'
      expanded={more}
      onToggle={() => { setMore(!more); }}
    >
      <ExpandableSection.Summary>
        { renderSummary() }
        <LinkButton
          label='More'
          onClick={() => { setMore(true); }}
        />
      </ExpandableSection.Summary>
      <ExpandableSection.Details>
        <div className={styles['candidate-analysis']}>
          { renderSummary() }
          <LinkButton
            label='Less'
            onClick={() => { setMore(false); }}
          />          
          { analysis.strengths.length > 0 &&
            <>
              <h2>Strengths</h2>
              {renderList(analysis.strengths)}
            </>
          }
          { analysis.recommendations.length > 0 &&
            <>
              <h2>Recommendations</h2>
              {renderList(analysis.recommendations)}
            </>
          }
          { failedExampleAnalysis.length > 0 &&
            <>
              <h1>Failed example analysis</h1>
              <ExpandableList
                totalItems={failedExampleAnalysis.length}
                itemRenderer={renderFailedExampleAnalysisItem}
              />
            </>
          }
        </div>
      </ExpandableSection.Details>
    </ExpandableSection>

  );
}