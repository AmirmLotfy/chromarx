import { BookmarkFolder } from "@/utils/bookmarkUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderOpen } from "lucide-react";

interface FolderTreeItemProps {
  folder: BookmarkFolder;
  selectedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  level?: number;
}

export const FolderTreeItem = ({
  folder,
  selectedFolders,
  onToggleFolder,
  level = 0,
}: FolderTreeItemProps) => {
  return (
    <div key={folder.id} style={{ marginLeft: `${level * 20}px` }} className="py-1">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedFolders.has(folder.id)}
          onCheckedChange={() => onToggleFolder(folder.id)}
          id={folder.id}
        />
        <label htmlFor={folder.id} className="text-sm cursor-pointer flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-yellow-500" />
          {folder.title}
          {folder.path && <span className="text-xs text-muted-foreground">({folder.path})</span>}
        </label>
      </div>
      {folder.children?.map(child => (
        <FolderTreeItem
          key={child.id}
          folder={child as BookmarkFolder}
          selectedFolders={selectedFolders}
          onToggleFolder={onToggleFolder}
          level={level + 1}
        />
      ))}
    </div>
  );
};