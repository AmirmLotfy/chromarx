import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";
import { TagManager } from "@/components/notes/TagManager";
import { WebContentSuggestions } from "@/components/notes/WebContentSuggestions";
import { updateNote } from "@/utils/noteOperations";
import { Trash2, Calendar, Type, AlignLeft } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

interface NoteEditorProps {
  note: Note;
  onNoteUpdate: (notes: Note[]) => void;
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
}

export const NoteEditor = ({ note, onNoteUpdate, notes, onDeleteNote }: NoteEditorProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleContentAdd = (newContent: string) => {
    const updatedNotes = updateNote(notes, note.id, {
      content: note.content + newContent,
    });
    onNoteUpdate(updatedNotes);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteNote(note.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Type className="h-4 w-4" />
              <span className="text-sm">Title</span>
            </div>
            <input
              value={note.title}
              onChange={(e) => {
                const updatedNotes = updateNote(notes, note.id, {
                  title: e.target.value,
                });
                onNoteUpdate(updatedNotes);
              }}
              className="text-xl font-medium w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md px-2 py-1 -ml-2"
              placeholder="Note Title"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(note.createdAt), 'MMMM dd, yyyy')}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlignLeft className="h-4 w-4" />
            <span className="text-sm">Content</span>
          </div>
          <textarea
            value={note.content}
            onChange={(e) => {
              const updatedNotes = updateNote(notes, note.id, {
                content: e.target.value,
              });
              onNoteUpdate(updatedNotes);
            }}
            className="min-h-[300px] w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-2 -ml-2 resize-none"
            placeholder="Start writing your note..."
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
            {note.content.length} characters
          </div>
        </div>

        <div className="space-y-2">
          <TagManager
            tags={note.tags}
            onTagsChange={(tags) => {
              const updatedNotes = updateNote(notes, note.id, { tags });
              onNoteUpdate(updatedNotes);
            }}
          />
        </div>

        {note.summary && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-medium mb-2">AI Summary</h4>
            <p className="text-sm text-muted-foreground">{note.summary}</p>
          </Card>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-4">Content Suggestions</h4>
          <WebContentSuggestions
            noteTitle={note.title}
            noteContent={note.content}
            onContentAdd={handleContentAdd}
          />
        </div>
      </Card>

      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
};
