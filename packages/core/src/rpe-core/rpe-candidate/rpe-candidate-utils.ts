import { InternalToorError } from '../../errors/index.js';
import { PROMPT_MODULE_NAME } from './rpe-candidate-consts.js';
import {
  RPECandidate,
  RPECandidateModules,
  RPECandidateRef,
} from './rpe-candidate-types.js';

/**
 * Creates a reference to a candidate.
 * @category Reflective Prompt Evolution
 * @param candidate - Candidate to create a reference for.
 * @returns Reference to the candidate.
 */
export function candidateRefFromCandidate(
  candidate: RPECandidate,
): RPECandidateRef {
  return {
    candidateId: candidate.candidateId,
  }
}

/**
 * Creates a candidate with a single prompt module.
 * @category Reflective Prompt Evolution
 * @param prompt - Prompt to create a candidate for.
 * @returns Candidate modules with a single prompt module.
 */
export function buildSinglePromptCandidateModules(
  prompt: string,
): RPECandidateModules {
  return {
    [PROMPT_MODULE_NAME]: {
      content: prompt,
    },
  }
}

/**
 * Requires a single prompt module from a candidate.
 * @category Reflective Prompt Evolution
 * @param modules - Candidate modules to search for a prompt module in.
 * @returns Prompt content.
 */
export function requireSinglePromptCandidateModule(
  modules: RPECandidateModules,
): string {
  const keys = Object.keys(modules);
  if (keys.length !== 1) {
    throw new InternalToorError(
      'Candidate must have exactly one module for single prompt candidate'
    );
  }
  if (keys[0] !== PROMPT_MODULE_NAME) {
    throw new InternalToorError(
      `Candidate must have a ${PROMPT_MODULE_NAME} module ` +
      `for single prompt candidate`
    );
  }
  return modules[PROMPT_MODULE_NAME].content;
}