import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Trash2 } from "lucide-react";
import { SupportedLanguage } from "@/utils/translationUtils";

interface ChatControlsProps {
  onClear: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  messagesCount: number;
  isLoading: boolean;
}

export const ChatControls = ({
  onClear,
  selectedLanguage,
  onLanguageChange,
  messagesCount,
  isLoading,
}: ChatControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        disabled={isLoading}
      />
      {messagesCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1.5" />
          Clear
        </Button>
      )}
    </div>
  );
};