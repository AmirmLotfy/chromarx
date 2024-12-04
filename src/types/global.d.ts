interface TranslationLanguageOptions {
  sourceLanguage: string;
  targetLanguage: string;
}

interface LanguageTranslator {
  translate(input: string): Promise<string>;
  ready?: Promise<void>;
  addEventListener?(type: string, listener: (event: any) => void): void;
}

interface Translation {
  canTranslate(options: TranslationLanguageOptions): Promise<'readily' | 'after-download' | 'no'>;
  createTranslator(options: TranslationLanguageOptions): Promise<LanguageTranslator>;
}

interface Window {
  translation?: Translation;
  ai?: {
    languageModel?: {
      capabilities(): Promise<{ available: 'readily' | 'after-download' | 'no' }>;
      create(options: {
        model: string;
        monitor?: (monitor: any) => void;
      }): Promise<{
        generateText(prompt: string): Promise<string>;
        destroy(): void;
        ready?: Promise<void>;
        addEventListener?: (event: string, callback: (e: any) => void) => void;
      }>;
    };
    summarizer?: {
      capabilities(): Promise<{ available: 'readily' | 'after-download' | 'no' }>;
      create(): Promise<{
        summarize(text: string): Promise<string>;
        ready: Promise<void>;
        destroy(): void;
      }>;
    };
  };
}