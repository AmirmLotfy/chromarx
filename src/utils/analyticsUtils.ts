import { Bookmark } from "@/types/bookmark";

export const calculateProductivityScore = async (bookmarks: Bookmark[]): Promise<number> => {
  if (!window.ai?.languageModel || bookmarks.length === 0) {
    return 0;
  }

  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: "You are a productivity scoring assistant. Analyze bookmark data and return a score from 0-100 based on organization, categorization, and usage patterns. Return only the number."
    });

    const bookmarkData = bookmarks.map(b => ({
      title: b.title,
      category: b.category,
      dateAdded: b.dateAdded,
      url: b.url
    }));

    const response = await session.prompt(
      `Calculate a productivity score (0-100) for this bookmark collection based on:
      - Category organization (well-organized categories score higher)
      - Time distribution (balanced usage across time periods)
      - Domain diversity (appropriate mix of domains)
      - Usage patterns (regular, consistent usage)
      
      Analysis data: ${JSON.stringify(bookmarkData)}
      
      Return only the number.`
    );

    session.destroy();

    const score = parseInt(response.trim());
    return isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Error calculating productivity score:', error);
    return 0;
  }
};

export const analyzeTrends = (bookmarks: Bookmark[]) => {
  const categoryTrends = bookmarks.reduce((acc: Record<string, number>, bookmark) => {
    const category = bookmark.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const timeBasedUsage = bookmarks.reduce((acc: Record<string, number>, bookmark) => {
    const hour = new Date(bookmark.dateAdded).getHours();
    const timeSlot = `${hour}:00`;
    acc[timeSlot] = (acc[timeSlot] || 0) + 1;
    return acc;
  }, {});

  return {
    categoryTrends,
    timeBasedUsage,
    predictedCategories: getPredictedCategories(categoryTrends),
    activeHours: getActiveHours(timeBasedUsage),
  };
};

const getPredictedCategories = (trends: Record<string, number>) => {
  return Object.entries(trends)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
};

const getActiveHours = (timeUsage: Record<string, number>) => {
  return Object.entries(timeUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => hour);
};