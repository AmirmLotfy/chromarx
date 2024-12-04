import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ImportBookmarksDialog } from "@/components/ImportBookmarksDialog";
import { Settings } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Bookmark } from "@/types/bookmark";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enableAI: true,
    showSummaries: true,
    privacyMode: false,
    syncEnabled: true
  });

  const handleImportBookmarks = async (selectedFolders: string[]) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      try {
        const results = await Promise.all(
          selectedFolders.map(folderId => 
            new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve, reject) => {
              chrome.bookmarks.getSubTree(folderId, (results) => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                  return;
                }
                resolve(results);
              });
            })
          )
        );

        const processedBookmarks = results.flat().map(node => ({
          id: node.id,
          title: node.title,
          url: node.url || '',
          dateAdded: node.dateAdded || Date.now(),
          category: 'Uncategorized'
        }));

        setBookmarks(processedBookmarks);
        toast({
          title: "Success",
          description: `Imported ${processedBookmarks.length} bookmarks`,
        });
      } catch (error) {
        console.error('Error importing bookmarks:', error);
        toast({
          title: "Error",
          description: "Failed to import bookmarks. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

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
    
    toast({
      title: "Success",
      description: "Bookmarks downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 fade-in overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 border-b gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Logo />
            <h1 className="text-xl font-semibold text-primary">ChroMarx</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-center w-full sm:w-auto">
            <ImportBookmarksDialog onImport={handleImportBookmarks} folders={[]} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadBookmarks}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download Bookmarks</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Settings 
              onSettingsChange={setSettings} 
              initialSettings={settings}
            />
          </div>
        </div>
        <div className="relative px-2 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};