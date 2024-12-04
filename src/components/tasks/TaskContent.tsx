import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TaskContentProps {
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  updatedAt: Date;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TaskContent = ({
  title,
  description,
  completed,
  dueDate,
  updatedAt,
  isEditing,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onSave,
  onCancel
}: TaskContentProps) => {
  const getDueDateColor = (dueDate: Date | undefined) => {
    if (!dueDate) return "text-muted-foreground";
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return "text-destructive";
    if (due.getDate() === today.getDate()) return "text-warning";
    return "text-success";
  };

  if (isEditing) {
    return (
      <div className="flex-1 space-y-2" onClick={e => e.stopPropagation()}>
        <Input
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          className="w-full"
          placeholder="Task title"
        />
        <Input
          value={editDescription}
          onChange={(e) => onEditDescriptionChange(e.target.value)}
          className="w-full"
          placeholder="Task description"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave}>Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <h3 className={cn(
        "font-medium truncate",
        completed ? 'line-through text-muted-foreground' : ''
      )}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground truncate">
        {description}
      </p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {dueDate && (
          <div className={cn(
            "text-xs flex items-center gap-1",
            getDueDateColor(dueDate)
          )}>
            <CalendarIcon className="h-3 w-3" />
            {format(new Date(dueDate), "PPP")}
          </div>
        )}
        <div className="text-xs flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {format(new Date(updatedAt), "PP")}
        </div>
      </div>
    </div>
  );
};