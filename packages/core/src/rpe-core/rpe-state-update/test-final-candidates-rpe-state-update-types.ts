import { RPEDataset } from '../rpe-dataset/index.js';
import {
  EvaluateDatasetInput,
} from '../rpe-process/dataset-evaluator-types.js';

/**
 * Input for testing the final candidates against a dataset.
 * @category Reflective Prompt Evolution
 */
export interface TestFinalCandidatesRPEStateUpdateInput
  extends Omit<EvaluateDatasetInput, 'candidates'>
{
  /**
   * Dataset to test the final candidates against.
   */
  testDataset: RPEDataset;
}