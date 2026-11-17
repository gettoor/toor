import { ErrorObject } from 'ajv';

export interface AjvValidateObjectResult {
  /**
   * Whether the object is valid.
   */
  valid: boolean;

  /**
   * Errors from the validation.
   */
  errors: ErrorObject[];
}