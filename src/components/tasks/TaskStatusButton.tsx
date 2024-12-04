import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatusButtonProps {
  completed: boolean;
  onToggle: () => void;
}

export const TaskStatusButton = ({ completed, onToggle }: TaskStatusButtonProps) => {
  return (
    <Button
      variant={completed ? "default" : "outline"}
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "shrink-0 transition-all duration-200 rounded-full w-6 h-6",
        completed ? "bg-primary hover:bg-primary/90" : "hover:border-primary border-2"
      )}
    >
      {completed && (
        <Check className="h-3 w-3 text-background animate-in zoom-in duration-200" />
      )}
    </Button>
  );
};