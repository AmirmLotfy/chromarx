import { useTimerStore } from "@/stores/timerStore";
import { Button } from "@/components/ui/button";
import { Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";

export const MiniTimer = () => {
  const { timeLeft, isRunning } = useTimerStore();
  const [isMini, setIsMini] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleMiniMode = () => {
    setIsMini(!isMini);
  };

  if (!isMini) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMiniMode}
        className="absolute top-2 right-2"
      >
        <Minimize2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
        <Button variant="outline" size="sm" onClick={toggleMiniMode}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};