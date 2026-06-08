export const EVALUATION_TYPES = [
  'experiment',
] as const

export type EvaluationType = (typeof EVALUATION_TYPES)[number]

export interface Args {
  cfgFile: string;
  type: EvaluationType;
}