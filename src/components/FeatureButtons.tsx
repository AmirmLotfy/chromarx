import { Button } from "@/components/ui/button";
import { ListFilter, Clock, Share2, Mail, MessageCircleMore, CheckSquare, XSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeatureButtonsProps {
  onSort: (type: string) => void;
  bookmarks: Bookmark[];
  selectedBookmarks: Set<string>;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

export const FeatureButtons = ({ 
  onSort, 
  bookmarks,
  selectedBookmarks,
  onSelectAll,
  onClearSelection
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
    <div className="flex flex-wrap gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort("date")}
          className="hover:bg-accent/80 hover:text-primary"
        >
          <Clock className="h-4 w-4 mr-2" />
          Sort by Date
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort("alpha")}
          className="hover:bg-accent/80 hover:text-primary"
        >
          <ListFilter className="h-4 w-4 mr-2" />
          Sort Alphabetically
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="hover:bg-accent/80 hover:text-primary"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="hover:bg-accent/80 hover:text-primary"
          disabled={selectedBookmarks.size === 0}
        >
          <XSquare className="h-4 w-4 mr-2" />
          Clear Selection
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-accent/80 hover:text-primary"
            disabled={selectedBookmarks.size === 0}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Selected ({selectedBookmarks.size})
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
    </div>
  );
};