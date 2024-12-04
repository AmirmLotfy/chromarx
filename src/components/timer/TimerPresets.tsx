import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/stores/timerStore";
import { Clock, Brain, Coffee } from "lucide-react";

export const TimerPresets = () => {
  const { setWorkDuration, setTimeLeft } = useTimerStore();

  const presets = [
    { name: "Pomodoro", duration: 25, icon: Clock },
    { name: "Deep Work", duration: 45, icon: Brain },
    { name: "Quick Break", duration: 5, icon: Coffee },
  ];

  const handlePresetClick = (duration: number) => {
    setWorkDuration(duration);
    setTimeLeft(duration * 60);
  };

  return (
    <div className="flex gap-2 mb-4">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <Button
            key={preset.name}
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handlePresetClick(preset.duration)}
          >
            <Icon className="h-4 w-4" />
            {preset.name}
          </Button>
        );
      })}
    </div>
  );
};