export function countLabel(
  count: number,
  singular: string,
  plural?: string,
): string {
  plural = plural ?? `${singular}s`;
  return `${count} ${count === 1 ? singular : plural}`;
}