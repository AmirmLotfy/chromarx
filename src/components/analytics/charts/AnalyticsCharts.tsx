import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Category } from "@/types/bookmark";
import { BookmarksByCategory } from "@/components/charts/BookmarksByCategory";
import { TimeDistribution } from "@/components/charts/TimeDistribution";
import { CategoryGrowth } from "@/components/charts/CategoryGrowth";
import { WeeklyTrends } from "@/components/analytics/WeeklyTrends";

interface AnalyticsChartsProps {
  bookmarks: Bookmark[];
  categories: Category[];
}

export const AnalyticsCharts = ({ bookmarks, categories }: AnalyticsChartsProps) => {
  const bookmarkCounts = categories.reduce((acc, category) => {
    acc[category.name] = bookmarks.filter(b => b.category === category.name).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BookmarksByCategory
        categories={categories}
        bookmarkCounts={bookmarkCounts}
        className="col-span-1"
      />
      <TimeDistribution
        bookmarks={bookmarks}
        className="col-span-1"
      />
      <CategoryGrowth
        bookmarks={bookmarks}
        className="col-span-1"
      />
      <WeeklyTrends
        bookmarks={bookmarks}
        className="col-span-1"
      />
    </div>
  );
};