import { SearchBar } from "@/components/SearchBar";
import { Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";

interface BookmarkFiltersProps {
  selectedCategory: string;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  categories?: Category[];
  isGenerating?: boolean;
}

export const BookmarkFilters = ({
  onSearch,
}: BookmarkFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SearchBar onSearch={onSearch} />
    </div>
  );
};