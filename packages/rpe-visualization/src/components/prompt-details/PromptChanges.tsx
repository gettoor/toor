import { RPEPromptGeneratorChange } from '@gettoor/core';
import { Separator } from './Separator';
import { Markdown } from '../basic';

export interface PromptChangesProps {
  promptId: string;
  changes: RPEPromptGeneratorChange[];
}

export function PromptChanges(props: PromptChangesProps) {
  const { promptId, changes } = props;
  
  const renderChange = (
    index: number,
    change: RPEPromptGeneratorChange,
  ) => {
    const key = `${promptId}c${index}`;
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