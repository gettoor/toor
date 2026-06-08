import { LLMUsage } from '../llm/index.js';

export interface ModelParameters {
  // temperature
  temperature?: number;
}

export interface Output<TResult> {
  result: TResult;
  reasoning: string;
  usage: LLMUsage;
}