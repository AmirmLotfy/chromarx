import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerTaskListProps {
  activeTaskId?: string;
  onTaskSelect: (task: Task) => void;
}

export const TimerTaskList = ({ activeTaskId, onTaskSelect }: TimerTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = () => {
    const tasksJson = localStorage.getItem('tasks');
    if (tasksJson) {
      const loadedTasks = JSON.parse(tasksJson);
      // Only show non-completed tasks
      const pendingTasks = loadedTasks.filter((task: Task) => !task.completed);
      setTasks(pendingTasks);
    }
  };

  useEffect(() => {
    // Load initial tasks
    loadTasks();

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks') {
        loadTasks();
      }
    };
    
    // Listen for custom task update events
    const handleTaskUpdate = () => loadTasks();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tasksUpdated', handleTaskUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasksUpdated', handleTaskUpdate);
    };
  }, []);

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">No pending tasks</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                "hover:bg-accent",
                activeTaskId === task.id ? "bg-accent" : "bg-background"
              )}
              onClick={() => onTaskSelect(task)}
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                )}
              </div>
              {task.suggestedDuration && (
                <div className="flex items-center text-xs text-muted-foreground ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.suggestedDuration} min
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};