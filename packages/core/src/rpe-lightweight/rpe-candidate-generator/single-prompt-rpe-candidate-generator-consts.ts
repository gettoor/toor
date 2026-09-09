import {
  SinglePromptRPECandidateGeneratorInstruction,
} from './single-prompt-rpe-candidate-generator-types.js';

/**
 * Default parallelism for the single-prompt RPE candidate generator.
 * @category Reflective Prompt Evolution
 */
export const SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PARALLELISM = 1;

/**
 * Create an instruction for the single-prompt RPE candidate generator.
 */
function instruction(
  id: string,
  instruction: string,
): SinglePromptRPECandidateGeneratorInstruction {
  return {
    id,
    instruction,
  };
}

/**
 * Instructions for the single-prompt RPE candidate generator.
 * @category Reflective Prompt Evolution
 */
export const SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS:
  Record<string, SinglePromptRPECandidateGeneratorInstruction> =
{
  defaultInstruction: instruction('defaultInstruction',
    'Make the smallest effective set of substantive changes supported ' +
    'by the evaluation evidence. Prioritize the highest-impact weaknesses ' +
    'while preserving successful behaviors. Do not pursue diversity ' +
    'or novelty for its own sake.',
  ),
  minimalFix: instruction('minimalFix',
    'Make the smallest possible change that addresses ' +
    'the highest- impact failure while preserving the rest of the prompt',
  ),
  structuralRedesign: instruction('structuralRedesign',
    'Reorganize the prompt substantially to make ' +
    'its logic, hierarchy, and decision process clearer.',
  ),
  explicitDecisionRules: instruction('explicitDecisionRules',
    'Convert vague guidance into concrete rules, conditions, priorities, ' +
    'and tie-breaking logic.',
  ),
  conceptualDistinctions: instruction('conceptualDistinctions',
    'Focus on explicitly encoding the distinctions that the current prompt ' +
    'appears to be missing.',
  ),
  failureDriven: instruction('failureDriven',
    'Optimize primarily for the recurring failure patterns found in ' +
    'the evaluation evidence.',
  ),
  strengthPreserving: instruction('strengthPreserving',
    'Start from the behaviors responsible for passed evaluations ' +
    'and extend them to cover the failures with minimal regression risk.',
  ),
  simplification: instruction('simplification',
    'Remove unnecessary instructions, redundancy, or ambiguity while ' +
    'still addressing the observed failures.',
  ),
  reasoningDecomposition: instruction('reasoningDecomposition',
    'Break the task into explicit intermediate reasoning or decision steps ' +
    'where doing so could improve reliability.',
  ),
  constraintFirst: instruction('constraintFirst',
    'Put the most important constraints, invariants, and forbidden behaviors ' +
    'at the center of the prompt design.',
  ),
  edgeCaseFocused: instruction('edgeCaseFocused',
    'Optimize specifically for difficult, ambiguous, borderline, ' +
    'or adversarial examples while preserving normal-case performance.',
  ),
  generalizationFirst: instruction('generalizationFirst',
    'Fix the underlying class of failures rather than adding instructions ' +
    'that are specific to the observed examples.',
  ),
  alternativeFormulation: instruction('alternativeFormulation',
    'Solve the same optimization problem using a materially different ' +
    'instructional approach from the parent prompt.',
  ),
  robustnessFocused: instruction('robustnessFocused',
    'Prefer instructions that reduce dependence on subtle wording, ' +
    'ordering, or implicit assumptions.',
  ),
  priorityDriven: instruction('priorityDriven',
    'Explicitly define which objectives take precedence when instructions ' +
    'or signals conflict.',
  ),
  exampleGuided: instruction('exampleGuided',
    'Use carefully chosen abstract examples or counterexamples to ' +
    'communicate distinctions that are difficult to express as rules alone.',
  ),
  noExampleApproach: instruction('noExampleApproach',
    'Solve the same problems using only general rules and principles, ' +
    'without relying on examples.',
  ),
  compactDecisionProcedure: instruction('compactDecisionProcedure',
    'Turn the prompt into a short, deterministic-looking procedure ' +
    'the model can follow consistently.',
  ),
  richDecisionProcedure: instruction('richDecisionProcedure',
    'Use a more detailed procedure with checks, exceptions, ' +
    'and explicit handling of uncertainty.',
  ),
  conservativeCandidate: instruction('conservativeCandidate',
    'Avoid introducing new behavior unless strongly supported ' +
    'by evaluation evidence.',
  ),
  aggressiveCandidate: instruction('aggressiveCandidate',
    'Allow substantial changes to the prompt\'s strategy when the evidence ' +
    'suggests the current formulation is fundamentally inadequate.',
  ),
};
