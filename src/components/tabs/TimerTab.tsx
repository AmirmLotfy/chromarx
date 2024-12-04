import { useTimerLogic } from "@/hooks/useTimerLogic";
import { MainTimerCard } from "../timer/MainTimerCard";
import { TaskAnalyticsCard } from "../timer/TaskAnalyticsCard";

export const TimerTab = () => {
  // Initialize timer logic
  useTimerLogic();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-6">
        <MainTimerCard />
        <TaskAnalyticsCard />
      </div>
    </div>
  );
};