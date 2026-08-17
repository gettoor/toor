import { NotFoundToorError, ToorError } from '../../errors/index.js';

export class PromptNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'PromptNotFoundError';

  public constructor(promptId: string) {
    super(
      PromptNotFoundError.CODE,
      `Prompt with id ${ToorError.quote(promptId)} not found`,
    );
  }
}