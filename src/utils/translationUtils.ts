export type SupportedLanguage = 'en' | 'es' | 'ja' | 'fr' | 'ar' | 'zh';

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  ja: '日本語',
  fr: 'Français',
  ar: 'العربية',
  zh: '中文'
};

export const translateText = async (text: string, targetLang: SupportedLanguage): Promise<string> => {
  if (!window.translation) {
    throw new Error('Translation API not available');
  }

  try {
    const languagePair = {
      sourceLanguage: 'en',
      targetLanguage: targetLang,
    };

    const canTranslate = await window.translation.canTranslate(languagePair);
    
    if (canTranslate === 'no') {
      console.warn(`Translation not available for language pair en -> ${targetLang}`);
      return text;
    }

    const translator = await window.translation.createTranslator(languagePair);
    
    if (canTranslate === 'after-download' && translator.ready) {
      if (translator.addEventListener) {
        translator.addEventListener('downloadprogress', (e: any) => {
          console.log(`Downloading translation model: ${Math.round((e.loaded / e.total) * 100)}%`);
        });
      }
      await translator.ready;
    }

    const translatedText = await translator.translate(text);
    return translatedText.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const checkTranslationAvailability = async (targetLang: SupportedLanguage): Promise<boolean> => {
  if (!window.translation) return false;
  
  try {
    const canTranslate = await window.translation.canTranslate({
      sourceLanguage: 'en',
      targetLanguage: targetLang
    });
    
    return canTranslate === 'readily';
  } catch {
    return false;
  }
};