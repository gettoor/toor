export interface IterationSummary {
  iterationNo: number;
  promptCount: number;
  candidateCount: number;
}

export const iterations: IterationSummary[] = [
  { iterationNo: 1, promptCount: 1, candidateCount: 1 },
  { iterationNo: 2, promptCount: 1, candidateCount: 1 },
];
