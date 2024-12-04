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
import { Check, X } from "lucide-react";

interface CategorySuggestion {
  bookmarkId: string;
  bookmarkTitle: string;
  suggestedCategory: string;
}

interface CategorySuggestionDialogProps {
  suggestions: CategorySuggestion[];
  currentIndex: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onSkip: () => void;
}

export const CategorySuggestionDialog = ({
  suggestions,
  currentIndex,
  isOpen,
  onOpenChange,
  onAccept,
  onSkip,
}: CategorySuggestionDialogProps) => {
  const currentSuggestion = suggestions[currentIndex];

  if (!currentSuggestion) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Category Suggestion</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Bookmark: <span className="font-medium">{currentSuggestion.bookmarkTitle}</span>
            </p>
            <p>
              Suggested Category: <span className="font-medium">{currentSuggestion.suggestedCategory}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {suggestions.length} suggestions
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSkip} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Skip
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAccept} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};