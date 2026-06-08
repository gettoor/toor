export interface LLMUsage {
  // number of input tokens used
  inputTokens: number | undefined;

  // number of output tokens used
  outputTokens: number | undefined;
}