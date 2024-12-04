import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskTimer } from "./TaskTimer";

interface TaskActionsProps {
  priority: string;
  category?: string;
  isEditing: boolean;
  hasSubtasks: boolean;
  showSubtasks: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onToggleSubtasks: (e: React.MouseEvent) => void;
  taskId: string;
  taskTitle: string;
}

export const TaskActions = ({
  priority,
  category,
  isEditing,
  hasSubtasks,
  showSubtasks,
  onEdit,
  onDelete,
  onToggleSubtasks,
  taskId,
  taskTitle
}: TaskActionsProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Badge variant="outline" className={cn(
        "text-xs",
        getPriorityColor(priority)
      )}>
        {priority}
      </Badge>
      {category && (
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
      )}
      {!isEditing && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <TaskTimer taskId={taskId} taskTitle={taskTitle} />
        </>
      )}
      {hasSubtasks && !isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSubtasks}
          className="ml-2"
        >
          {showSubtasks ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};