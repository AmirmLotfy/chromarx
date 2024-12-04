import { TaskTimerData, ProductivityMetrics } from "@/types/analytics";

export const calculateProductivityMetrics = (taskData: TaskTimerData[]): ProductivityMetrics => {
  const totalSessions = taskData.reduce((acc, task) => 
    acc + task.completedSessions + task.incompleteSessions, 0);
  
  const totalCompleted = taskData.reduce((acc, task) => 
    acc + task.completedSessions, 0);
  
  const totalTime = taskData.reduce((acc, task) => 
    acc + task.totalTime, 0);

  // Calculate most productive hour
  const hourlyDistribution: { [key: number]: number } = {};
  taskData.forEach(task => {
    const date = new Date(task.lastSessionDate);
    const hour = date.getHours();
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + task.completedSessions;
  });

  const mostProductiveHour = Object.entries(hourlyDistribution)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "0";

  return {
    totalTimeSpent: totalTime,
    completionRate: totalSessions ? (totalCompleted / totalSessions) * 100 : 0,
    averageSessionLength: totalSessions ? totalTime / totalSessions : 0,
    mostProductiveHour: parseInt(mostProductiveHour),
    tasksCompleted: totalCompleted,
  };
};