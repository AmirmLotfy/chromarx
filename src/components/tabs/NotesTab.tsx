import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Note } from "@/types/note";
import { SupportedLanguage } from "@/utils/translationUtils";
import { generateNoteSummary } from "@/utils/noteOperations";
import { NotesContainer } from "@/components/notes/NotesContainer";
import { NotesHeader } from "@/components/notes/NotesHeader";

export const NotesTab = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const { toast } = useToast();

  // Load notes from storage on component mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['notes'], (result) => {
        if (result.notes) {
          setNotes(result.notes);
        }
      });
    }
  }, []);

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'lastSyncedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    
    // Store in chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['notes'], (result) => {
        const storedNotes = result.notes || [];
        chrome.storage.local.set({ notes: [newNote, ...storedNotes] });
      });
    }
    
    toast({
      title: "Note Created",
      description: "Your note has been created successfully",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    setSelectedNotes(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(noteId);
      return newSelected;
    });
    
    // Update storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['notes'], (result) => {
        const storedNotes = result.notes || [];
        chrome.storage.local.set({ 
          notes: storedNotes.filter(note => note.id !== noteId) 
        });
      });
    }
    
    toast({
      title: "Note Deleted",
      description: "The note has been deleted successfully",
    });
  };

  const handleGenerateSummary = async () => {
    if (selectedNotes.size === 0) return;

    setIsGeneratingSummary(true);
    try {
      const summary = await generateNoteSummary(notes, selectedNotes, selectedLanguage);
      
      const updatedNotes = notes.map(note => {
        if (selectedNotes.has(note.id)) {
          return { ...note, summary };
        }
        return note;
      });
      
      setNotes(updatedNotes);
      
      // Update storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ notes: updatedNotes });
      }

      toast({
        title: "Summary Generated",
        description: `Generated summaries for ${selectedNotes.size} notes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSync = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ notes: updatedNotes });
    }
  };

  const exportNotes = () => {
    const selectedNotesList = notes.filter(note => selectedNotes.has(note.id));
    if (selectedNotesList.length === 0) return;
    
    const content = selectedNotesList.map(note => 
      `Title: ${note.title}\n\n${note.content}\n\nSummary: ${note.summary || 'No summary'}\nTags: ${note.tags.join(', ')}`
    ).join('\n\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <NotesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNote={handleCreateNote}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        isGeneratingSummary={isGeneratingSummary}
        notes={notes}
        onSync={handleSync}
        onDelete={handleDeleteNote}
        handleGenerateSummary={handleGenerateSummary}
        exportNotes={exportNotes}
        selectedNotes={selectedNotes}
      />
      
      <div className="flex flex-col space-y-6">
        <NotesContainer
          notes={filteredNotes}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          onDeleteNote={handleDeleteNote}
          setNotes={setNotes}
        />
      </div>
    </div>
  );
};