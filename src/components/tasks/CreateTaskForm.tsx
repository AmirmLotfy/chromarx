import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Timer } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateSubtasks } from "@/utils/taskUtils/subtaskGeneration";
import { getSuggestedTimeFrame } from "./taskUtils/timeEstimation";

interface CreateTaskFormProps {
  onCreateTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  editingTask: Task | null;
}

export const CreateTaskForm = ({ onCreateTask, onUpdateTask, editingTask }: CreateTaskFormProps) => {
  const [title, setTitle] = useState(editingTask?.title || "");
  const [description, setDescription] = useState(editingTask?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(editingTask?.priority || "medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(editingTask?.dueDate);
  const [category, setCategory] = useState(editingTask?.category || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsProcessing(true);
    try {
      // Generate subtasks using AI
      const subtasks = await generateSubtasks(title, description);
      
      // Get AI suggested time frame
      const suggestedTime = await getSuggestedTimeFrame(title, description);

      if (editingTask) {
        onUpdateTask(editingTask.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate,
          category: category.trim(),
          updatedAt: new Date(),
        });
        toast.success("Task updated successfully");
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          description: description.trim(),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: [],
          priority,
          dueDate,
          category: category.trim(),
          subtasks,
          suggestedDuration: suggestedTime
        };

        onCreateTask(newTask);

        // Create timer for the task
        localStorage.setItem(`taskTimer-${newTask.id}`, JSON.stringify({
          taskId: newTask.id,
          taskTitle: newTask.title,
          duration: suggestedTime * 60, // Convert minutes to seconds
          startTime: new Date().toISOString()
        }));

        // Dispatch event to notify task list components
        window.dispatchEvent(new Event('tasksUpdated'));

        toast.success("Task created with AI-generated subtasks");
      }

      // Reset form
      if (!editingTask) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate(undefined);
        setCategory("");
      }
    } catch (error) {
      toast.error("Failed to process task");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            value={priority}
            onValueChange={(value: Task["priority"]) => setPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => setDueDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              "Processing..."
            ) : editingTask ? (
              "Update Task"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};