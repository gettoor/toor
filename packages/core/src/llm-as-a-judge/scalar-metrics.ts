import { ScalarMetric } from './scalar-types.js';

/**
 * Is the answer factually accurate?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_CORRECTNESS: ScalarMetric = {
  name: 'correctness',
  scoreDescription: 'The score for correctness',
  promptDescription: 'The correctness of the response',
};

/**
 * Does it cover everything important?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_COMPLETENESS: ScalarMetric = {
  name: 'completeness',
  scoreDescription: 'The score for completeness',
  promptDescription: 'The completeness of the response',
};

/**
 * Does it address the user's request?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_RELEVANCE: ScalarMetric = {
  name: 'relevance',
  scoreDescription: 'The score for relevance',
  promptDescription: 'The relevance of the response',
};

/**
 * Is it easy to understand?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_CLARITY: ScalarMetric = {
  name: 'clarity',
  scoreDescription: 'The score for clarity',
  promptDescription: 'The clarity of the response',
};

/**
 * Is it appropriately brief without unnecessary content?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_CONCISENESS: ScalarMetric = {
  name: 'conciseness',
  scoreDescription: 'The score for conciseness',
  promptDescription: 'The conciseness of the response',
};

/**
 * Is it free of spelling, grammar, and punctuation errors?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_GRAMMAR: ScalarMetric = {
  name: 'grammar',
  scoreDescription: 'The score for grammar',
  promptDescription: 'The grammar of the response',
};

/**
 * Does it flow logically and remain internally consistent?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_COHERENCE: ScalarMetric = {
  name: 'coherence',
  scoreDescription: 'The score for coherence',
  promptDescription: 'The coherence of the response',
};

/**
 * Does it actually help the user accomplish their goal?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_HELPFULNESS: ScalarMetric = {
  name: 'helpfulness',
  scoreDescription: 'The score for helpfulness',
  promptDescription: 'The helpfulness of the response',
};

/**
 * Does it avoid harmful or policy-violating content?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_SAFETY: ScalarMetric = {
  name: 'safety',
  scoreDescription: 'The score for safety',
  promptDescription: 'The safety of the response',
};

/**
 * Is the reasoning clear and logical?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_REASONING_QUALITY: ScalarMetric = {
  name: 'reasoning_quality',
  scoreDescription: 'The score for reasoning quality',
  promptDescription: 'The reasoning quality of the response',
};

/**
 * Can the user act on the answer?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_ACTIONABILITY: ScalarMetric = {
  name: 'actionability',
  scoreDescription: 'The score for actionability',
  promptDescription: 'The actionability of the response',
};

/**
 * Did it obey all instructions and constraints?
 * @category LLM-as-a-judge
 */
export const SCALAR_METRIC_INSTRUCTION_FOLLOWING: ScalarMetric = {
  name: 'instruction_following',
  scoreDescription: 'The score for instruction following',
  promptDescription: 'The instruction following of the response',
};