import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Download, Menu } from "lucide-react";
import { Settings } from "@/components/Settings";
import { ImportBookmarksDialog } from "@/components/ImportBookmarksDialog";
import { AIPromptDialog } from "@/components/AIPromptDialog";
import { UserSettings } from "@/components/Settings";
import { Bookmark } from "@/types/bookmark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-lg font-semibold text-primary">ChroMarx</h1>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
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
                className="w-full flex items-center gap-2 justify-center"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Settings onSettingsChange={onSettingsChange} initialSettings={settings} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};