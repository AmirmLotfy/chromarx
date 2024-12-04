import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    toast({
      title: "Search cleared",
      description: "Showing all bookmarks",
    });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-4 px-2 sm:px-0">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 py-6 bg-background/50 border-border/50 focus:border-primary/50 hover:border-primary/30 transition-all duration-200 w-full text-base rounded-2xl text-foreground placeholder:text-muted-foreground/70 shadow-sm backdrop-blur-sm"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-primary/10 text-muted-foreground/70"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 shrink-0 rounded-2xl border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-colors duration-200 backdrop-blur-sm"
            >
              <Filter className="h-5 w-5 text-muted-foreground/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="py-3">
              Search in titles
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3">
              Search in URLs
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3">
              Search in categories
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};