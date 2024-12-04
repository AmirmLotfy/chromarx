import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface TaskNotesProps {
  notes: string[];
  onAddNote: (note: string) => void;
}

export const TaskNotes = ({ notes, onAddNote }: TaskNotesProps) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    onAddNote(newNote);
    setNewNote("");
    toast.success("Note added successfully");
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add a note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button onClick={handleAddNote}>
          Add Note
        </Button>
      </div>
      {notes.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Notes:</h4>
          {notes.map((note, index) => (
            <p key={index} className="text-sm text-muted-foreground bg-secondary p-2 rounded">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};