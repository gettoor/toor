/**
 * A model provider abstraction.
 */
import { LanguageModel } from 'ai';

/**
 * A model provider. The returned `LanguageModel` comes from
 * [AI SDK](https://ai-sdk.dev/).
 * @category Model Provider
 */
export interface ModelProvider {
  /**
   * Gets a model by name.
   * @param name - The name of the model.
   * @returns The model.
   */
  getModel(name: string): Promise<LanguageModel>;
}