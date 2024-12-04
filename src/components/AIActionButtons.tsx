import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SupportedLanguage } from "@/utils/translationUtils";
import { LanguageSelector } from "@/components/LanguageSelector";

interface AIActionButtonsProps {
  selectedCount: number;
  isGenerating: boolean;
  onGenerateSummaries: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const AIActionButtons = ({
  selectedCount,
  isGenerating,
  onGenerateSummaries,
  selectedLanguage,
  onLanguageChange,
}: AIActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        disabled={isGenerating}
      />
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
          : `Generate Summaries (${selectedCount})`}
      </Button>
    </div>
  );
};