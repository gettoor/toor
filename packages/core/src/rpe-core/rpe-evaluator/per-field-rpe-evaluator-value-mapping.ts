import { InternalToorError, ToorError } from '../../errors/index.js';
import {
  PerFieldRPEEvaluatorValueMapping,
  PerFieldRPEEvaluatorValueMappingOutput,
} from './per-field-rpe-evaluator-value-mapping-types.js';

export function mapValue(
  value: string,
  mapping?: PerFieldRPEEvaluatorValueMapping<string>,
): PerFieldRPEEvaluatorValueMappingOutput {
  if (mapping === undefined) {
    return {
      value,
      isMapped: false,
    };
  }

  // function
  if (typeof mapping === 'function') {
    const mappedValue = mapping(value);
    if (mappedValue == null) {
      throw new InternalToorError(
        `Mapping function returned null/undefined for value ` +
        `${ToorError.quote(value)}`
      );
    }
    return {
      value: mappedValue,
      isMapped: true,
    };
  }

  // static mapping
  const mappedValue = mapping[value];
  if (mappedValue === undefined) {
    return {
      value,
      isMapped: false,
    };
  }
  return {
    value: mappedValue,
    isMapped: mappedValue !== value,
  };
}