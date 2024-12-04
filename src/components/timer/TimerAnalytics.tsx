import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ProductivityCharts } from "./ProductivityCharts";
import { TaskTimerData, ProductivityMetrics } from "@/types/analytics";

export const TimerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<TaskTimerData[]>([]);
  const [metrics, setMetrics] = useState<ProductivityMetrics>({
    totalTimeSpent: 0,
    completionRate: 0,
    averageSessionLength: 0,
    mostProductiveHour: 0,
    tasksCompleted: 0,
  });

  useEffect(() => {
    // Get all tasks
    const tasksJson = localStorage.getItem('tasks');
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    // Calculate analytics for each task
    const data: TaskTimerData[] = tasks
      .map((task: any) => {
        const timerLogsJson = localStorage.getItem(`timerLog-${task.id}`);
        const timerLogs = timerLogsJson ? JSON.parse(timerLogsJson) : [];
        
        if (timerLogs.length === 0) return null;

        const totalTime = timerLogs.reduce((acc: number, log: any) => {
          const duration = typeof log.duration === 'number' ? log.duration : 0;
          return acc + duration;
        }, 0);

        const completedSessions = timerLogs.length;
        const lastSession = timerLogs[timerLogs.length - 1];
        
        return {
          taskId: task.id,
          taskTitle: task.title,
          totalTime,
          completedSessions,
          incompleteSessions: 0,
          lastSessionDate: lastSession?.startTime || new Date().toISOString(),
          averageSessionDuration: completedSessions ? totalTime / completedSessions : 0
        };
      })
      .filter((data: TaskTimerData | null) => data !== null);

    setAnalyticsData(data);

    // Calculate metrics
    const totalTimeSpent = data.reduce((acc, task) => acc + task.totalTime, 0);
    const totalSessions = data.reduce((acc, task) => acc + task.completedSessions, 0);
    
    // Calculate most productive hour
    const hourlyDistribution: { [key: number]: number } = {};
    data.forEach(task => {
      const date = new Date(task.lastSessionDate);
      const hour = date.getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + task.completedSessions;
    });

    const mostProductiveHour = Object.entries(hourlyDistribution)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "0";

    setMetrics({
      totalTimeSpent,
      completionRate: totalSessions ? 100 : 0,
      averageSessionLength: totalSessions ? totalTimeSpent / totalSessions : 0,
      mostProductiveHour: parseInt(mostProductiveHour),
      tasksCompleted: totalSessions,
    });
  }, []);

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    completed: analyticsData.reduce((acc, task) => {
      const taskHour = new Date(task.lastSessionDate).getHours();
      return acc + (taskHour === hour ? task.completedSessions : 0);
    }, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm">
            <div className="font-medium">Total Time</div>
            <div className="text-2xl font-bold">
              {Math.round(metrics.totalTimeSpent / 60)}m
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm">
            <div className="font-medium">Tasks Completed</div>
            <div className="text-2xl font-bold">{metrics.tasksCompleted}</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm">
            <div className="font-medium">Most Productive Hour</div>
            <div className="text-2xl font-bold">{metrics.mostProductiveHour}:00</div>
          </div>
        </Card>
      </div>

      <ProductivityCharts 
        analyticsData={analyticsData}
        hourlyData={hourlyData}
      />

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Task Details</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {analyticsData.map((data) => (
              <Card key={data.taskId} className="p-3">
                <div className="text-sm">
                  <div className="font-medium">{data.taskTitle}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Total Time: {Math.round(data.totalTime / 60)} minutes</div>
                    <div>Completed Sessions: {data.completedSessions}</div>
                    <div>Last Session: {formatDistanceToNow(new Date(data.lastSessionDate))} ago</div>
                    <div>Average Session: {Math.round(data.averageSessionDuration / 60)} minutes</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};