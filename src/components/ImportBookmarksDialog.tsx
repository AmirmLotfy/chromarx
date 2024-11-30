import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface ImportBookmarksDialogProps {
  onImport: (selectedFolders: string[]) => void;
  folders: BookmarkFolder[];
}

export const ImportBookmarksDialog = ({ onImport, folders }: ImportBookmarksDialogProps) => {
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleSelectAll = () => {
    const allFolderIds = getAllFolderIds(folders);
    setSelectedFolders(new Set(allFolderIds));
  };

  const handleClearSelection = () => {
    setSelectedFolders(new Set());
  };

  const getAllFolderIds = (folders: BookmarkFolder[]): string[] => {
    let ids: string[] = [];
    folders.forEach(folder => {
      ids.push(folder.id);
      if (folder.children) {
        ids = [...ids, ...getAllFolderIds(folder.children.filter(child => !('url' in child)) as BookmarkFolder[])];
      }
    });
    return ids;
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

  const handleImport = () => {
    if (selectedFolders.size === 0) {
      toast({
        title: "No folders selected",
        description: "Please select at least one folder to import.",
        variant: "destructive",
      });
      return;
    }
    onImport(Array.from(selectedFolders));
    toast({
      title: "Import started",
      description: "Your bookmarks are being imported...",
    });
  };

  const renderFolderTree = (folder: BookmarkFolder, level = 0) => (
    <div key={folder.id} style={{ marginLeft: `${level * 20}px` }} className="py-1">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedFolders.has(folder.id)}
          onCheckedChange={() => toggleFolder(folder.id)}
          id={folder.id}
        />
        <label htmlFor={folder.id} className="text-sm cursor-pointer flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-yellow-500" />
          {folder.title}
        </label>
      </div>
      {folder.children?.map(child => {
        if (!('url' in child)) {
          return renderFolderTree(child as BookmarkFolder, level + 1);
        }
        return null;
      })}
    </div>
  );

  return (
    <Dialog>
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
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearSelection}>
            Clear Selection
          </Button>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {folders.map(folder => renderFolderTree(folder))}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleImport}>Import Selected Folders</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};