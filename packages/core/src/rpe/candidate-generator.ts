import { InternalToorError, ToorError } from '../errors/index.js';
import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { findCandidateById, RPEState } from './rpe-state/index.js';
import { RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from './rpe-analyzer/index.js';
import { RPECandidateGenerator } from './rpe-candidate-generator/index.js';
import { 
  DEFAULT_CANDIDATE_GENERATOR_PARALLELISM,
} from './candidate-generator-consts.js';
import { PromptGeneratorOutput } from './candidate-generator-types.js';
import { RPECandidate } from './rpe-candidate/index.js';

/**
 * Generates prompt candidates based on the original prompts,
 * the aggregations of the evaluations and the analyses of the prompts.
 * @category Reflective Prompt Evolution
 */
export async function generatePrompts(
  state: RPEState,
  aggregations: RPEAggregatorOutput[],
  analyses: RPEAnalyzerOutput[],
  generator: RPECandidateGenerator,
  parallelism?: number,
): Promise<PromptGeneratorOutput> {
  parallelism = parallelism ?? DEFAULT_CANDIDATE_GENERATOR_PARALLELISM;

  // tasks
  const tasks = aggregations.map(async (aggregation, index) => {
    const aggregationCandidateId = aggregation.candidateRef.candidateId;

    // find analysis
    const analysis = analyses.find(analysis => {
      return analysis.candidateRef.candidateId === aggregationCandidateId;
    });
    if (!analysis) {
      throw new InternalToorError(
        `Analysis not found for prompt during prompt generation: ` +
        `${ToorError.quote(aggregationCandidateId)}`,
      );
    }

    // generate (candidate) prompt
    const { candidates } = await generator.run({
      candidate: findCandidateById(state, aggregationCandidateId),
      aggregation,
      analysis,
    });
    return candidates.map(candidate => {
      return {
        candidate: {
          ...candidate.candidate,
          candidateId: `i${state.iterationNo}p${index}`,
        },
        changes: candidate.changes,
        usage: candidate.usage,
      };
    });
  });

  // run tasks in parallel
  const outputs = await runParallelBatchesOrThrow(tasks, parallelism);
  return { candidates: outputs.flat() };
}