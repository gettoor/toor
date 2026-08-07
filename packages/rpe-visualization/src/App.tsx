import { PromptTree } from './components/index.js';
import { iterations } from './data.js';

export function App() {
  return (
    <main>
      <h1>RPE Visualization</h1>
      <ul>
        {iterations.map(iteration => (
          <li key={iteration.iterationNo}>
            Iteration #{iteration.iterationNo} — {iteration.promptCount} prompt(s),{' '}
            {iteration.candidateCount} candidate(s)
          </li>
        ))}
      </ul>
      <PromptTree/>
    </main>
  );
}
