import { NotFoundToorError, ToorError } from '../../errors/index.js';

export class CandidateNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'CandidateNotFoundError';

  public constructor(candidateId: string) {
    super(
      CandidateNotFoundError.CODE,
      `Candidate with id ${ToorError.quote(candidateId)} not found`,
    );
  }
}