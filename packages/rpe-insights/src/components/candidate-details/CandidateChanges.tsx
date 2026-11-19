import { type RPECandidateGeneratorChange } from '@gettoor/core';
import { Markdown, Separator } from '../basic';

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
          <p className='text-muted'>{ change.description}</p>
          <h2>Reasoning</h2>
          <p className='text-muted'>{ change.reasoning}</p>
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