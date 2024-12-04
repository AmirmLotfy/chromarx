export interface ProductivityMetrics {
  totalTimeSpent: number;
  completionRate: number;
  averageSessionLength: number;
  mostProductiveHour: number;
  tasksCompleted: number;
}

export interface TaskTimerData {
  taskId: string;
  taskTitle: string;
  totalTime: number;
  completedSessions: number;
  incompleteSessions: number;
  lastSessionDate: string;
  averageSessionDuration: number;
}