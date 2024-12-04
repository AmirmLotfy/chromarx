import { useState } from "react";
import { Task } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface InlineTaskEditProps {
  task: Task;
  onSave: (taskId: string, updates: Partial<Task>) => void;
  onCancel: () => void;
}

export const InlineTaskEdit = ({ task, onSave, onCancel }: InlineTaskEditProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    onSave(task.id, { title, description });
  };

  return (
    <div className="space-y-2 p-2 bg-accent/10 rounded-lg">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="border-primary/20"
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="border-primary/20"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} className="w-20">
          <Check className="h-4 w-4 mr-1" /> Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="w-20">
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};