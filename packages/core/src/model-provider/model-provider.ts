/**
 * A model provider abstraction.
 */
import { LLMModel } from '../llm/index.js';

/**
 * A model provider. The returned `LLMModel` comes from
 * [AI SDK](https://ai-sdk.dev/).
 * @category Model Provider
 */
export interface ModelProvider {
  /**
   * Gets a model by name.
   * @param name - Name of the model.
   * @returns Language model.
   */
  getModel(name: string): Promise<LLMModel>;

  /**
   * Gets the provider model name for a given model name.
   * @param name - Name of the model.
   * @returns Provider model name.
   */
  getProviderModelName(name: string): string;
}