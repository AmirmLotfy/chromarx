import { Bookmark } from "@/types/bookmark";

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