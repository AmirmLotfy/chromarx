import { Task } from "@/types/task";
import { toast } from "sonner";

interface TaskUpdateResult {
  updatedTasks: Task[];
  message?: string;
}

export const toggleTaskCompletion = (
  tasks: Task[],
  taskId: string,
  subtaskId?: string
): TaskUpdateResult => {
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      if (subtaskId) {
        // Toggle subtask completion
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        
        // Check if all subtasks are completed
        const allSubtasksCompleted = updatedSubtasks.every(subtask => subtask.completed);
        
        // If all subtasks are completed, mark the main task as completed
        return { 
          ...task, 
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted 
        };
      }
      // Toggle main task completion
      // If main task is being unchecked, also uncheck all subtasks
      const newCompleted = !task.completed;
      const updatedSubtasks = newCompleted 
        ? task.subtasks.map(subtask => ({ ...subtask, completed: true }))
        : task.subtasks.map(subtask => ({ ...subtask, completed: false }));
      
      return { 
        ...task, 
        completed: newCompleted,
        subtasks: updatedSubtasks 
      };
    }
    return task;
  });

  // Generate appropriate message
  let message: string | undefined;
  if (subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const subtask = task.subtasks.find(s => s.id === subtaskId);
      if (subtask) {
        message = `Subtask "${subtask.title}" ${!subtask.completed ? 'completed' : 'uncompleted'}`;
      }
    }
  } else {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      message = `Task "${task.title}" ${!task.completed ? 'completed' : 'uncompleted'}`;
    }
  }

  return { updatedTasks, message };
};