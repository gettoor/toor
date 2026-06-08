/**
 * Type for an evaluator function.
 * @param datasetEntry - The dataset entry to evaluate.
 * @param index - The index of the dataset entry.
 * @returns The result of the evaluation.
 */
export type Evaluator<TDatasetEntry, TResult> = (
  datasetEntry: TDatasetEntry,
  index: number,
) => Promise<TResult>;

/**
 * Type for an evaluation input.
 * @param TDatasetEntry - The type of the dataset entry.
 * @param TEvaluatorResult - The type of the evaluator result.
 * @param TFinalScore - The type of the final score.
 */
export interface EvaluationInput<
  TDatasetEntry,
  TEvaluatorResult,
  TFinalScore,
> {
  // evaluator function
  evaluator: Evaluator<TDatasetEntry, TEvaluatorResult>;

  // dataset to evaluate
  dataset: TDatasetEntry[];

  // score function
  score: (outputs: TEvaluatorResult[]) => Promise<TFinalScore>;

  // callback function to call when the evaluator starts
  onEvaluatorStart?: (
    datasetEntry: TDatasetEntry,
    index: number,
  ) => Promise<void>;

  // callback function to call when the evaluator ends
  onEvaluatorEnd?: (
    datasetEntry: TDatasetEntry,
    index: number,
    output: TEvaluatorResult,
  ) => Promise<void>;
}

/**
 * Type for an evaluation output.
 * @param TEvaluatorResult - The type of the evaluator result.
 * @param TFinalScore - The type of the final score.
 */
export interface EvaluationOutput<
  TEvaluatorResult,
  TFinalScore,
> {
  // outputs of the evaluator on each dataset entry
  outputs: TEvaluatorResult[];

  // final score
  score: TFinalScore;
}