/**
 * A base error class for Toor.
 */
export class ToorError extends Error {
  /**
   * Creates a new ToorError.
   * @param errorCode - Typically the class name of the error.
   * @param message - The error message.
   * @param httpStatusCode - The HTTP status code.
   */
  public constructor(
    private readonly errorCode: string,
    message: string,
    private readonly httpStatusCode: number,
  ) {
    super(message);
  }

  public getErrorCode(): string {
    return this.errorCode;
  }

  public getHttpStatusCode(): number {
    return this.httpStatusCode;
  }

  public static quote(value: string): string {
    return `"${value}"`;
  }
}