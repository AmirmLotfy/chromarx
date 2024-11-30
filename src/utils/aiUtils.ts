export const generatePrompt = async (context: string, customPrompt?: string): Promise<string> => {
  if (!window.ai?.languageModel) {
    throw new Error("Chrome's Language Model API not available");
  }

  try {
    const capabilities = await window.ai.languageModel.capabilities();
    if (capabilities.available === "no") {
      throw new Error("Chrome's Language Model is not available on this device");
    }

    const session = await window.ai.languageModel.create({
      systemPrompt: customPrompt || "You are a bookmark categorization assistant. Suggest a single category from these options: Work, Personal, Shopping, Reading, Entertainment, Social, News, Development, Education, or Other. Only return the category name, nothing else."
    });

    const response = await session.prompt(context);
    session.destroy();

    // Clean up the response to ensure we only get the category name
    const category = response.trim()
      .split('\n')[0]
      .replace(/[."',]$/g, '')
      .trim();

    const validCategories = [
      'Work', 'Personal', 'Shopping', 'Reading', 'Entertainment',
      'Social', 'News', 'Development', 'Education', 'Other'
    ];

    const matchedCategory = validCategories.find(c => c.toLowerCase() === category.toLowerCase());
    if (!matchedCategory) {
      throw new Error(`Invalid category received: ${category}`);
    }
    
    return matchedCategory;
  } catch (error) {
    console.error('Category suggestion error:', error);
    throw error;
  }
};

export const generateSummary = async (url: string): Promise<string> => {
  if (!window.ai?.summarizer) {
    throw new Error("Chrome's Summarizer API not available");
  }

  try {
    const capabilities = await window.ai.summarizer.capabilities();
    if (capabilities.available === "no") {
      throw new Error("Chrome's Summarizer is not available on this device");
    }

    const summarizer = await window.ai.summarizer.create();
    const summary = await summarizer.summarize(url);
    summarizer.destroy();
    
    return summary.trim();
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
};

export const checkAICapabilities = async (): Promise<boolean> => {
  if (!window.ai?.languageModel) return false;
  
  try {
    const capabilities = await window.ai.languageModel.capabilities();
    return capabilities.available === "readily";
  } catch {
    return false;
  }
};