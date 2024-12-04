import { Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: string;
  onPriorityChange: (priority: string) => void;
  filterCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalTasks?: number;
}

export const TaskFilters = ({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange,
  filterCategory,
  onCategoryChange,
  categories,
  totalTasks = 0,
}: TaskFiltersProps) => {
  return (
    <Card className="mb-6 border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            {totalTasks > 0 && (
              <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {totalTasks} tasks
              </Badge>
            )}
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <Select value={filterPriority} onValueChange={onPriorityChange}>
              <SelectTrigger className="w-[140px] border-primary/20 bg-background/50 hover:bg-background/80 transition-all duration-200">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low" className="text-green-500">Low Priority</SelectItem>
                <SelectItem value="medium" className="text-yellow-500">Medium Priority</SelectItem>
                <SelectItem value="high" className="text-red-500">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[140px] border-primary/20 bg-background/50 hover:bg-background/80 transition-all duration-200">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};