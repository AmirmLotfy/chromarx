import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SupportedLanguage } from "@/utils/translationUtils";
import { Message } from "@/types/chat";

interface ChatHeaderProps {
  messages: Message[];
  onClearChat: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  isLoading: boolean;
}

export const ChatHeader = ({
  messages,
  onClearChat,
  selectedLanguage,
  onLanguageChange,
  isLoading
}: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <MessageCircle className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-sm font-medium text-primary">
          Chat Assistant
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          disabled={isLoading}
        />
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};