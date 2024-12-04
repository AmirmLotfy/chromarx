import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Clock, AlertTriangle, Target, Calendar, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KeyMetrics } from "./analytics/KeyMetrics";
import { InsightsList } from "./analytics/InsightsList";

interface TaskAIAnalyticsProps {
  tasks: Task[];
}

interface AIInsight {
  type: 'productivity' | 'time' | 'category' | 'priority' | 'suggestion';
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const TaskAIAnalytics = ({ tasks }: TaskAIAnalyticsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    if (!window.ai?.languageModel) {
      toast({
        title: "AI Not Available",
        description: "Chrome's AI capabilities are not available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const session = await window.ai.languageModel.create({
        systemPrompt: `You are a task management analytics assistant. Analyze the tasks and provide insights about:
          1. Productivity patterns and completion rates
          2. Time management and due dates
          3. Category distribution and focus areas
          4. Priority balance and urgent tasks
          5. Actionable suggestions for improvement
          Return insights as a JSON array with each insight having: type, title, description.`
      });

      const taskData = tasks.map(task => ({
        title: task.title,
        priority: task.priority,
        completed: task.completed,
        category: task.category,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));

      const prompt = `Analyze these tasks and provide detailed insights:
        ${JSON.stringify(taskData, null, 2)}
        
        Consider:
        - Completion rates and patterns
        - Time management effectiveness
        - Category distribution
        - Priority balance
        - Potential bottlenecks
        - Areas for improvement
        
        Return insights as a JSON array.`;

      const response = await session.prompt(prompt);
      const parsedInsights = JSON.parse(response);
      
      const formattedInsights: AIInsight[] = parsedInsights.map((insight: any) => ({
        ...insight,
        icon: getInsightIcon(insight.type),
        color: getInsightColor(insight.type)
      }));

      setInsights(formattedInsights);
      session.destroy();
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate task insights",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'productivity': return CheckCircle2;
      case 'time': return Clock;
      case 'category': return Target;
      case 'priority': return AlertTriangle;
      case 'suggestion': return Brain;
      default: return TrendingUp;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'productivity': return 'text-green-500';
      case 'time': return 'text-blue-500';
      case 'category': return 'text-purple-500';
      case 'priority': return 'text-red-500';
      case 'suggestion': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      generateInsights();
    }
  }, [tasks]);

  // Calculate metrics
  const completionRate = tasks.length > 0
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100
    : 0;

  const dueSoonTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }).length;

  const highPriorityTasks = tasks.filter(t => t.priority === "high" && !t.completed).length;

  return (
    <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> AI Task Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <KeyMetrics
          completionRate={completionRate}
          dueSoonTasks={dueSoonTasks}
          highPriorityTasks={highPriorityTasks}
        />
        
        <InsightsList insights={insights} isLoading={isLoading} />

        {tasks.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Add tasks to see AI analytics</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};