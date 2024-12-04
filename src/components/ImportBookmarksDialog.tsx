import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { FolderOpen } from "lucide-react";
import { BookmarkFolder } from "@/utils/bookmarkUtils";
import { FolderTreeItem } from "./bookmarks/FolderTreeItem";
import { FolderSelectionControls } from "./bookmarks/FolderSelectionControls";

interface ImportBookmarksDialogProps {
  onImport: (selectedFolders: string[]) => void;
  folders?: BookmarkFolder[];
}

export const ImportBookmarksDialog = ({ onImport }: ImportBookmarksDialogProps) => {
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('Dialog opened, fetching folders...');
      setIsLoading(true);
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'GET_BOOKMARK_FOLDERS' }, (response) => {
          console.log('Received response:', response);
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
            toast({
              title: "Error",
              description: "Failed to fetch bookmark folders. Please try again.",
              variant: "destructive",
            });
          } else if (response?.error) {
            console.error('Response error:', response.error);
            toast({
              title: "Error",
              description: "Failed to fetch bookmark folders. Please try again.",
              variant: "destructive",
            });
          } else if (response?.folders) {
            console.log('Setting folders:', response.folders);
            setFolders(response.folders);
          }
          setIsLoading(false);
        });
      } else {
        console.error('Chrome runtime API not available');
        toast({
          title: "Error",
          description: "Chrome API not available. Are you running in extension context?",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }
  }, [isOpen, toast]);

  const handleImport = async () => {
    if (selectedFolders.size === 0) {
      toast({
        title: "No folders selected",
        description: "Please select at least one folder to import.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting import with folders:', Array.from(selectedFolders));

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'IMPORT_BOOKMARKS',
        folderIds: Array.from(selectedFolders)
      });

      console.log('Import response:', response);

      if (response?.success) {
        onImport(Array.from(selectedFolders));
        setIsOpen(false);
        toast({
          title: "Success",
          description: `Imported ${response.bookmarks?.length || 0} bookmarks successfully`,
        });
        
        // Update the bookmarks in local storage
        chrome.storage.local.set({ bookmarks: response.bookmarks }, () => {
          if (chrome.runtime.lastError) {
            console.error('Storage error:', chrome.runtime.lastError);
          } else {
            console.log('Bookmarks saved to local storage');
          }
        });
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to import bookmarks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAllFolderIds = (folders: BookmarkFolder[]): string[] => {
    let ids: string[] = [];
    folders.forEach(folder => {
      ids.push(folder.id);
      if (folder.children) {
        ids = [...ids, ...getAllFolderIds(folder.children)];
      }
    });
    return ids;
  };

  const handleSelectAll = () => {
    const allFolderIds = getAllFolderIds(folders);
    setSelectedFolders(new Set(allFolderIds));
  };

  const handleClearSelection = () => {
    setSelectedFolders(new Set());
  };

  const toggleFolder = (folderId: string) => {
    const newSelected = new Set(selectedFolders);
    if (newSelected.has(folderId)) {
      newSelected.delete(folderId);
    } else {
      newSelected.add(folderId);
    }
    setSelectedFolders(newSelected);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Import Bookmarks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Select the folders you want to import bookmarks from
          </DialogDescription>
        </DialogHeader>
        
        <FolderSelectionControls
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
        />
        
        <ScrollArea className="h-[400px] pr-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              <span className="ml-2">Loading folders...</span>
            </div>
          ) : folders.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No bookmark folders found</p>
            </div>
          ) : (
            folders.map(folder => (
              <FolderTreeItem
                key={folder.id}
                folder={folder}
                selectedFolders={selectedFolders}
                onToggleFolder={toggleFolder}
              />
            ))
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            onClick={handleImport} 
            disabled={selectedFolders.size === 0 || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Importing...
              </div>
            ) : (
              'Import Selected Folders'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};