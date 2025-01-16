import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";
import { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['sidebarVisible'], (result) => {
        setIsVisible(result.sidebarVisible !== false);
      });
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ sidebarVisible: newState });
    }
  };

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative min-h-screen w-full bg-background">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className={`fixed top-4 ${
              isVisible ? 'right-4' : 'right-4'
            } z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
            shadow-lg hover:bg-accent hover:scale-110 border-primary/20 hover:border-primary group md:hidden`}
          >
            {isVisible ? (
              <PanelLeftClose className="h-4 w-4 text-primary group-hover:text-primary/80" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 text-primary group-hover:text-primary/80" />
            )}
          </Button>

          <div 
            className={`fixed inset-0 bg-background/95 backdrop-blur 
            supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out
            ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <Index />
              </div>
              <Toaster />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;