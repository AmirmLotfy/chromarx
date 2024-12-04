import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export const FocusMode = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    
    if (!isFocusMode) {
      // Enter focus mode
      document.body.classList.add('focus-mode');
      // Hide distracting elements
      const distractingElements = document.querySelectorAll('.distraction');
      distractingElements.forEach(el => (el as HTMLElement).style.display = 'none');
    } else {
      // Exit focus mode
      document.body.classList.remove('focus-mode');
      // Show previously hidden elements
      const distractingElements = document.querySelectorAll('.distraction');
      distractingElements.forEach(el => (el as HTMLElement).style.display = '');
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={toggleFocusMode}
    >
      {isFocusMode ? (
        <>
          <EyeOff className="h-4 w-4" />
          Exit Focus Mode
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Enter Focus Mode
        </>
      )}
    </Button>
  );
};