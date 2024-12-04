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
    
    // Set initial dimensions
    document.body.style.width = '800px';
    document.body.style.height = '600px';
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
        <div className="relative w-full h-full min-h-[600px]">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className={`fixed top-1/2 -translate-y-1/2 ${
              isVisible ? 'right-[calc(100%-12px)]' : 'right-4'
            } z-50 transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
            shadow-lg hover:bg-accent hover:scale-110 border-primary/20 hover:border-primary group`}
          >
            {isVisible ? (
              <PanelLeftClose className="h-4 w-4 text-primary group-hover:text-primary/80" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 text-primary group-hover:text-primary/80" />
            )}
          </Button>

          <div 
            className={`fixed inset-y-0 right-0 w-full bg-background/95 backdrop-blur 
            supports-[backdrop-filter]:bg-background/60 border-l border-border/40 
            transition-transform duration-300 ease-in-out shadow-xl
            ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="h-screen flex flex-col overflow-hidden">
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