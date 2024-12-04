export const generateSubtasks = async (title: string, description: string): Promise<Array<{ id: string; title: string; completed: boolean }>> => {
  if (!window.ai?.languageModel) {
    throw new Error("Chrome's Language Model API not available");
  }

  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: "You are a task breakdown assistant. Given a task title and description, suggest 2-4 subtasks that would help complete the main task. Return only a JSON array of subtask titles."
    });

    const prompt = `Based on this task, suggest logical subtasks:
    Title: ${title}
    Description: ${description}
    
    Return a JSON array of subtask titles.`;

    const response = await session.prompt(prompt);
    const subtaskTitles = JSON.parse(response);
    
    return subtaskTitles.map((title: string) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      completed: false
    }));
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return [];
  }
};