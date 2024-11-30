import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Settings } from "@/components/Settings";
import { ImportBookmarksDialog } from "@/components/ImportBookmarksDialog";
import { AIPromptDialog } from "@/components/AIPromptDialog";
import { UserSettings } from "@/components/Settings";
import { Bookmark } from "@/types/bookmark";

interface HeaderProps {
  folders: any[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
  setFilteredBookmarks: (bookmarks: Bookmark[]) => void;
  onSettingsChange: (settings: UserSettings) => void;
  settings: UserSettings;
  aiPrompts: {
    summary: string;
    category: string;
  };
  handleUpdateAIPrompt: (type: "summary" | "category", prompt: string) => void;
  bookmarks: Bookmark[];
}

export const Header = ({
  folders,
  setBookmarks,
  setFilteredBookmarks,
  onSettingsChange,
  settings,
  aiPrompts,
  handleUpdateAIPrompt,
  bookmarks,
}: HeaderProps) => {
  const handleDownloadBookmarks = () => {
    const bookmarksData = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([bookmarksData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-2xl font-bold tracking-tight text-primary">ChroMarx</h1>
      </div>
      <div className="flex items-center gap-4">
        <ImportBookmarksDialog
          onImport={(selectedFolders) => {
            if (typeof chrome !== 'undefined' && chrome.bookmarks) {
              chrome.bookmarks.getSubTree(selectedFolders[0], (results) => {
                const newBookmarks = results.flatMap(node => 
                  node.children?.map(child => ({
                    id: child.id,
                    title: child.title,
                    url: child.url || '',
                    dateAdded: child.dateAdded || Date.now(),
                    category: 'Uncategorized'
                  })) || []
                );
                setBookmarks(newBookmarks);
                setFilteredBookmarks(newBookmarks);
              });
            }
          }}
          folders={folders}
        />
        <AIPromptDialog
          onUpdatePrompt={handleUpdateAIPrompt}
          defaultSummaryPrompt={aiPrompts.summary}
          defaultCategoryPrompt={aiPrompts.category}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadBookmarks}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Bookmarks
        </Button>
        <Settings onSettingsChange={onSettingsChange} initialSettings={settings} />
      </div>
    </header>
  );
};