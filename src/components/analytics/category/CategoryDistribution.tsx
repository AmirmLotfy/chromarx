import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bookmark, Category } from "@/types/bookmark";
import { FolderOpen } from "lucide-react";

interface CategoryDistributionProps {
  bookmarks: Bookmark[];
  categories: Category[];
  className?: string;
}

export const CategoryDistribution = ({ bookmarks, categories, className }: CategoryDistributionProps) => {
  const categoryData = categories.map(category => {
    const categoryBookmarks = bookmarks.filter(b => b.category === category.name);
    return {
      name: category.name,
      count: categoryBookmarks.length,
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Content Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};