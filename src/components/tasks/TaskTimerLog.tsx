import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskTimerLogProps {
  task: Task;
}

export const TaskTimerLog = ({ task }: TaskTimerLogProps) => {
  const timerLogs = JSON.parse(localStorage.getItem(`timerLog-${task.id}`) || '[]');

  return timerLogs.length > 0 ? (
    <div className="mt-2">
      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
        <History className="h-4 w-4" /> Timer History
      </h4>
      <ScrollArea className="h-32">
        {timerLogs.map((log: { startTime: string, duration: number }, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(log.startTime), 'PP pp')}</span>
            <span>({Math.floor(log.duration / 60)} minutes)</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  ) : null;
};