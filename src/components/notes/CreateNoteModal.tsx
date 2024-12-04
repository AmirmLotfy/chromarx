import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { TagManager } from "./TagManager";
import { Note } from "@/types/note";

interface CreateNoteModalProps {
  onCreateNote: (note: Omit<Note, 'id' | 'lastSyncedAt'>) => void;
}

export const CreateNoteModal = ({ onCreateNote }: CreateNoteModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onCreateNote({
      title: title.trim(),
      content: content.trim(),
      tags,
      createdAt: new Date(),
    });

    // Reset form and close modal
    setTitle("");
    setContent("");
    setTags([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
            <Textarea
              placeholder="Write your note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <TagManager tags={tags} onTagsChange={setTags} />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Note</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};