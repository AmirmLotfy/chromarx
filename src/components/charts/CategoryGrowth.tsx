import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types/bookmark";

interface CategoryGrowthProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const CategoryGrowth = ({ bookmarks, className }: CategoryGrowthProps) => {
  const sortedBookmarks = [...bookmarks].sort((a, b) => a.dateAdded - b.dateAdded);
  
  const growthData = sortedBookmarks.reduce((acc: any[], bookmark) => {
    const date = new Date(bookmark.dateAdded);
    const dateStr = date.toLocaleDateString();
    
    const lastEntry = acc[acc.length - 1] || { total: 0, categories: new Set() };
    const newCategories = new Set(lastEntry.categories);
    
    if (bookmark.category) {
      newCategories.add(bookmark.category);
    }
    
    acc.push({
      date: dateStr,
      total: lastEntry.total + 1,
      categories: newCategories,
      uniqueCategories: newCategories.size
    });
    
    return acc;
  }, []);

  // Take only every nth point to avoid overcrowding
  const step = Math.max(1, Math.floor(growthData.length / 20));
  const displayData = growthData.filter((_, index) => index % step === 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bookmark & Category Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                interval={Math.floor(displayData.length / 5)}
                fontSize={12}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#9b87f5"
                name="Total Bookmarks"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uniqueCategories"
                stroke="#22c55e"
                name="Unique Categories"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
