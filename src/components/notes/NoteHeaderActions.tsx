import { Search } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SupportedLanguage } from "@/utils/translationUtils";
import { CreateNoteModal } from "./CreateNoteModal";
import { Note } from "@/types/note";

interface NoteHeaderActionsProps {
  onCreateNote: (note: Omit<Note, 'id' | 'lastSyncedAt'>) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isGeneratingSummary: boolean;
}

export const NoteHeaderActions = ({
  onCreateNote,
  selectedLanguage,
  onLanguageChange,
  isGeneratingSummary
}: NoteHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <CreateNoteModal onCreateNote={onCreateNote} />
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        disabled={isGeneratingSummary}
      />
    </div>
  );
};