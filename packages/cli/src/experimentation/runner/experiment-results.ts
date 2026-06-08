import { 
  average,
  ExperimentResult,
} from '@gettoor/engine';

import {
  dim,
  printTable,
  TableCell,
} from '../../console/index.js';
import { 
  colorForNormalizedScore,
  colorForScore,
} from './experiment-styles.js';

export function printResults(results: ExperimentResult[]): void {
  // print overall results
  printOverallResults(results);

  // statistic for aggregated results
  const stat = average;
  const statName = 'average';

  // print aggregated results
  console.log();
  printModelScores(results, statName, stat);
  console.log();
  printPromptScores(results, statName, stat);
  console.log();
  printParametersScores(results, statName, stat);
  console.log();
  printDatasetScores(results, statName, stat);
  console.log();
}

export function printOverallResults(results: ExperimentResult[]): void {
  const table: TableCell[][] = [[
    { value: 'Model' },
    { value: 'Parameters' },
    { value: 'Prompt' },
    { value: 'Dataset' },
    { value: 'Score' },
  ]];
  for (const result of results) {
    const scoreColor = colorForScore(result.score);
    table.push([
      { value: result.modelName },
      { value: result.parametersName },
      { value: result.promptName },
      { value: result.datasetName },
      { 
        value: result.score.scoreAsString,
        style: scoreColor,
      },
    ]);
  }
  printTable(table);
}

export function printModelScores(
  results: ExperimentResult[],
  statName: string,
  stat: (values: number[]) => number,
): void {
  const table: TableCell[][] = [[
    { value: 'Model' },
    { value: `Score (${statName})` },
    { value: `Prompt generation time (${statName})` },
  ]];

  // distinct models
  const models  = new Set<string>();
  for (const result of results) {
    models.add(result.modelName);
  }

  for (const model of models) {
    const modelResults = results.filter((result) => {
      return result.modelName === model;
    });

    // score
    const modelScores = modelResults.map((result) => result.score.score);
    const modelScore = stat(modelScores);

    // normalized score
    const modelNormalizedScores = modelResults.map(
      (result) => result.score.normalizedScore
    );
    const modelNormalizedScore = stat(modelNormalizedScores);

    // prompt generation time
    const modelPromptGenerationTimes = modelResults.map(
      (result) => result.metrics.promptGenerationTime
    );
    const modelPromptGenerationTime = Math.round(
      average(modelPromptGenerationTimes),
    );

    table.push([
      { value: model },
      { 
        value: modelScore.toString(),
        style: colorForNormalizedScore(modelNormalizedScore),
      },
      { 
        value: `${modelPromptGenerationTime}${dim('ms')}`,
      },
    ]);
  }
  printTable(table);
}

export function printPromptScores(
  results: ExperimentResult[],
  statName: string,
  stat: (values: number[]) => number,
): void {
  const table: TableCell[][] = [[
    { value: 'Prompt' },
    { value: `Score (${statName})` },
    { value: `Prompt generation time (${statName})` },
  ]];

  // distinct prompts
  const prompts = new Set<string>();
  for (const result of results) {
    prompts.add(result.promptName);
  }

  for (const prompt of prompts) {
    const promptResults = results.filter((result) => {
      return result.promptName === prompt;
    });

    // score
    const promptScores = promptResults.map((result) => {
      return result.score.score;
    });
    const promptScore = stat(promptScores);

    // normalized score
    const promptNormalizedScores = promptResults.map((result) => {
      return result.score.normalizedScore;
    });
    const promptNormalizedScore = stat(promptNormalizedScores);

    // prompt generation time
    const promptPromptGenerationTimes = promptResults.map((result) => {
      return result.metrics.promptGenerationTime;
    });
    const promptPromptGenerationTime = Math.round(
      average(promptPromptGenerationTimes),
    );

    table.push([
      { value: prompt },
      { 
        value: promptScore.toString(),
        style: colorForNormalizedScore(promptNormalizedScore),
      },
      { value: `${promptPromptGenerationTime}${dim('ms')}` },
    ]);
  }
  printTable(table);
}

export function printParametersScores(
  results: ExperimentResult[],
  statName: string,
  stat: (values: number[]) => number,
): void {
  const table: TableCell[][] = [[
    { value: 'Parameters' },
    { value: `Score (${statName})` },
    { value: `Prompt generation time (${statName})` },
  ]];

  // distinct parameters
  const parameters = new Set<string>();
  for (const result of results) {
    parameters.add(result.parametersName);
  }
  for (const parameter of parameters) {
    const parameterResults = results.filter((result) => {
      return result.parametersName === parameter;
    });

    // score
    const parameterScores = parameterResults.map((result) => {
      return result.score.score;
    });
    const parameterScore = stat(parameterScores);

    // normalized score
    const parameterNormalizedScores = parameterResults.map((result) => {
      return result.score.normalizedScore;
    });
    const parameterNormalizedScore = stat(parameterNormalizedScores);
    
    // prompt generation time
    const parameterPromptGenerationTimes = parameterResults.map((result) => {
      return result.metrics.promptGenerationTime;
    });
    const parameterPromptGenerationTime = Math.round(
      average(parameterPromptGenerationTimes),
    );
    
    table.push([
      { value: parameter },
      { 
        value: parameterScore.toString(),
        style: colorForNormalizedScore(parameterNormalizedScore),
      },
      { value: `${parameterPromptGenerationTime}${dim('ms')}` },
    ]);
  }
  printTable(table);
}

export function printDatasetScores(
  results: ExperimentResult[],
  statName: string,
  stat: (values: number[]) => number,
): void {
  const table: TableCell[][] = [[
    { value: 'Dataset' },
    { value: `Score (${statName})` },
    { value: `Prompt generation time (${statName})` },
  ]];

  // distinct datasets
  const datasets = new Set<string>();
  for (const result of results) {
    datasets.add(result.datasetName);
  }
  for (const dataset of datasets) {
    const datasetResults = results.filter((result) => {
      return result.datasetName === dataset;
    });

    // score
    const datasetScores = datasetResults.map((result) => {
      return result.score.score;
    });
    const datasetScore = stat(datasetScores);
    
    // normalized score
    const datasetNormalizedScores = datasetResults.map((result) => {
      return result.score.normalizedScore;
    });
    const datasetNormalizedScore = stat(datasetNormalizedScores);
    
    // prompt generation time
    const datasetPromptGenerationTimes = datasetResults.map((result) => {
      return result.metrics.promptGenerationTime;
    });
    const datasetPromptGenerationTime = Math.round(
      average(datasetPromptGenerationTimes),
    );
    
    table.push([
      { value: dataset },
      { 
        value: datasetScore.toString(),
        style: colorForNormalizedScore(datasetNormalizedScore),
      },
      { value: `${datasetPromptGenerationTime}${dim('ms')}` },
    ]);
  }
  printTable(table);
}
