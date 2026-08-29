import { type RPEInsights } from '@gettoor/core';
import { PromptView } from './components/index.js';

export interface AppProps {
  rpeInsights: RPEInsights;
}

export function App(props: AppProps) {
  return (
    <main>
      <PromptView rpeInsights={props.rpeInsights}/>
    </main>
  );
}
