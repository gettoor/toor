import { type RPEAnalyzerOutput } from '@gettoor/core';
import styles from './CandidateAnalysis.module.scss';

export interface CandidateAnalysisProps {
  analysis: RPEAnalyzerOutput;
}

export function CandidateAnalysis(props: CandidateAnalysisProps) {
  const renderList = (list: string[]) => {
    return (
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className={styles['candidate-analysis']}>
      <h2>Strengths</h2>
      {renderList(props.analysis.strengths)}
      <h2>Weaknesses</h2>
      {renderList(props.analysis.weaknesses)}
      <h2>Recommendations</h2>
      {renderList(props.analysis.recommendations)}
      <h2>Failure Patterns</h2>
      {renderList(props.analysis.failurePatterns)}
    </div>
  );
}