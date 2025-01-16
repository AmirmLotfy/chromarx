import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Index } from "@/pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative min-h-screen w-full bg-background">
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <Index />
            </div>
            <Toaster />
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;