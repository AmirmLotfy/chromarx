import { Note } from "@/types/note";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cloud, CloudOff, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface NoteListProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  selectedNotes: Set<string>;
  onDeleteNote: (noteId: string) => void;
}

export const NoteList = ({ notes, onNoteSelect, selectedNotes, onDeleteNote }: NoteListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-3 p-2">
        {notes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4"
          >
            <div className="max-w-sm mx-auto space-y-4">
              <div className="text-6xl">📝</div>
              <h3 className="text-xl font-medium text-primary">No notes yet</h3>
              <p className="text-muted-foreground">
                Create your first note to get started! Your ideas and thoughts will appear here.
              </p>
            </div>
          </motion.div>
        ) : (
          notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 ${
                  selectedNotes.has(note.id) ? 'border-primary shadow-md scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedNotes.has(note.id)}
                    onCheckedChange={() => onNoteSelect(note.id)}
                    className="mt-1.5"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-medium line-clamp-1 text-lg">{note.title}</h3>
                      <div className="flex items-center gap-2">
                        {note.lastSyncedAt ? (
                          <Cloud className="h-4 w-4 text-primary" />
                        ) : (
                          <CloudOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {note.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 hover:bg-secondary/80 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};