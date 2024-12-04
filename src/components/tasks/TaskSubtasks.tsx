import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskSubtasksProps {
  subtasks: Subtask[];
  onToggleSubtask: (subtaskId: string) => void;
  taskId: string;
}

export const TaskSubtasks = ({ subtasks, onToggleSubtask, taskId }: TaskSubtasksProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="ml-8 space-y-2"
    >
      {subtasks.map((subtask) => (
        <motion.div
          key={subtask.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center space-x-2 text-sm"
        >
          <Button
            variant={subtask.completed ? "default" : "outline"}
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubtask(subtask.id);
            }}
            className={cn(
              "h-6 w-6 rounded-full",
              subtask.completed ? "bg-primary hover:bg-primary/90" : "hover:border-primary border-2"
            )}
          >
            {subtask.completed && (
              <Check className="h-3 w-3 text-background animate-in zoom-in duration-200" />
            )}
          </Button>
          <span className={cn(
            "transition-colors duration-200",
            subtask.completed ? 'line-through text-muted-foreground' : ''
          )}>
            {subtask.title}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};