import { type RPEInsights } from '@gettoor/core';
import { ProcessView } from './components/index.js';

export interface AppProps {
  rpeInsights: RPEInsights;
}

export function App(props: AppProps) {
  return (
    <main>
      <ProcessView rpeInsights={props.rpeInsights}/>
    </main>
  );
}
