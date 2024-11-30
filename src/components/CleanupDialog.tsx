import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { findDuplicateBookmarks, findBrokenBookmarks } from "@/utils/bookmarkCleanup";
import { Bookmark } from "@/types/bookmark";
import { useToast } from "@/components/ui/use-toast";

interface CleanupDialogProps {
  bookmarks: Bookmark[];
  onRemoveBookmarks: (bookmarkIds: string[]) => void;
}

export const CleanupDialog = ({ bookmarks, onRemoveBookmarks }: CleanupDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duplicates, setDuplicates] = useState<Bookmark[]>([]);
  const [brokenLinks, setBrokenLinks] = useState<Bookmark[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsChecking(true);
    
    // Find duplicates
    const duplicateBookmarks = findDuplicateBookmarks(bookmarks);
    setDuplicates(duplicateBookmarks);
    
    // Find broken links
    try {
      const brokenBookmarks = await findBrokenBookmarks(bookmarks);
      setBrokenLinks(brokenBookmarks);
    } catch (error) {
      toast({
        title: "Error checking links",
        description: "Some links could not be checked. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsChecking(false);
  };

  const handleRemove = (type: 'duplicates' | 'broken') => {
    const bookmarksToRemove = type === 'duplicates' ? duplicates : brokenLinks;
    const bookmarkIds = bookmarksToRemove.map(b => b.id);
    onRemoveBookmarks(bookmarkIds);
    
    toast({
      title: "Cleanup complete",
      description: `Removed ${bookmarkIds.length} ${type} bookmarks.`,
    });
    
    setIsOpen(false);
    setDuplicates([]);
    setBrokenLinks([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Cleanup Bookmarks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cleanup Bookmarks</DialogTitle>
          <DialogDescription>
            Find and remove duplicate bookmarks and broken links.
          </DialogDescription>
        </DialogHeader>
        
        {isChecking ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Checking bookmarks...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {!duplicates.length && !brokenLinks.length && (
              <Button onClick={handleCleanup} className="w-full">
                Check Bookmarks
              </Button>
            )}
            
            {duplicates.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Duplicate Bookmarks ({duplicates.length})</h3>
                <Button
                  variant="destructive"
                  onClick={() => handleRemove('duplicates')}
                  className="w-full"
                >
                  Remove Duplicates
                </Button>
              </div>
            )}
            
            {brokenLinks.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Broken Links ({brokenLinks.length})</h3>
                <Button
                  variant="destructive"
                  onClick={() => handleRemove('broken')}
                  className="w-full"
                >
                  Remove Broken Links
                </Button>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};