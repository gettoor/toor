/**
 * A default model provider implementation.
 */
import { LanguageModel } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

import { MissingApiKeyError } from '../errors/index.js';
import { ModelNotFoundError } from './model-provider-errors.js';
import { ModelProvider } from './model-provider.js';

/**
 * A default model provider implementation.
 */
export class DefaultModelProvider implements ModelProvider {
  /**
   * Gets a model by name.
   * @param name - The name of the model.
   * @returns The model.
   */
  public async getModel(name: string): Promise<LanguageModel> {
    // gemini
    const GEMINI_PREFIX = 'gemini:';
    if (name.startsWith(GEMINI_PREFIX)) {
      const geminiModel = name.slice(GEMINI_PREFIX.length);
      const geminiAPIKey = process.env.GEMINI_API_KEY;
      if (!geminiAPIKey) {
        throw new MissingApiKeyError('GEMINI_API_KEY');
      }
      return createGoogleGenerativeAI({
        apiKey: geminiAPIKey,
      }).languageModel(geminiModel);
    }
  
    // openai
    const OPENAI_PREFIX = 'openai:';
    if (name.startsWith(OPENAI_PREFIX)) {
      const openaiModel = name.slice(OPENAI_PREFIX.length);
      const openaiAPIKey = process.env.OPENAI_API_KEY;
      if (!openaiAPIKey) {
        throw new MissingApiKeyError('OPENAI_API_KEY');
      }
      return createOpenAI({
        apiKey: openaiAPIKey,
      }).languageModel(openaiModel);
    }
  
    // anthropic
    const ANTHROPIC_PREFIX = 'anthropic:';
    if (name.startsWith(ANTHROPIC_PREFIX)) {
      const anthropicModel = name.slice(ANTHROPIC_PREFIX.length);
      const anthropicAPIKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicAPIKey) {
        throw new MissingApiKeyError('ANTHROPIC_API_KEY');
      }
      return createAnthropic({
        apiKey: anthropicAPIKey,
      }).languageModel(anthropicModel);
    }
  
    throw new ModelNotFoundError(name);
  }
}