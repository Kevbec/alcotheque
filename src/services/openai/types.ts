import { SpiritType } from '../../types/bottle';

export interface RecognitionResult {
  name: string;
  type: SpiritType;
  year?: string;
  estimatedValue?: number;
  photo?: string;
}

export interface ImageAnalysisRequest {
  model: string;
  messages: Array<{
    role: string;
    content: Array<{
      type: string;
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
  max_tokens: number;
}

export interface OpenAIConfig {
  apiKey: string;
  orgId?: string;
  apiUrl: string;
  model: string;
}