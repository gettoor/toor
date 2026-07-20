import { MetricResult } from '../../llm/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';
import { 
  RPEAggregator,
  RPEAggregatorInput,
  RPEAggregatorOutput,
} from './rpe-aggregator-types.js';
import { DefaultRPEAggregatorInput } from './default-rpe-aggregator-types.js';

export function defaultRPEAggregator(
  input: DefaultRPEAggregatorInput,
): RPEAggregator {
  const { aggregationFunc, passedEvaluationThreshold } = input;
  return async (input: RPEAggregatorInput): Promise<RPEAggregatorOutput> => {
    const { evaluations } = input;
    const scores = evaluations.map(evaluation => evaluation.score);
    
    return {
      prompt: input.prompt,
      passedEvaluations: evaluations.filter(evaluation => {
        return evaluation.score >= passedEvaluationThreshold;
      }),
      failedEvaluations: evaluations.filter(evaluation => {
        return evaluation.score < passedEvaluationThreshold;
      }),
      aggregatedScore: aggregationFunc(scores),
      aggregatedMetrics: aggregateMetrics(evaluations, aggregationFunc),
    };
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
      .map(evaluation => evaluation.metrics?.[metricName]?.score)
      .filter(score => score !== undefined);
    aggregatedMetrics[metricName] = {
      score: aggregationFunc(metricValues),
    };
  }
  
  return aggregatedMetrics;
}