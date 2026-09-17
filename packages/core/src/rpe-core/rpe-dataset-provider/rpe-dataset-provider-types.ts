import { RPEState } from '../rpe-state/index.js';
import { RPEDataset } from '../rpe-dataset/index.js';

/**
 * Provider for an RPE dataset.
 * @category Reflective Prompt Evolution
 */
export type RPEDatasetProvider = (state: RPEState) => Promise<RPEDataset>;