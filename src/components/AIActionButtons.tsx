import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SupportedLanguage, languageNames } from "@/utils/translationUtils";

interface AIActionButtonsProps {
  selectedCount: number;
  isGenerating: boolean;
  onGenerateSummaries: () => void;
  selectedLanguage: SupportedLanguage;
}

export const AIActionButtons = ({
  selectedCount,
  isGenerating,
  onGenerateSummaries,
  selectedLanguage,
}: AIActionButtonsProps) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onGenerateSummaries}
      disabled={selectedCount === 0 || isGenerating}
      className="flex items-center gap-2 min-w-[200px] justify-center bg-primary/5 hover:bg-primary/10"
    >
      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating 
        ? "Generating..." 
        : `Generate Summaries (${languageNames[selectedLanguage]})`}
    </Button>
  );
};