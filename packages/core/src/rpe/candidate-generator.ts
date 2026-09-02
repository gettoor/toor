import { RPEState } from './rpe-state/index.js';
import { RPECandidateGenerator } from './rpe-candidate-generator/index.js';
import { PromptGeneratorOutput } from './candidate-generator-types.js';

/**
 * Generates prompt candidates based on the original prompts,
 * the aggregations of the evaluations and the analyses of the prompts.
 * @category Reflective Prompt Evolution
 */
export async function generateCandidates(
  state: RPEState,
  generator: RPECandidateGenerator,
): Promise<PromptGeneratorOutput> {
  const { candidates } = await generator.run(state, {});
  return { candidates };
}