export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  createdAt: Date;
  lastSyncedAt?: Date;
  isSelected?: boolean;
}

export interface NoteSync {
  lastSynced: Date;
  status: 'synced' | 'pending' | 'error';
}