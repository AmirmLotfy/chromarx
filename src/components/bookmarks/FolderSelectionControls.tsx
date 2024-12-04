import { Button } from "@/components/ui/button";

interface FolderSelectionControlsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const FolderSelectionControls = ({
  onSelectAll,
  onClearSelection,
}: FolderSelectionControlsProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" size="sm" onClick={onSelectAll}>
        Select All
      </Button>
      <Button variant="outline" size="sm" onClick={onClearSelection}>
        Clear Selection
      </Button>
    </div>
  );
};