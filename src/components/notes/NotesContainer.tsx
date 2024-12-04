import { useState } from "react";
import { Note } from "@/types/note";
import { NoteList } from "@/components/notes/NoteList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Card } from "@/components/ui/card";

interface NotesContainerProps {
  notes: Note[];
  selectedNotes: Set<string>;
  setSelectedNotes: React.Dispatch<React.SetStateAction<Set<string>>>;
  onDeleteNote: (noteId: string) => void;
  setNotes: (notes: Note[]) => void;
}

export const NotesContainer = ({
  notes,
  selectedNotes,
  setSelectedNotes,
  onDeleteNote,
  setNotes
}: NotesContainerProps) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <Card className="p-4">
          <NoteList
            notes={notes}
            onNoteSelect={(noteId) => {
              setSelectedNotes((prev) => {
                const newSelected = new Set(prev);
                if (newSelected.has(noteId)) {
                  newSelected.delete(noteId);
                } else {
                  newSelected.add(noteId);
                }
                return newSelected;
              });
            }}
            selectedNotes={selectedNotes}
            onDeleteNote={onDeleteNote}
          />
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-8 space-y-4">
        {selectedNotes.size > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {selectedNotes.size} note{selectedNotes.size > 1 ? "s" : ""}{" "}
                selected
              </h2>
            </div>

            {notes
              .filter((note) => selectedNotes.has(note.id))
              .map((note) => (
                <NoteEditor
                  key={note.id}
                  note={note}
                  notes={notes}
                  onNoteUpdate={setNotes}
                  onDeleteNote={onDeleteNote}
                />
              ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] text-muted-foreground">
            Select one or more notes to view or edit
          </div>
        )}
      </div>
    </div>
  );
};