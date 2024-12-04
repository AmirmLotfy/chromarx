import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/stores/timerStore";

export const TimerControls = () => {
  const { 
    isRunning, 
    workDuration, 
    setWorkDuration, 
    setIsRunning,
    reset
  } = useTimerStore();

  const handleWorkDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setWorkDuration(newDuration);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={() => setIsRunning(!isRunning)}
          className="w-32"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>
        <Button variant="outline" onClick={reset} className="w-32">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Work Duration: {workDuration} minutes
        </label>
        <Slider
          value={[workDuration]}
          onValueChange={handleWorkDurationChange}
          min={1}
          max={60}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};