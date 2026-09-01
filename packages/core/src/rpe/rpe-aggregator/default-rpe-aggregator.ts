import { distributeScores, DistributionRange } from '../../math/index.js';
import { MetricResult } from '../../llm/index.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';
import { 
  RPEAggregator,
  RPEAggregatorInfo,
  RPEAggregatorInput,
  RPEAggregatorOutput,
} from './rpe-aggregator-types.js';
import { DefaultRPEAggregatorInput } from './default-rpe-aggregator-types.js';

/**
 * Default RPE aggregator.
 * @param input - Input for the RPE aggregator.
 * @returns RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export function defaultRPEAggregator(
  input: DefaultRPEAggregatorInput,
): RPEAggregator {
  const { aggregationFunc, passedEvaluationThreshold } = input;
  return {
    run: async (input: RPEAggregatorInput): Promise<RPEAggregatorOutput> => {
      const { evaluations } = input;
      const scores = evaluations.map(evaluation => evaluation.score);
      
      return {
        candidateRef: candidateRefFromCandidate(input.candidate),
        passedEvaluations: evaluations.filter(evaluation => {
          return evaluation.score >= passedEvaluationThreshold;
        }),
        failedEvaluations: evaluations.filter(evaluation => {
          return evaluation.score < passedEvaluationThreshold;
        }),
        aggregatedScore: aggregationFunc(scores),
        aggregatedMetrics: aggregateMetrics(evaluations, aggregationFunc),
        scoreDistribution: distributeScores(
          scores,
          getDefaultScoreDistributionRanges(),
        ),
      };
    },

    getInfo: async (): Promise<RPEAggregatorInfo> => {
      return {
        name: 'Default Aggregator',
        properties: [
          {
            key: 'aggregationFunc',
            value: aggregationFunc.name,
            description: 'Aggregation function used to aggregate the scores.',
          },
          {
            key: 'passedEvaluationThreshold',
            value: passedEvaluationThreshold,
            description: 'Score threshold for passing an evaluation.',
          },
        ],
      };
    },
  };
}

function aggregateMetrics(
  evaluations: RPEEvaluatorOutput[],
  aggregationFunc: DefaultRPEAggregatorInput['aggregationFunc'],
): Record<string, MetricResult> {
  // collect metric names
  const metricNames = new Set<string>();
  for (const evaluation of evaluations) {
    if (evaluation.metrics) {
      for (const metric of Object.keys(evaluation.metrics)) {
        metricNames.add(metric);
      }
    }
  }

  // aggregate metrics
  const aggregatedMetrics: Record<string, MetricResult> = {};
  for (const metricName of metricNames) {
    const metricValues = evaluations
      .map(evaluation => evaluation.metrics?.[metricName]?.normalizedScore)
      .filter(score => score !== undefined);
    aggregatedMetrics[metricName] = {
      normalizedScore: aggregationFunc(metricValues),
    };
  }
  
  return aggregatedMetrics;
}

function getDefaultScoreDistributionRanges(): DistributionRange[] {
  return [
    { min: 0, max: 0.1, count: 0 },
    { min: 0.1, max: 0.2, count: 0 },
    { min: 0.2, max: 0.3, count: 0 },
    { min: 0.3, max: 0.4, count: 0 },
    { min: 0.4, max: 0.5, count: 0 },
    { min: 0.5, max: 0.6, count: 0 },
    { min: 0.6, max: 0.7, count: 0 },
    { min: 0.7, max: 0.8, count: 0 },
    { min: 0.8, max: 0.9, count: 0 },
    { min: 0.9, max: 1.0, count: 0 },
  ];
}