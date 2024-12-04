import { Task } from "@/types/task";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TaskStatusButton } from "./TaskStatusButton";
import { TaskContent } from "./TaskContent";
import { TaskActions } from "./TaskActions";
import { TaskSubtasks } from "./TaskSubtasks";
import { TaskTimerLog } from "./TaskTimerLog";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, subtaskId?: string) => void;
  onClick: () => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskItem = ({ task, onToggleComplete, onClick, onDeleteTask, onEditTask }: TaskItemProps) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleEditSave = () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    onEditTask(task.id, {
      title: editTitle,
      description: editDescription,
      updatedAt: new Date()
    });
    setIsEditing(false);
    toast.success("Task updated successfully");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-2"
    >
      <div 
        className={cn(
          "border rounded-lg p-4 transition-all duration-200",
          "hover:border-primary/50 hover:shadow-sm",
          task.completed ? "bg-muted/50" : "bg-background"
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-grow">
            <TaskStatusButton
              completed={task.completed}
              onToggle={() => onToggleComplete(task.id)}
            />

            <TaskContent
              title={task.title}
              description={task.description}
              completed={task.completed}
              dueDate={task.dueDate}
              updatedAt={task.updatedAt}
              isEditing={isEditing}
              editTitle={editTitle}
              editDescription={editDescription}
              onEditTitleChange={setEditTitle}
              onEditDescriptionChange={setEditDescription}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          </div>

          <TaskActions
            priority={task.priority}
            category={task.category}
            isEditing={isEditing}
            hasSubtasks={task.subtasks.length > 0}
            showSubtasks={showSubtasks}
            onEdit={handleEditClick}
            onDelete={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            onToggleSubtasks={(e) => {
              e.stopPropagation();
              setShowSubtasks(!showSubtasks);
            }}
            taskId={task.id}
            taskTitle={task.title}
          />
        </div>
        
        <TaskTimerLog task={task} />
      </div>
      
      <AnimatePresence>
        {showSubtasks && task.subtasks.length > 0 && (
          <TaskSubtasks
            subtasks={task.subtasks}
            onToggleSubtask={(subtaskId) => onToggleComplete(task.id, subtaskId)}
            taskId={task.id}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};