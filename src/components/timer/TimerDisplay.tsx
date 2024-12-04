import { useTimerStore } from "@/stores/timerStore";

export const TimerDisplay = () => {
  const { timeLeft, isBreak } = useTimerStore();
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <div className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</div>
      <div className="text-lg text-muted-foreground">
        {isBreak ? "Break Time" : "Focus Time"}
      </div>
    </div>
  );
};