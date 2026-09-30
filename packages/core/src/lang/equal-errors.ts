import { BadRequestToorError } from '../errors/index.js';

export class CircularReferenceError extends BadRequestToorError {
  public static readonly CODE = 'CircularReferenceError';

  public constructor() {
    super(CircularReferenceError.CODE, 'Circular reference detected');
  }
}