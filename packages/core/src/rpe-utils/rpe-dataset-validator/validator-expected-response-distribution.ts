import { calculateNormalizedShannonEntropy } from '../../math/index.js';
import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorExpectedResponseDistribution,
} from './rpe-dataset-validator-types.js';

export function findExpectedResponseDistributions(
  allEntries: RPEDatasetEntryWithName[],
  threshold: number,
): RPEDatasetValidatorExpectedResponseDistribution[] {
  const distributions: RPEDatasetValidatorExpectedResponseDistribution[] = [];

  allEntries.forEach(entry => {
    let distribution = distributions.find(distribution => {
      return distribution.datasetName === entry.datasetName;
    });
    if (!distribution) {
      distribution = {
        datasetName: entry.datasetName,
        fieldDistributions: [],
      };
      distributions.push(distribution);
    }
    const expectedResponse = entry.expectedResponse;
    if (typeof expectedResponse === 'string') {
      incDistribution(distribution, '', expectedResponse);
    }
    else if (typeof expectedResponse === 'object') {
      const keys = Object.keys(expectedResponse);
      keys.forEach(key => {
        const value = expectedResponse[key];
        if (typeof value === 'string') {
          incDistribution(distribution, key, value);
        }
      });
    }
  });

  return distributions
    .map(distribution => {
      return calculateAndFilterEntropies(distribution, threshold);
    })
    .filter(distribution => {
      return distribution.fieldDistributions.length > 0;
    });
}

function incDistribution(
  distribution: RPEDatasetValidatorExpectedResponseDistribution,
  fieldName: string,
  key: string,
): void {
  let fieldDistribution = distribution.fieldDistributions.find(
    fieldDistribution => {
      return fieldDistribution.fieldName === fieldName;
    },
  );
  if (!fieldDistribution) {
    fieldDistribution = {
      fieldName,
      distribution: {},
      distributionImbalance: 0,
    };
    distribution.fieldDistributions.push(fieldDistribution);
  }
  if (!fieldDistribution.distribution[key]) {
    fieldDistribution.distribution[key] = 0;
  }
  fieldDistribution.distribution[key]++;
}

function calculateAndFilterEntropies(
  distribution: RPEDatasetValidatorExpectedResponseDistribution,
  threshold: number,
): RPEDatasetValidatorExpectedResponseDistribution {
  return {
    ...distribution,
    fieldDistributions: distribution.fieldDistributions
      .map(
        fieldDistribution => {
          const values = Object.values(fieldDistribution.distribution);
          return {
            ...fieldDistribution,
            distributionImbalance:
              1 - calculateNormalizedShannonEntropy(values),
          }
        },
      )
      .filter(fieldDistribution => {
        return fieldDistribution.distributionImbalance >= threshold;
      }),
  };
}