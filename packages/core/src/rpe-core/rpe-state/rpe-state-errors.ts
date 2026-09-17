import { NotFoundToorError, ToorError } from '../../errors/index.js';

export class CandidateNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'CandidateNotFoundError';

  public constructor(candidateId: string) {
    super(
      CandidateNotFoundError.CODE,
      `Candidate with identifier ${ToorError.quote(candidateId)} not found`,
    );
  }
}

export class GeneratedCandidateNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'GeneratedCandidateNotFoundError';

  public constructor(candidateId: string) {
    super(
      GeneratedCandidateNotFoundError.CODE,
      `Generated candidate with identifier ` +
      `${ ToorError.quote(candidateId) } not found`,
    );
  }
}