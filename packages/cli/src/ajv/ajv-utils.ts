import { ErrorObject } from 'ajv';
import { ToorError } from '@gettoor/engine';

export function humanizeAjvErrors(
  errors: ErrorObject[],
  prefix = '',
): string[] {
  return errors.map(error => {
    const path = error.instancePath || "/";
    const err = (msg: string) => `${prefix}${path}: ${msg}`;

    switch (error.keyword) {
      case 'required':
        return err(`missing required field '${error.params.missingProperty}'`);

      case 'additionalProperties':
        return err(`unknown field '${error.params.additionalProperty}'`);

      case 'type':
        return err(`expected type ${ToorError.quote(error.params.type)}`);

      case 'enum':
        return err(
          `expected value from enum: ` +
          `${error.params.allowedValues.join(', ')}`
        );

      default:
        return `${prefix}${path}: ${error.message}`;
    }
  });
}