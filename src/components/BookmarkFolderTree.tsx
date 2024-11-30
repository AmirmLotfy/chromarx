import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkFolder } from "@/utils/bookmarkUtils";
import { cn } from "@/lib/utils";

interface BookmarkFolderTreeProps {
  folders: BookmarkFolder[];
  onFolderSelect: (folderId: string) => void;
  selectedFolderId?: string;
}

export const BookmarkFolderTree = ({ folders, onFolderSelect, selectedFolderId }: BookmarkFolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: BookmarkFolder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = folder.id === selectedFolderId;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-md cursor-pointer",
            isSelected && "bg-accent",
            level > 0 && "ml-4"
          )}
          onClick={() => {
            toggleFolder(folder.id);
            onFolderSelect(folder.id);
          }}
        >
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-yellow-500" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm">{folder.title}</span>
        </div>
        {isExpanded && folder.children?.map((child) => {
          if (!('url' in child)) {
            return renderFolder(child as BookmarkFolder, level + 1);
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => renderFolder(folder))}
    </div>
  );
};