import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types/bookmark";

interface TimeDistributionProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const TimeDistribution = ({ bookmarks, className }: TimeDistributionProps) => {
  const timeData = bookmarks.reduce((acc: Record<string, number>, bookmark) => {
    const date = new Date(bookmark.dateAdded);
    const hour = date.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: timeData[i] || 0,
    label: `${i}:00`
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bookmark Activity by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                interval={2}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} bookmarks`, 'Count']}
                labelFormatter={(label: string) => `Time: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#9b87f5" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};