export const getSuggestedTimeFrame = async (title: string, description: string): Promise<number> => {
  if (!window.ai?.languageModel) {
    throw new Error("Chrome's Language Model API not available");
  }

  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: "You are a task time estimation assistant. Analyze the task and suggest a reasonable time frame in minutes. Only return a number representing minutes, nothing else."
    });

    const prompt = `Based on this task, suggest a reasonable time frame in minutes:
    Title: ${title}
    Description: ${description}
    
    Consider:
    - Task complexity
    - Required focus
    - Similar task patterns
    
    Return only a number representing minutes.`;

    const response = await session.prompt(prompt);
    session.destroy();

    const minutes = parseInt(response.trim());
    return isNaN(minutes) ? 25 : minutes; // Default to 25 minutes if parsing fails
  } catch (error) {
    console.error("Error estimating time:", error);
    return 25; // Default to 25 minutes on error
  }
};