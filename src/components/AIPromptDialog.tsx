import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIPromptDialogProps {
  onUpdatePrompt: (type: "summary" | "category", prompt: string) => void;
  defaultSummaryPrompt?: string;
  defaultCategoryPrompt?: string;
}

export const AIPromptDialog = ({
  onUpdatePrompt,
  defaultSummaryPrompt = "You are a summarization assistant. Provide a brief, clear summary in 2-3 sentences.",
  defaultCategoryPrompt = "You are a bookmark categorization assistant. Suggest a single category from these options: Work, Personal, Shopping, Reading, Entertainment, Social, News, Development, Education, or Other. Only return the category name, nothing else.",
}: AIPromptDialogProps) => {
  const [summaryPrompt, setSummaryPrompt] = useState(defaultSummaryPrompt);
  const [categoryPrompt, setCategoryPrompt] = useState(defaultCategoryPrompt);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdatePrompt("summary", summaryPrompt);
    onUpdatePrompt("category", categoryPrompt);
    toast({
      title: "AI Prompts Updated",
      description: "Your custom prompts have been saved.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Customize AI Prompts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize AI Prompts</DialogTitle>
          <DialogDescription>
            Customize how AI generates summaries and categories for your bookmarks
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Summary Generation Prompt
            </label>
            <Textarea
              value={summaryPrompt}
              onChange={(e) => setSummaryPrompt(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your custom prompt for summary generation..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Category Suggestion Prompt
            </label>
            <Textarea
              value={categoryPrompt}
              onChange={(e) => setCategoryPrompt(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your custom prompt for category suggestions..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Prompts</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};