import { Button } from "@/components/ui/button";
import { Gamepad } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EntertainmentModeProps {
  enabled: boolean;
  onToggle: () => void;
}

export const EntertainmentMode = ({ enabled, onToggle }: EntertainmentModeProps) => {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle();
    toast({
      title: enabled ? "Entertainment Mode Disabled" : "Entertainment Mode Enabled",
      description: enabled 
        ? "All bookmarks are now visible" 
        : "Showing only entertainment related bookmarks",
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
          ? 'bg-gradient-to-r from-[#FF719A] to-[#FF9A9E] hover:opacity-90' 
          : 'hover:bg-gradient-to-r hover:from-[#FF719A] hover:to-[#FF9A9E] hover:text-white'
      }`}
    >
      <Gamepad className="h-4 w-4" />
      Fun Mode
    </Button>
  );
};