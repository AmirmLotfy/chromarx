import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
      <Input
        type="text"
        placeholder="Search bookmarks..."
        value={query}
        onChange={handleChange}
        className="pl-10 bg-transparent border-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/40 w-full"
      />
    </div>
  );
};