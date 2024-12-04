import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bookmark, Category } from "@/types/bookmark";
import { FolderOpen } from "lucide-react";

interface DetailedCategoryAnalyticsProps {
  categories: Category[];
  bookmarks: Bookmark[];
  className?: string;
}

const CHART_COLORS = {
  primary: "#9b87f5",
  secondary: "#22c55e",
  accent: "#f59b87",
  muted: "#64748b"
};

export const DetailedCategoryAnalytics = ({ categories, bookmarks, className }: DetailedCategoryAnalyticsProps) => {
  const categoryData = categories.map(category => {
    const categoryBookmarks = bookmarks.filter(b => b.category === category.name);
    return {
      name: category.name,
      count: categoryBookmarks.length,
      productivity: Math.round(Math.random() * 100) // This would be replaced with actual productivity calculation
    };
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Detailed Category Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
                cursor={{ fill: 'var(--primary-foreground)', opacity: 0.1 }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="count" 
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
                name="Bookmark Count"
                className="hover:opacity-80 transition-opacity"
              />
              <Bar 
                yAxisId="right" 
                dataKey="productivity" 
                fill={CHART_COLORS.secondary}
                radius={[4, 4, 0, 0]}
                name="Productivity Score"
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};