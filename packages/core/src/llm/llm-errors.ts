import { InternalToorError, ToorError } from '../errors/index.js';

export class InvalidLLMStructuredOutputError extends InternalToorError {
  constructor(validationError: string) {
    super(
      `Invalid LLM structured output ${ToorError.quote(validationError)}`
    );
  }
}