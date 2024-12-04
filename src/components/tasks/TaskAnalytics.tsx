import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, BarChart2 } from "lucide-react";

interface TaskAnalyticsProps {
  tasks: Task[];
}

export const TaskAnalytics = ({ tasks }: TaskAnalyticsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const dueSoonTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }).length;

  const stats = [
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: "text-green-500",
      progress: completionRate
    },
    {
      title: "High Priority",
      value: highPriorityTasks,
      icon: AlertTriangle,
      color: "text-red-500",
      progress: totalTasks ? (highPriorityTasks / totalTasks) * 100 : 0
    },
    {
      title: "Due Soon",
      value: dueSoonTasks,
      icon: Clock,
      color: "text-yellow-500",
      progress: totalTasks ? (dueSoonTasks / totalTasks) * 100 : 0
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: BarChart2,
      color: "text-blue-500",
      progress: 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <Progress value={stat.progress} className="h-2" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};