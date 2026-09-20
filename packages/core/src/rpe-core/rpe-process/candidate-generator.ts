import { RPEState } from '../rpe-state/index.js';
import {
  RPECandidateGenerator,
  RPECandidateGeneratorOutput,
} from '../rpe-candidate-generator/index.js';
import { CandidateGeneratorOutput } from './candidate-generator-types.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
// import { CandidateGeneratorOutput } from './candidate-generator-types.js';

/**
 * Generates prompt candidates based on the original prompts,
 * the aggregations of the evaluations and the analyses of the prompts.
 * @category Reflective Prompt Evolution
 */
export async function generateCandidates(
  state: RPEState,
  generator: RPECandidateGenerator,
): Promise<RPECandidateGeneratorOutput> {
  const { candidates } = await generator.run(state, {});
  return { candidates };
}