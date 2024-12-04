interface AILanguageModel {
  prompt: (input: string) => Promise<string>;
  promptStreaming: (input: string, options?: { signal?: AbortSignal }) => ReadableStream;
  countPromptTokens: (input: string) => Promise<number>;
  clone: () => Promise<AILanguageModel>;
  destroy: () => void;
  ready?: Promise<void>;
  addEventListener?: (event: string, callback: (e: any) => void) => void;
  maxTokens: number;
  tokensSoFar: number;
  tokensLeft: number;
  topK: number;
  temperature: number;
}

interface AILanguageModelCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTopK?: number;
  maxTopK?: number;
  defaultTemperature?: number;
}

interface AISummarizer {
  summarize: (text: string) => Promise<string>;
  ready?: Promise<void>;
  destroy: () => void;
  addEventListener?: (event: string, callback: (e: any) => void) => void;
}

interface AILanguageModelFactory {
  capabilities: () => Promise<AILanguageModelCapabilities>;
  create: (options?: {
    systemPrompt?: string;
    signal?: AbortSignal;
    monitor?: (monitor: AICreateMonitor) => void;
    topK?: number;
    temperature?: number;
  }) => Promise<AILanguageModel>;
}

interface AISummarizerFactory {
  capabilities: () => Promise<AILanguageModelCapabilities>;
  create: () => Promise<AISummarizer>;
}

interface AICreateMonitor extends EventTarget {
  addEventListener(type: 'downloadprogress', listener: (event: { loaded: number; total: number }) => void): void;
}

interface AI {
  languageModel: AILanguageModelFactory;
  summarizer: AISummarizerFactory;
}

interface Window {
  ai?: AI;
  translation?: Translation;
}