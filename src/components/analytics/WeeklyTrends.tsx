import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bookmark } from "@/types/bookmark";
import { TrendingUp } from "lucide-react";

interface WeeklyTrendsProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const WeeklyTrends = ({ bookmarks, className }: WeeklyTrendsProps) => {
  const weeklyData = bookmarks.reduce((acc: any[], bookmark) => {
    const date = new Date(bookmark.dateAdded);
    const week = `Week ${Math.ceil((date.getDate()) / 7)}`;
    const existingWeek = acc.find(w => w.week === week);
    
    if (existingWeek) {
      existingWeek.count += 1;
      existingWeek.productivity = Math.min(100, existingWeek.count * 10);
    } else {
      acc.push({
        week,
        count: 1,
        productivity: 10
      });
    }
    
    return acc;
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Weekly Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="#9b87f5" 
                name="Productivity"
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#22c55e" 
                name="Bookmarks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
