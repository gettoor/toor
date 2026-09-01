import { type RPECandidateGeneratorChange } from '@gettoor/core';
import { Separator } from './Separator';
import { Markdown } from '../basic';

export interface CandidateChangesProps {
  candidateId: string;
  changes: RPECandidateGeneratorChange[];
}

export function CandidateChanges(props: CandidateChangesProps) {
  const { candidateId, changes } = props;
  
  const renderChange = (
    index: number,
    change: RPECandidateGeneratorChange,
  ) => {
    const key = `${candidateId}c${index}`;
    return (
      <>
        { index > 0 && <Separator/> }
        <div key={key}>
          <h2>Change</h2>
          <div><Markdown content={change.description}/></div>
          <h2>Reasoning</h2>
          <div><Markdown content={change.reasoning}/></div>
        </div>
      </>
    );
  };

  const renderChanges = () => {
    return changes.map((change, index) => renderChange(index, change));
  };

  return (
    <div>
      {renderChanges()}
    </div>
  );
}