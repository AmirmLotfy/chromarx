import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchNotesProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchNotes = ({ searchQuery, onSearchChange }: SearchNotesProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 w-full"
      />
    </div>
  );
};