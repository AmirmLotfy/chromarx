import { Bookmark } from "@/types/bookmark";
import { searchGoogle } from "./searchUtils";

export const findRelatedBookmarks = async (query: string, bookmarks: Bookmark[]): Promise<Bookmark[]> => {
  if (!window.ai?.languageModel) {
    throw new Error("Language Model API not available");
  }

  const session = await window.ai.languageModel.create({
    systemPrompt: "Find relevant bookmarks based on the query. Return only the most relevant matches.",
    temperature: 0.3, // Lower temperature for more focused results
    topK: 5, // Limit results for faster processing
  });

  try {
    const bookmarkContext = bookmarks.map(b => `${b.title} - ${b.url}`).join('\n');
    const prompt = `Query: ${query}\nBookmarks:\n${bookmarkContext}\nFind the most relevant bookmarks for this query.`;
    
    const response = await session.prompt(prompt);
    
    return bookmarks.filter(bookmark => 
      response.toLowerCase().includes(bookmark.title.toLowerCase()) ||
      response.toLowerCase().includes(bookmark.url.toLowerCase())
    ).slice(0, 5); // Limit to top 5 results
  } finally {
    await session.destroy();
  }
};

export const generateChatResponse = async (
  userMessage: string,
  relatedBookmarks: Bookmark[]
): Promise<{
  response: string;
  webResults?: Array<{ title: string; url: string }>;
}> => {
  if (!window.ai?.languageModel) {
    throw new Error("Language Model API not available");
  }

  const session = await window.ai.languageModel.create({
    systemPrompt: "You are a helpful assistant that provides concise, accurate responses based on bookmarks and web results.",
    temperature: 0.7,
    topK: 40,
  });

  try {
    // Get web results in parallel with AI processing
    const webResultsPromise = searchGoogle(userMessage);
    
    const bookmarkContext = relatedBookmarks
      .map(b => `${b.title} - ${b.url}`)
      .join('\n');

    const prompt = `
User Message: ${userMessage}
Related Bookmarks:
${bookmarkContext}

Provide a helpful, concise response based on the available information.`;

    const [response, webResults] = await Promise.all([
      session.prompt(prompt),
      webResultsPromise
    ]);

    return {
      response,
      webResults: webResults.length > 0 ? webResults : undefined
    };
  } finally {
    await session.destroy();
  }
};