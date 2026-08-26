import { RPEInsights } from '@gettoor/core';
import { PromptView } from './components/index.js';

export interface AppProps {
  rpeInsights: RPEInsights;
}

export function App(props: AppProps) {
  const { rpeInsights } = props;
  return (
    <main>
      <PromptView 
        prompts={rpeInsights.prompts}
        iterations={rpeInsights.iterationHistory}
      />
    </main>
  );
}
