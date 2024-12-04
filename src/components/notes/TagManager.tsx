import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagManager = ({ tags, onTagsChange }: TagManagerProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    const tagsToAdd = newTag
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !tags.includes(tag));

    if (tagsToAdd.length > 0) {
      onTagsChange([...tags, ...tagsToAdd]);
      setNewTag("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Tag className="h-4 w-4" />
        <span className="text-sm">Tags</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add tags (comma-separated)..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          onClick={handleAddTag} 
          size="icon" 
          variant="outline"
          className="hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-24">
        <div className="flex flex-wrap gap-2 p-1">
          <AnimatePresence>
            {tags.map(tag => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 hover:bg-secondary/80 transition-colors"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};