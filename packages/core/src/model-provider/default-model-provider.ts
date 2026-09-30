/**
 * A default model provider implementation.
 */
import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { createAnthropic, anthropic } from '@ai-sdk/anthropic';

import { MissingApiKeyError } from '../errors/index.js';
import { EmbeddingModel, LLMModel } from '../llm/index.js';
import { ModelNotFoundError } from './model-provider-errors.js';
import { ModelProvider } from './model-provider.js';

/**
 * A default model provider implementation. Supports Gemini, OpenAI
 * and Anthropic. There is no embedding model support for Anthropic.
 * 
 * Model names are prefixed with the provider name:
 * - `gemini:<model>`
 * - `openai:<model>`
 * - `anthropic:<model>`
 * 
 * It takes the keys from the environment variables:
 * - `GEMINI_API_KEY`
 * - `OPENAI_API_KEY`
 * - `ANTHROPIC_API_KEY`
 * 
 * @example
 * ```ts
 * const provider = new DefaultModelProvider();
 * const model = await provider.getModel('gemini:gemini-3.5-flash');
 * ```
 * @category Model Provider
 */
export class DefaultModelProvider implements ModelProvider {
  private static readonly GEMINI_PREFIX = 'gemini:';
  private static readonly OPENAI_PREFIX = 'openai:';
  private static readonly ANTHROPIC_PREFIX = 'anthropic:';

  public async getModel(name: string): Promise<LLMModel> {
    // gemini
    if (name.startsWith(DefaultModelProvider.GEMINI_PREFIX)) {
      const modelId = name.slice(DefaultModelProvider.GEMINI_PREFIX.length);
      const geminiAPIKey = process.env.GEMINI_API_KEY;
      if (!geminiAPIKey) {
        throw new MissingApiKeyError('GEMINI_API_KEY');
      }
      const model = createGoogleGenerativeAI({
        apiKey: geminiAPIKey,
      }).languageModel(modelId);
      return {
        name: modelId,
        model,
      };
    }
  
    // openai
    if (name.startsWith(DefaultModelProvider.OPENAI_PREFIX)) {
      const modelId = name.slice(DefaultModelProvider.OPENAI_PREFIX.length);
      const openaiAPIKey = process.env.OPENAI_API_KEY;
      if (!openaiAPIKey) {
        throw new MissingApiKeyError('OPENAI_API_KEY');
      }
      const model = createOpenAI({
        apiKey: openaiAPIKey,
      }).languageModel(modelId);
      return {
        name: modelId,
        model,
      };
    }

    // anthropic
    if (name.startsWith(DefaultModelProvider.ANTHROPIC_PREFIX)) {
      const modelId = name.slice(
        DefaultModelProvider.ANTHROPIC_PREFIX.length,
      );
      const anthropicAPIKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicAPIKey) {
        throw new MissingApiKeyError('ANTHROPIC_API_KEY');
      }
      const model = createAnthropic({
        apiKey: anthropicAPIKey,
      }).languageModel(modelId);
      return {
        name: modelId,
        model,
      };
    }
  
    throw new ModelNotFoundError(name);
  }

  public async getEmbeddingModel(name: string): Promise<EmbeddingModel> {
    // gemini
    if (name.startsWith(DefaultModelProvider.GEMINI_PREFIX)) {
      const modelId = name.slice(DefaultModelProvider.GEMINI_PREFIX.length);
      const geminiAPIKey = process.env.GEMINI_API_KEY;
      if (!geminiAPIKey) {
        throw new MissingApiKeyError('GEMINI_API_KEY');
      }
      const model = createGoogleGenerativeAI({
        apiKey: geminiAPIKey,
      }).embeddingModel(modelId);
      return {
        name: modelId,
        model,
      };
    }

    // openai
    if (name.startsWith(DefaultModelProvider.OPENAI_PREFIX)) {
      const modelId = name.slice(DefaultModelProvider.OPENAI_PREFIX.length);
      const openaiAPIKey = process.env.OPENAI_API_KEY;
      if (!openaiAPIKey) {
        throw new MissingApiKeyError('OPENAI_API_KEY');
      }
      const model = createOpenAI({
        apiKey: openaiAPIKey,
      }).embeddingModel(modelId);
      return {
        name: modelId,
        model,
      };
    }

    throw new ModelNotFoundError(name);
  }

  public getProviderModelName(name: string): string {
    if (name.startsWith(DefaultModelProvider.GEMINI_PREFIX)) {
      return name.slice(DefaultModelProvider.GEMINI_PREFIX.length);
    }
    if (name.startsWith(DefaultModelProvider.OPENAI_PREFIX)) {
      return name.slice(DefaultModelProvider.OPENAI_PREFIX.length);
    }
    if (name.startsWith(DefaultModelProvider.ANTHROPIC_PREFIX)) {
      return name.slice(DefaultModelProvider.ANTHROPIC_PREFIX.length);
    }
    throw new ModelNotFoundError(name);
  }
}