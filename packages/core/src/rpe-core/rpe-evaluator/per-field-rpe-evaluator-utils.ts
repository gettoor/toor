import { PerFieldRPEEvaluatorField } from './per-field-rpe-evaluator-types.js';

export function quoteField(field: PerFieldRPEEvaluatorField): string {
  return `"${field.field}"`;
}