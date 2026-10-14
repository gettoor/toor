export const PROCESS_TYPES = [
  'experiment',
  'rpe-dataset',
] as const

export const PROCESS_TYPES_DESCRIPTION: Record<ProcessType, string> = {
  'experiment': 'Run an experiment',
  'rpe-dataset': 'Validate an RPE dataset',
};

export type ProcessType = (typeof PROCESS_TYPES)[number]

export interface Args {
  cfgFile: string;
  verbose: boolean;
  type: ProcessType;
}