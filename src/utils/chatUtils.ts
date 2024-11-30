import { Bookmark } from "@/types/bookmark";

export const findRelatedBookmarks = async (query: string, bookmarks: Bookmark[]): Promise<Bookmark[]> => {
  if (!window.ai?.languageModel) {
    throw new Error("Language Model API not available");
  }

  const session = await window.ai.languageModel.create({
    systemPrompt: "You are a helpful assistant that finds relevant bookmarks based on user queries. Analyze the query and return relevant bookmarks."
  });

  try {
    const bookmarkContext = bookmarks.map(b => `${b.title} - ${b.url}`).join('\n');
    const prompt = `Query: ${query}\nBookmarks:\n${bookmarkContext}\nFind the most relevant bookmarks for this query.`;
    
    const response = await session.prompt(prompt);
    
    // Parse response to find relevant bookmarks
    const relevantBookmarks = bookmarks.filter(bookmark => 
      response.toLowerCase().includes(bookmark.title.toLowerCase()) ||
      response.toLowerCase().includes(bookmark.url.toLowerCase())
    );

    return relevantBookmarks;
  } finally {
    session.destroy();
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
    systemPrompt: "You are a helpful assistant that provides information based on bookmarks and web results. Provide clear and concise responses."
  });

  try {
    const bookmarkContext = relatedBookmarks
      .map(b => `${b.title} - ${b.url}`)
      .join('\n');

    const prompt = `
User Message: ${userMessage}
Related Bookmarks:
${bookmarkContext}

Please provide a helpful response based on the available information.`;

    const response = await session.prompt(prompt);

    // Extract any web results mentioned in the response
    const webResults = relatedBookmarks.map(bookmark => ({
      title: bookmark.title,
      url: bookmark.url
    }));

    return {
      response,
      webResults: webResults.length > 0 ? webResults : undefined
    };
  } finally {
    session.destroy();
  }
};