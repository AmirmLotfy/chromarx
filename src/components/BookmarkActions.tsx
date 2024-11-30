import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, Share2, Mail, MessageCircleMore } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";

interface BookmarkActionsProps {
  bookmark: Bookmark;
}

export const BookmarkActions = ({ bookmark }: BookmarkActionsProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      try {
        await new Promise((resolve, reject) => {
          chrome.bookmarks.remove(id, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(true);
            }
          });
        });
        
        toast({
          title: "Bookmark deleted",
          description: "The bookmark has been successfully removed.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete bookmark. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.log("Chrome bookmarks API not available - delete operation simulated");
      toast({
        title: "Development mode",
        description: "Delete operation simulated in development mode",
      });
    }
  };

  const handleShare = async (type: 'whatsapp' | 'email' | 'copy') => {
    const shareText = `${bookmark.title}: ${bookmark.url}`;

    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this bookmark&body=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Bookmark copied to clipboard!",
          });
        }).catch(() => {
          toast({
            title: "Share Failed",
            description: "Unable to copy to clipboard.",
            variant: "destructive",
          });
        });
        break;
    }
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          window.open(bookmark.url, "_blank");
        }}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleShare('whatsapp');
          }}>
            <MessageCircleMore className="h-4 w-4 mr-2" />
            Share via WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleShare('email');
          }}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleShare('copy');
          }}>
            <Share2 className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(bookmark.id);
        }}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};