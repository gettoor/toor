import { RPEPrompt } from '../rpe-prompt/index.js';
import { RPEIteration } from '../rpe-state/index.js';

/**
 * Insights from an RPE process.
 * @category Reflective Prompt Evolution
 */
export interface RPEInsights {
  /**
   * All the prompts from an RPE process.
   */
  prompts: RPEPrompt[];

  /**
   * The current iteration of the RPE process.
   */
  stopReason: string;

  /**
   * The history of iterations of the RPE process.
   */
  iterationHistory: RPEIteration[];
}