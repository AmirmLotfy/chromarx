import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Brain, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface CategorySuggestionsDropdownProps {
  suggestions: Array<{
    bookmarkId: string;
    bookmarkTitle: string;
    suggestedCategory: string;
  }>;
  onAcceptSuggestion: (bookmarkId: string, category: string) => void;
  onDeclineSuggestion: (bookmarkId: string) => void;
}

export const CategorySuggestionsDropdown = ({
  suggestions,
  onAcceptSuggestion,
  onDeclineSuggestion,
}: CategorySuggestionsDropdownProps) => {
  const { toast } = useToast();
  const [showBulkAcceptDialog, setShowBulkAcceptDialog] = useState(false);

  const handleAccept = (bookmarkId: string, category: string) => {
    onAcceptSuggestion(bookmarkId, category);
    toast({
      title: "Category Accepted",
      description: `Applied category "${category}" to the bookmark`,
    });
  };

  const handleDecline = (bookmarkId: string) => {
    onDeclineSuggestion(bookmarkId);
    toast({
      title: "Category Declined",
      description: "Suggestion removed",
    });
  };

  const handleBulkAccept = () => {
    suggestions.forEach(suggestion => {
      handleAccept(suggestion.bookmarkId, suggestion.suggestedCategory);
    });
    setShowBulkAcceptDialog(false);
  };

  const handleBulkDecline = () => {
    suggestions.forEach(suggestion => {
      handleDecline(suggestion.bookmarkId);
    });
  };

  if (suggestions.length === 0) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary"
          >
            <Brain className="h-4 w-4" />
            {suggestions.length} Suggestions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          {suggestions.map((suggestion) => (
            <DropdownMenuItem
              key={suggestion.bookmarkId}
              className="flex items-center justify-between p-2 hover:bg-accent"
            >
              <div className="flex-1">
                <div className="font-medium truncate">
                  {suggestion.bookmarkTitle}
                </div>
                <div className="text-sm text-muted-foreground">
                  Suggested: {suggestion.suggestedCategory}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(suggestion.bookmarkId, suggestion.suggestedCategory);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecline(suggestion.bookmarkId);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="p-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => setShowBulkAcceptDialog(true)}
            >
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleBulkDecline}
            >
              Decline All
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBulkAcceptDialog} onOpenChange={setShowBulkAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept All Categories?</AlertDialogTitle>
            <AlertDialogDescription>
              This will apply the suggested categories to all selected bookmarks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAccept}>Accept All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};