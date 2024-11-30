import { Bookmark, Category } from "@/types/bookmark";
import { PrivacyBookmarkDisplay } from "./PrivacyBookmarkDisplay";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { BookmarkActions } from "./BookmarkActions";
import { CategoryManager } from "./CategoryManager";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedBookmark?: Bookmark;
  selectedBookmarks: Set<string>;
  onBookmarkSelectToggle: (id: string) => void;
  settings?: {
    privacyMode: boolean;
  };
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddAISuggestion: (suggestion: string) => void;
}

export const BookmarkList = ({
  bookmarks,
  onBookmarkSelect,
  selectedBookmark,
  selectedBookmarks,
  onBookmarkSelectToggle,
  settings = { privacyMode: false },
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddAISuggestion
}: BookmarkListProps) => {
  return (
    <div className="space-y-4">
      <CategoryManager 
        categories={categories} 
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onAddAISuggestion={onAddAISuggestion}
      />
      
      <ScrollArea className="h-[500px] rounded-md border border-accent/20 p-4">
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer border border-transparent transition-all duration-200 ${
                selectedBookmark?.id === bookmark.id 
                  ? 'bg-accent/20 border-accent/30 shadow-sm' 
                  : 'hover:bg-accent/10 hover:border-accent/20'
              }`}
              onClick={() => onBookmarkSelect(bookmark)}
            >
              <Checkbox
                checked={selectedBookmarks.has(bookmark.id)}
                onCheckedChange={() => onBookmarkSelectToggle(bookmark.id)}
                onClick={(e) => e.stopPropagation()}
                className="border-primary/30"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <PrivacyBookmarkDisplay 
                  bookmark={bookmark} 
                  privacyMode={settings.privacyMode} 
                />
              </div>
              <BookmarkActions bookmark={bookmark} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};