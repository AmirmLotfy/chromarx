export const verifyAIModels = async () => {
  if (!window.ai?.languageModel) {
    throw new Error("Chrome's Language Model API not available");
  }

  const capabilities = await window.ai.languageModel.capabilities();
  if (capabilities.available === "no") {
    throw new Error("Chrome's Language Model is not available on this device");
  }

  return true;
};

export const generateAIResponse = async (prompt: string): Promise<string> => {
  await verifyAIModels();
  
  const session = await window.ai.languageModel.create({
    systemPrompt: prompt,
    temperature: 0.7,
    topK: 40,
  });

  try {
    const response = await session.prompt(prompt);
    return response;
  } finally {
    session.destroy();
  }
};

export const generateSummary = async (text: string): Promise<string> => {
  const prompt = `Please summarize the following text concisely:\n\n${text}`;
  return generateAIResponse(prompt);
};

export const generateProductivityTips = async (score: number): Promise<string[]> => {
  const prompt = `Based on a productivity score of ${score}/100, provide 3 specific, actionable tips to improve productivity. Format each tip on a new line.`;
  const response = await generateAIResponse(prompt);
  
  // Split response into array of tips and clean up
  return response
    .split('\n')
    .map(tip => tip.trim())
    .filter(tip => tip.length > 0)
    .slice(0, 3);
};