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

/**
 * Checks if two candidates have the same modules contents.
 * @category Reflective Prompt Evolution
 * @param a - First candidate to compare.
 * @param b - Second candidate to compare.
 * @returns True if the candidates have the same modules, false otherwise.
 */
export function haveSameModules(a: RPECandidate, b: RPECandidate): boolean {
  const aNames = Object.keys(a.modules);
  const bNames = Object.keys(b.modules);
  if (aNames.length !== bNames.length) {
    return false;
  }
  if (!aNames.every(module => bNames.includes(module))) {
    return false;
  }
  const allEqual = aNames.every(aName => {
    return a.modules[aName].content === b.modules[aName].content;
  });
  return allEqual;
}

/**
 * Deduplicates candidates by modules contents.
 * @param candidates - Candidates to deduplicate.
 * @returns Deduplicated candidates.
 */
export function deduplicateCandidates(
  candidates: RPECandidate[],
): RPECandidate[] {
  const deduplicated = candidates.filter((aCandidate, aIndex, self) => {
    const bIndex = self.findIndex(bCandidate => {
      return haveSameModules(aCandidate, bCandidate);
    });
    return aIndex === bIndex;
  });
  return deduplicated;
}