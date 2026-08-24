import { clsx } from 'clsx';
import { useState } from 'preact/hooks';
import { 
  RPEPrompt,
  RPEAggregatorOutput,
  RPEAnalyzerOutput,
  RPEPromptGeneratorChange,
} from '@gettoor/core';

import { IconButton } from '../basic';
import { Header } from './Header';
import { PromptAggregatedEvaluation } from './PromptAggregatedEvaluation';
import { PromptAnalysis } from './PromptAnalysis';
import { PromptChanges } from './PromptChanges';
import styles from './PromptDetails.module.scss';

export interface PromptDetailsData {
  prompt: RPEPrompt;
  promptChanges?: RPEPromptGeneratorChange[];
  aggregatedEvaluation: RPEAggregatorOutput;
  analysis?: RPEAnalyzerOutput;
}

export interface PromptDetailsProps {
  data?: PromptDetailsData;
  visible: boolean;
  overlayVisible?: boolean;
  onOverlayClick: () => void;
}

export function PromptDetails(props: PromptDetailsProps) {
  const { data, visible, overlayVisible = false } = props;
  const hasData = !!data;

  const [promptExpanded, setPromptExpanded] = useState(false);

  const onPromptExpandClick = () => {
    console.log('onPromptExpandClick');
    setPromptExpanded(!promptExpanded);
  };

  const boxClassName = clsx(
    styles['prompt-details-box'],
    {
      [styles.visible]: visible,
      [styles.hidden]: !visible,
    },
  );
  const overlayClassName = clsx(
    styles['prompt-details-overlay'], {
      [styles.visible]: visible,
      [styles.hidden]: !visible,
    },
  );
  const promptClassName = clsx(
    styles['prompt-details-prompt'], {
      [styles['prompt-details-prompt-expanded']]: promptExpanded,
    },
  );
  const expandIconName = promptExpanded ? 'unfold_less' : 'unfold_more';

  return (
    <>
      { overlayVisible &&
        <div
          className={overlayClassName}
          onClick={props.onOverlayClick}
        />
      }
      <div className={boxClassName}>
        { hasData &&
          <>
            <Header title='Prompt'>
              <IconButton
                name={expandIconName}
                title='Expand/collapse prompt'
                onClick={onPromptExpandClick}
              />
            </Header>
            <pre className={promptClassName}>
              {data?.prompt.prompt}
            </pre>
            { data?.promptChanges &&
              <>
                <Header title='Prompt Changes'/>
                <PromptChanges 
                  promptId={data!.prompt.promptId}
                  changes={data!.promptChanges}
                />
              </>
            }
            <Header title='Evaluations'/>
            <PromptAggregatedEvaluation
              aggregatedEvaluation={data!.aggregatedEvaluation}
            />
            { data!.analysis &&
              <>
                <Header title='Analysis'/>
                <PromptAnalysis analysis={data!.analysis}/>
              </>
            }
          </>
        }
      </div>
    </>
  );
}