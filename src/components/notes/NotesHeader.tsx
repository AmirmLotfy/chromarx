import { SearchNotes } from "@/components/notes/SearchNotes";
import { NoteHeaderActions } from "@/components/notes/NoteHeaderActions";
import { CloudSync } from "@/components/notes/CloudSync";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { Note } from "@/types/note";
import { SupportedLanguage } from "@/utils/translationUtils";

interface NotesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateNote: (noteData: Omit<Note, 'id' | 'lastSyncedAt'>) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  isGeneratingSummary: boolean;
  notes: Note[];
  onSync: (notes: Note[]) => void;
  onDelete: (noteId: string) => void;
  handleGenerateSummary: () => void;
  exportNotes: () => void;
  selectedNotes: Set<string>;
}

export const NotesHeader = ({
  searchQuery,
  onSearchChange,
  onCreateNote,
  selectedLanguage,
  onLanguageChange,
  isGeneratingSummary,
  notes,
  onSync,
  onDelete,
  handleGenerateSummary,
  exportNotes,
  selectedNotes
}: NotesHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchNotes searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <NoteHeaderActions
          onCreateNote={onCreateNote}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          isGeneratingSummary={isGeneratingSummary}
        />
      </div>
      
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <CloudSync 
          notes={notes} 
          onSync={onSync}
          onDelete={onDelete}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || selectedNotes.size === 0}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isGeneratingSummary ? "animate-spin" : ""
              }`}
            />
            Generate Summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportNotes}
            disabled={selectedNotes.size === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>
    </div>
  );
};