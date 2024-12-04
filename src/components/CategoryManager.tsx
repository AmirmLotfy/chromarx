import { useState } from "react";
import { Plus, Tags, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/bookmark";
import { useToast } from "@/components/ui/use-toast";

const categoryColors: Record<string, string> = {
  Work: "bg-[#9b87f5]/20 text-[#9b87f5]",
  Personal: "bg-[#D6BCFA]/20 text-[#7E69AB]",
  Shopping: "bg-[#6E59A5]/20 text-[#6E59A5]",
  Reading: "bg-[#E5DEFF]/30 text-[#8B5CF6]",
  Entertainment: "bg-[#FFDEE2]/30 text-[#D946EF]",
  Social: "bg-[#FDE1D3]/30 text-[#F97316]",
  News: "bg-[#D3E4FD]/30 text-[#0EA5E9]",
  Development: "bg-[#F2FCE2]/30 text-[#4CAF50]",
  Education: "bg-[#FEF7CD]/30 text-[#F59E0B]",
  Other: "bg-[#F1F0FB]/30 text-[#8E9196]",
};

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddAISuggestion: (suggestion: string) => void;
}

export const CategoryManager = ({ 
  categories, 
  onAddCategory, 
  onDeleteCategory,
  onAddAISuggestion 
}: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.trim(),
    };

    onAddCategory(category);
    setNewCategory("");
    
    toast({
      title: "Category added",
      description: `${category.name} has been added to your categories`,
    });
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    onDeleteCategory(categoryId);
    toast({
      title: "Category deleted",
      description: `${categoryName} has been removed from your categories`,
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const normalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    return categoryColors[normalizedName] || categoryColors.Other;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
              getCategoryColor(category.name)
            }`}
          >
            <Tags className="h-3 w-3" />
            {category.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:text-destructive"
              onClick={() => handleDeleteCategory(category.id, category.name)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};