import { BadRequestToorError, ToorError } from '../../errors/index.js';

export class NonUniqueDatasetEntriesError extends BadRequestToorError {
  public static readonly CODE = 'NonUniqueDatasetEntriesError';

  constructor(ids: string[]) {
    super(
      `Dataset entry identifiers ` +
      `${NonUniqueDatasetEntriesError.idsToString(ids)} are not unique`,
      NonUniqueDatasetEntriesError.CODE,
    );
  }

  private static idsToString(ids: string[]): string {
    return ids.map(id => ToorError.quote(id)).join(', ');
  }
}