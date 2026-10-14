import { ZodError } from 'zod';

export function prettyZodError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join('\n');
}