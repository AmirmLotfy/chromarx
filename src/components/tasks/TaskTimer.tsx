import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { toast } from "sonner";

interface TaskTimerProps {
  taskId: string;
  taskTitle: string;
}

export const TaskTimer = ({ taskId, taskTitle }: TaskTimerProps) => {
  const handleStartTimer = () => {
    // Save current timer if exists
    const existingTimer = localStorage.getItem('activeTimer');
    if (existingTimer) {
      const timer = JSON.parse(existingTimer);
      const timerLog = JSON.parse(localStorage.getItem(`timerLog-${timer.taskId}`) || '[]');
      localStorage.setItem(`timerLog-${timer.taskId}`, JSON.stringify([
        ...timerLog,
        {
          startTime: timer.startTime,
          duration: timer.duration
        }
      ]));
    }

    // Start new timer
    localStorage.setItem('activeTimer', JSON.stringify({
      taskId,
      taskTitle,
      duration: 25 * 60, // 25 minutes in seconds
      startTime: new Date().toISOString()
    }));
    
    toast.success(`Timer started for: ${taskTitle}`);
    
    // Switch to timer tab
    const timerTab = document.querySelector('[value="timer"]');
    if (timerTab) {
      (timerTab as HTMLElement).click();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handleStartTimer();
      }}
      className="h-8 w-8"
      title="Start Timer for this Task"
    >
      <Timer className="h-4 w-4" />
    </Button>
  );
};