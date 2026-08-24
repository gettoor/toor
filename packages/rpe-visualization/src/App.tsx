import { RPEState } from '@gettoor/core';
import { PromptView } from './components/index.js';

export interface AppProps {
  rpeState: RPEState;
}

export function App(props: AppProps) {
  const { rpeState } = props;
  return (
    <main>
      <PromptView 
        prompts={rpeState.prompts}
        iterations={rpeState.iterationHistory}
      />
    </main>
  );
}
