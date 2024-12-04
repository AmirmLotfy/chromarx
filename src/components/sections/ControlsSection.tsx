import { FocusMode } from "@/components/FocusMode";
import { EntertainmentMode } from "@/components/EntertainmentMode";
import { FeatureButtons } from "@/components/FeatureButtons";
import { Bookmark } from "@/types/bookmark";

interface ControlsSectionProps {
  focusModeEnabled: boolean;
  entertainmentModeEnabled: boolean;
  setFocusModeEnabled: (enabled: boolean) => void;
  setEntertainmentModeEnabled: (enabled: boolean) => void;
  onSort: (type: string) => void;
  displayedBookmarks: Bookmark[];
  selectedBookmarks: Set<string>;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRemoveBookmarks: (bookmarkIds: string[]) => void;
}

export const ControlsSection = ({
  focusModeEnabled,
  entertainmentModeEnabled,
  setFocusModeEnabled,
  setEntertainmentModeEnabled,
  onSort,
  displayedBookmarks,
  selectedBookmarks,
  onSelectAll,
  onClearSelection,
  onRemoveBookmarks,
}: ControlsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <FocusMode 
            enabled={focusModeEnabled}
            onToggle={() => {
              setFocusModeEnabled(!focusModeEnabled);
              if (entertainmentModeEnabled) setEntertainmentModeEnabled(false);
            }}
          />
          <EntertainmentMode
            enabled={entertainmentModeEnabled}
            onToggle={() => {
              setEntertainmentModeEnabled(!entertainmentModeEnabled);
              if (focusModeEnabled) setFocusModeEnabled(false);
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FeatureButtons 
          onSort={onSort} 
          bookmarks={displayedBookmarks}
          selectedBookmarks={selectedBookmarks}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          onRemoveBookmarks={onRemoveBookmarks}
        />
      </div>
    </div>
  );
};