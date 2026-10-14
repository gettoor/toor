import { RPEDataset } from '../../rpe-core/index.js';
import {
  RPEIOFormat,
  readFromFile,
  readFromString,
  writeToString,
} from '../rpe-io-core/index.js';
import { RPEDatasetForIO, RPEDatasetSchema } from './rpe-dataset-io-types.js';

/**
 * Read a RPE dataset from a string.
 * @category Reflective Prompt Evolution
 * @param str - String to read.
 * @param format - Format of the data.
 * @returns RPE dataset.
 */
export function readRPEDatasetFromString(
  str: string,
  format: RPEIOFormat,
): RPEDataset {
  const data = readFromString<RPEDatasetForIO>(str, format, RPEDatasetSchema);
  return toRPEDataset(data);
}

/**
 * Read a RPE dataset from a file.
 * @category Reflective Prompt Evolution
 * @param path - Path to the file.
 * @param format - Format of the data.
 * @returns RPE dataset.
 */
export function readRPEDatasetFromFile(
  path: string,
  format: RPEIOFormat,
): RPEDataset {
  const data = readFromFile<RPEDatasetForIO>(path, format, RPEDatasetSchema);
  return toRPEDataset(data);
}

function toRPEDataset(data: RPEDatasetForIO): RPEDataset {
  return {
    entries: data.entries.map((entry) => {
      const { id, 'expected-response': expectedResponse, ...rest } = entry;
      return {
        datasetEntryId: id,
        ...(expectedResponse
          ? {
              expectedResponse: expectedResponse.response,
              expectedResponseReasoning: expectedResponse.reasoning
            }
          : {}
        ),
        ...rest,
      };
    }),
  };
}

/**
 * Write a RPE dataset to a string.
 * @category Reflective Prompt Evolution
 * @param dataset - RPE dataset.
 * @param format - Format of the data.
 * @returns String representation of the RPE dataset.
 */
export function writeRPEDatasetToString(
  dataset: RPEDataset,
  format: RPEIOFormat,
): string {
  const mapped = {
    ...dataset,
    entries: dataset.entries.map((entry) => {
      const {
        datasetEntryId,
        expectedResponse,
        expectedResponseReasoning,
        ...rest
      } = entry;
      return {
        id: datasetEntryId,
        ...(expectedResponse
          ? {
            'expected-response': {
              response: expectedResponse,
              reasoning: expectedResponseReasoning,
            },
          }
          : {}),
        ...rest,
      };
    }),
  }
  return writeToString(mapped, format);
}