import { Bookmark } from "@/types/bookmark";
import { Checkbox } from "../ui/checkbox";
import { PrivacyBookmarkDisplay } from "../PrivacyBookmarkDisplay";
import { BookmarkActions } from "../BookmarkActions";
import { Eye } from "lucide-react";

interface BookmarkItemProps {
  bookmark: Bookmark;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  privacyMode: boolean;
}

export const BookmarkItem = ({
  bookmark,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  privacyMode,
}: BookmarkItemProps) => {
  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer border transition-all duration-200 backdrop-blur-sm ${
        isSelected 
          ? 'bg-accent/20 border-accent/30 shadow-sm' 
          : 'hover:bg-accent/10 border-transparent hover:border-accent/20'
      }`}
      onClick={onSelect}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={() => onToggleCheck()}
        onClick={(e) => e.stopPropagation()}
        className="border-primary/30"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <PrivacyBookmarkDisplay 
          bookmark={bookmark} 
          privacyMode={privacyMode} 
        />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {bookmark.visits || 0} visits
          </span>
        </div>
      </div>
      <BookmarkActions bookmark={bookmark} />
    </div>
  );
};