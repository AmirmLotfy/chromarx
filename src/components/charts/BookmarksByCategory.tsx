import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/bookmark";

interface BookmarksByCategoryProps {
  categories: Category[];
  bookmarkCounts: Record<string, number>;
  className?: string;
}

export const BookmarksByCategory = ({ categories, bookmarkCounts, className }: BookmarksByCategoryProps) => {
  const data = categories.map(category => ({
    name: category.name,
    value: bookmarkCounts[category.name] || 0
  }));

  const COLORS = [
    '#9b87f5', '#D6BCFA', '#6E59A5', '#E5DEFF', 
    '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F2FCE2',
    '#FEF7CD', '#F1F0FB'
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bookmarks by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
