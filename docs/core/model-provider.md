# Model provider

A model provider resolves a model by name. Note that the returned [`LLMModel`](/api/interfaces/LLMModel.md) contains `LanguageModel` which comes from [AI SDK](https://ai-sdk.dev/).

```ts
import { LLMModel } from '@gettoor/core';

interface ModelProvider {
  getModel(name: string): Promise<LLMModel>;
}
```

# Default model provider

Toor provides a default model provider ([`DefaultModelProvider`](/api/classes/DefaultModelProvider.md)) implementation that supports Gemini, OpenAI and Anthropic. It maps a model name to a model by checking prefix which can be:
- `gemini:` (e.g. `gemini:gemini-3.5-flash`)
- `openai:` (e.g. `openai:gpt-4o-mini`)
- `anthropic:` (e.g. `anthropic:claude-3.5-sonnet`)

It takes the API keys from the environment variables:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

If the API key is not set in the environment variables, it throws a [`MissingApiKeyError`](/api/classes/MissingApiKeyError.md).

```ts
import { DefaultModelProvider } from '@gettoor/core';

const provider = new DefaultModelProvider();
const model = await provider.getModel('gemini:gemini-3.5-flash');
```