import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, CloudOff, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Note, NoteSync } from "@/types/note";

interface CloudSyncProps {
  notes: Note[];
  onSync: (notes: Note[]) => void;
  onDelete: (noteId: string) => void;
}

export const CloudSync = ({ notes, onSync, onDelete }: CloudSyncProps) => {
  const [syncStatus, setSyncStatus] = useState<NoteSync>({
    lastSynced: new Date(),
    status: 'synced'
  });
  const { toast } = useToast();

  const handleSync = async () => {
    try {
      setSyncStatus({ ...syncStatus, status: 'pending' });
      // Here you would implement the actual sync logic with your backend
      // For now, we'll simulate a sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedNotes = notes.map(note => ({
        ...note,
        lastSyncedAt: new Date()
      }));
      
      onSync(updatedNotes);
      setSyncStatus({ lastSynced: new Date(), status: 'synced' });
      
      toast({
        title: "Sync completed",
        description: "All notes have been synchronized",
      });
    } catch (error) {
      setSyncStatus({ ...syncStatus, status: 'error' });
      toast({
        title: "Sync failed",
        description: "Failed to synchronize notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncStatus.status === 'pending'}
        className="flex items-center gap-2"
      >
        {syncStatus.status === 'synced' ? (
          <Cloud className="h-4 w-4" />
        ) : (
          <CloudOff className="h-4 w-4" />
        )}
        {syncStatus.status === 'pending' ? 'Syncing...' : 'Sync Notes'}
      </Button>
      <span className="text-sm text-muted-foreground">
        Last synced: {syncStatus.lastSynced.toLocaleTimeString()}
      </span>
    </div>
  );
};