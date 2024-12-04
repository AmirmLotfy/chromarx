import { Button } from "@/components/ui/button";
import { Category } from "@/types/bookmark";
import { getCategoryColors } from "@/utils/categoryColors";
import { Trash2, Tags } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: Category[];
  onDeleteCategory?: (categoryId: string) => void;
  className?: string;
  bookmarkCounts?: Record<string, number>;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories = [],
  onDeleteCategory,
  className,
  bookmarkCounts = {},
}: CategoryFilterProps) => {
  const { toast } = useToast();
  const defaultCategories = ["all", "Work", "Personal", "Shopping", "Reading", "Entertainment", "Social", "News", "Development", "Education", "Other", "Uncategorized"];
  
  const uniqueCategories = new Set([
    ...defaultCategories,
    ...categories.map(c => c.name)
  ]);

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (onDeleteCategory) {
      onDeleteCategory(categoryId);
      toast({
        title: "Category deleted",
        description: `Category "${categoryName}" has been removed`,
      });
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-xl font-semibold tracking-tight">Categories</h3>
      <div className="flex flex-wrap gap-3 p-6 rounded-xl border border-accent/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {Array.from(uniqueCategories).map((category) => {
          const categoryObj = categories?.find(c => c.name === category);
          const isAISuggested = categoryObj?.isAISuggested;
          const isSelected = selectedCategory === category;
          const colors = getCategoryColors(category);
          const isDefaultCategory = defaultCategories.includes(category);
          const count = bookmarkCounts[category] || 0;

          return (
            <div key={category} className="flex items-center gap-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`capitalize transition-all duration-300 shadow-sm flex items-center gap-2.5 h-9 ${
                  isSelected 
                    ? colors.bg + ' ' + colors.text + ' border-primary/20 scale-105' 
                    : 'hover:bg-accent/20 border-accent/10 hover:scale-105'
                }`}
              >
                <Tags className={`h-3.5 w-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20' : 'bg-accent/20'
                }`}>
                  {count}
                </span>
                {isAISuggested && (
                  <span className="ml-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </Button>
              {!isDefaultCategory && categoryObj && onDeleteCategory && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDeleteCategory(categoryObj.id, category)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};