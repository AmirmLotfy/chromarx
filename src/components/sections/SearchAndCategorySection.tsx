import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Category } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";

interface SearchAndCategorySectionProps {
  selectedCategory: string;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  categories?: Category[];
  isGenerating?: boolean;
}

export const SearchAndCategorySection = ({
  selectedCategory,
  selectedLanguage,
  onLanguageChange,
  onCategoryChange,
  onSearch,
  categories = [],
  isGenerating = false,
}: SearchAndCategorySectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <SearchBar onSearch={onSearch} />
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          disabled={isGenerating}
        />
      </div>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
    </div>
  );
};