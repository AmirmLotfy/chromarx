import { Button } from "@/components/ui/button";
import { Category } from "@/types/bookmark";
import { getCategoryColors } from "@/utils/categoryColors";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories = [],
}: CategoryFilterProps) => {
  const defaultCategories = ["all", "Work", "Personal", "Shopping", "Reading", "Entertainment", "Social", "News", "Development", "Education", "Other", "Uncategorized"];
  
  const allCategories = Array.from(new Set([
    ...defaultCategories,
    ...categories.map(c => c.name)
  ]));

  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-accent/20">
      {allCategories.map((category) => {
        const isAISuggested = categories?.some(c => 
          c.name === category && c.isAISuggested
        );
        const isSelected = selectedCategory === category;
        const colors = getCategoryColors(category);

        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`capitalize transition-all duration-200 shadow-sm ${
              isSelected 
                ? colors.bg + ' ' + colors.text + ' border-primary/20' 
                : 'hover:bg-accent/20 border-accent/10'
            }`}
          >
            {category}
            {isAISuggested && (
              <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                AI
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};