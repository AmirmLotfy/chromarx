import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { TimerPresets } from "./TimerPresets";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { FocusMode } from "./FocusMode";
import { MiniTimer } from "./MiniTimer";
import { useTimerStore } from "@/stores/timerStore";

export const MainTimerCard = () => {
  const { 
    notificationsEnabled, 
    setNotificationsEnabled,
    isBreak,
    activeTask 
  } = useTimerStore();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {isBreak ? "Break Time" : activeTask ? `Working on: ${activeTask.title}` : "Work Time"}
          </span>
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimerPresets />
        <TimerDisplay />
        <TimerControls />
        <div className="flex justify-between items-center">
          <FocusMode />
        </div>
        <MiniTimer />
      </CardContent>
    </Card>
  );
};