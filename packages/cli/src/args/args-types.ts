export const PROCESS_TYPES = [
  'experiment',
] as const

export type ProcessType = (typeof PROCESS_TYPES)[number]

export interface Args {
  cfgFile: string;
  verbose: boolean;
  type: ProcessType;
}