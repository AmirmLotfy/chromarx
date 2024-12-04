import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart } from "lucide-react";
import { TimerTaskList } from "./TimerTaskList";
import { TimerAnalytics } from "./TimerAnalytics";
import { useTimerStore } from "@/stores/timerStore";
import { Task } from "@/types/task";
import { toast } from "sonner";

export const TaskAnalyticsCard = () => {
  const { setActiveTask, activeTask, setTimeLeft, setWorkDuration } = useTimerStore();

  const handleTaskSelect = (task: Task) => {
    setActiveTask(task);
    if (task.suggestedDuration) {
      setWorkDuration(task.suggestedDuration);
      setTimeLeft(task.suggestedDuration * 60);
      toast.success(`Timer set to ${task.suggestedDuration} minutes for task: ${task.title}`);
    }
  };

  return (
    <Card>
      <Tabs defaultValue="tasks">
        <CardHeader>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="tasks">
                <List className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="tasks">
            <TimerTaskList 
              activeTaskId={activeTask?.id}
              onTaskSelect={handleTaskSelect}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <TimerAnalytics />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};