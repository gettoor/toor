import {
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS,
} from './rpe-candidate-generator/index.js';

/**
 * Default parallelism for the candidate generator.
 * @category Reflective Prompt Evolution
 */
export const DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM = 4;

/**
 * Default threshold for the passed evaluation.
 * @category Reflective Prompt Evolution
 */
export const DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD = 0.9;

/**
 * Default instructions for the candidate generator.
 * @category Reflective Prompt Evolution
 */
export const DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS = [
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.minimalFix,
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.structuralRedesign,
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.explicitDecisionRules,
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.conceptualDistinctions,
];

/**
 * Default maximum number of iterations.
 * @category Reflective Prompt Evolution
 */
export const DEFAULT_RPE_LIGHTWEIGHT_MAXIMUM_ITERATIONS = 16;

/**
 * Default minimum score to stop the RPE process.
 * @category Reflective Prompt Evolution
 */
export const DEFAULT_RPE_LIGHTWEIGHT_MIN_SCORE = 0.95;