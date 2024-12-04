import { ChatInterface } from "@/components/ChatInterface";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";

interface ChatSectionProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const ChatSection = ({
  bookmarks,
  onBookmarkSelect,
  selectedLanguage,
  onLanguageChange,
}: ChatSectionProps) => {
  return (
    <div className="glass-morphism rounded-lg p-4">
      <ChatInterface 
        bookmarks={bookmarks}
        onBookmarkSelect={onBookmarkSelect}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};