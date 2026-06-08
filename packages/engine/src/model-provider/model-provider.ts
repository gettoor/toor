/**
 * A model provider abstraction.
 */
import { LanguageModel } from 'ai';

/**
 * A model provider.
 */
export interface ModelProvider {
  /**
   * Gets a model by name.
   * @param name - The name of the model.
   * @returns The model.
   */
  getModel(name: string): Promise<LanguageModel>;
}