import { OpenAIConfig } from './types';

export const openAIConfig: OpenAIConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  orgId: import.meta.env.VITE_OPENAI_ORG_ID,
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
};
