import { TaskTimerData } from "@/types/analytics";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface ProductivityChartsProps {
  analyticsData: TaskTimerData[];
  hourlyData: { hour: number; completed: number }[];
}

export const ProductivityCharts = ({ analyticsData, hourlyData }: ProductivityChartsProps) => {
  const COLORS = ['#9b87f5', '#D6BCFA', '#6E59A5', '#E5DEFF', '#FFDEE2'];

  const pieData = analyticsData.map(data => ({
    name: data.taskTitle,
    value: Math.round(data.totalTime / 60), // Convert seconds to minutes
  }));

  return (
    <>
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Time Distribution by Task</h3>
        <div className="h-[200px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} minutes`, 'Time Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No timer data available
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Hourly Task Completion</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#9b87f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};