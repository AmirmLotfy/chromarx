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
    <div className="flex flex-col min-h-screen bg-background max-w-[400px] mx-auto relative">
      <div className="pt-14 pb-16 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
