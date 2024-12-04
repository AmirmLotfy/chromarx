import { Button } from "@/components/ui/button";
import { ListFilter, Clock, Share2, Mail, MessageCircleMore, CheckSquare, XSquare, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CleanupDialog } from "./CleanupDialog";

interface FeatureButtonsProps {
  onSort: (type: string) => void;
  bookmarks: Bookmark[];
  selectedBookmarks: Set<string>;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onRemoveBookmarks: (bookmarkIds: string[]) => void;
}

export const FeatureButtons = ({ 
  onSort, 
  bookmarks,
  selectedBookmarks,
  onSelectAll,
  onClearSelection,
  onRemoveBookmarks
}: FeatureButtonsProps) => {
  const { toast } = useToast();

  const handleShare = (type: 'whatsapp' | 'email') => {
    const selectedBookmarksList = bookmarks.filter(b => selectedBookmarks.has(b.id));
    
    if (selectedBookmarksList.length === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Please select bookmarks to share",
        duration: 2000,
      });
      return;
    }

    const shareText = selectedBookmarksList
      .map(bookmark => `${bookmark.title}: ${bookmark.url}`)
      .join('\n\n');

    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Shared Bookmarks&body=${encodeURIComponent(shareText)}`;
        break;
    }

    toast({
      title: "Success",
      description: `Sharing ${selectedBookmarksList.length} bookmarks via ${type}`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 px-2 sm:px-0">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort("date")}
          className="flex-1 sm:flex-none hover:bg-accent/80 hover:text-primary"
        >
          <Clock className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Sort by Date</span>
          <span className="sm:hidden">Date</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort("alpha")}
          className="flex-1 sm:flex-none hover:bg-accent/80 hover:text-primary"
        >
          <ListFilter className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Sort Alphabetically</span>
          <span className="sm:hidden">A-Z</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="flex-1 sm:flex-none hover:bg-accent/80 hover:text-primary"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Select All</span>
          <span className="sm:hidden">All</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="flex-1 sm:flex-none hover:bg-accent/80 hover:text-primary"
          disabled={selectedBookmarks.size === 0}
        >
          <XSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Clear Selection</span>
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 sm:flex-none hover:bg-accent/80 hover:text-primary"
            disabled={selectedBookmarks.size === 0}
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Share Selected ({selectedBookmarks.size})</span>
            <span className="sm:hidden">Share ({selectedBookmarks.size})</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
            <MessageCircleMore className="h-4 w-4 mr-2" />
            Share via WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CleanupDialog 
        bookmarks={bookmarks}
        onRemoveBookmarks={onRemoveBookmarks}
      />
    </div>
  );
};