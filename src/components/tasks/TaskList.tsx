import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { TaskNotes } from "./TaskNotes";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, subtaskId?: string) => void;
  onAddNote: (taskId: string, note: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
}

export const TaskList = ({ tasks, onToggleComplete, onAddNote, onDeleteTask, onEditTask }: TaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-center">No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onClick={() => setSelectedTask(task)}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))
      )}
    </div>
  );
};