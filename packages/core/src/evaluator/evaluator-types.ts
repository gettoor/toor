/**
 * An evaluator function which calculates (generates) result for
 * a dataset entry.
 * @category Evaluator
 * @param datasetEntry - The dataset entry to evaluate.
 * @param index - The index of the dataset entry.
 * @returns The result of the evaluation.
 */
export type Evaluator<TDatasetEntry, TResult> = (
  datasetEntry: TDatasetEntry,
  index: number,
) => Promise<TResult>;

/**
 * Input to run an evaluation over a dataset.
 * @category Evaluator
 * @param TDatasetEntry - The type of the dataset entry.
 * @param TEvaluatorResult - The type of the evaluator result.
 * @param TFinalScore - The type of the final score.
 */
export interface EvaluationInput<
  TDatasetEntry,
  TEvaluatorResult,
  TFinalScore,
> {
  /**
   * An evaluator function which calculates (generates) result for
   * a dataset entry.
   */
  evaluator: Evaluator<TDatasetEntry, TEvaluatorResult>;

  /**
   * Dataset to evaluate. The evaluator will be called for each dataset entry.
   */
  dataset: TDatasetEntry[];

  /**
   * A function which calculates the final score based on the results of the
   * evaluator.
   * @param outputs - The results of the evaluator.
   * @returns The final score.
   */
  score: (outputs: TEvaluatorResult[]) => Promise<TFinalScore>;

  /**
   * This callback is called before the evaluator is called for a dataset entry.
   * @param datasetEntry - The dataset entry that will be evaluated.
   * @param index - The index of the dataset entry.
   */
  onEvaluatorStart?: (
    datasetEntry: TDatasetEntry,
    index: number,
  ) => Promise<void>;

  /**
   * This callback is called after the evaluator is called for a dataset entry.
   * @param datasetEntry - The dataset entry that was evaluated.
   * @param index - The index of the dataset entry.
   * @param output - The result of the evaluation.
   */
  onEvaluatorEnd?: (
    datasetEntry: TDatasetEntry,
    index: number,
    output: TEvaluatorResult,
  ) => Promise<void>;
}

/**
 * Type for an evaluation output.
 * @category Evaluator
 * @param TEvaluatorResult - The type of the evaluator result.
 * @param TFinalScore - The type of the final score.
 */
export interface EvaluationOutput<
  TEvaluatorResult,
  TFinalScore,
> {
  /**
   * The results of the evaluator on each dataset entry.
   */
  outputs: TEvaluatorResult[];

  /**
   * The final score of the evaluation.
   */
  score: TFinalScore;
}