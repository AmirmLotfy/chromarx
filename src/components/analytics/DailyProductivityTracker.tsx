import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bookmark } from "@/types/bookmark";
import { Clock } from "lucide-react";

interface DailyProductivityTrackerProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const DailyProductivityTracker = ({ bookmarks, className }: DailyProductivityTrackerProps) => {
  const dailyData = bookmarks.reduce((acc: any[], bookmark) => {
    const date = new Date(bookmark.dateAdded).toLocaleDateString();
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      existingDay.count += 1;
      existingDay.score = Math.min(100, existingDay.count * 10);
    } else {
      acc.push({
        date,
        count: 1,
        score: 10
      });
    }
    
    return acc;
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Daily Productivity Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#9b87f5" 
                name="Productivity Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};