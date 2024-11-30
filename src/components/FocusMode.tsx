import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FocusModeProps {
  enabled: boolean;
  onToggle: () => void;
}

export const FocusMode = ({ enabled, onToggle }: FocusModeProps) => {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle();
    toast({
      title: enabled ? "Focus Mode Disabled" : "Focus Mode Enabled",
      description: enabled 
        ? "All bookmarks are now visible" 
        : "Showing only work and productivity related bookmarks",
      duration: 2000,
    });
  };

  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className={`flex items-center gap-2 transition-all duration-300 ${
        enabled 
          ? 'bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] hover:opacity-90' 
          : 'hover:bg-gradient-to-r hover:from-[#9b87f5] hover:to-[#D6BCFA] hover:text-white'
      }`}
    >
      <Brain className="h-4 w-4" />
      Focus Mode
    </Button>
  );
};