import { LanguageSelector } from "@/components/LanguageSelector";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage } from "@/utils/translationUtils";
import { MainSummaryPanel } from "../summaries/MainSummaryPanel";
import { SummaryHistoryPanel } from "../summaries/SummaryHistoryPanel";
import { AutoGeneratedPanel } from "../summaries/AutoGeneratedPanel";

interface SummariesSectionProps {
  bookmarks: Bookmark[];
  selectedBookmarks: Set<string>;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  isGenerating: boolean;
  progress: number;
  summaries: Record<string, string>;
  handleGenerateSummaries: (bookmarks: Bookmark[]) => void;
  handleClearSummaries: () => void;
}

export const SummariesSection = ({
  bookmarks,
  selectedBookmarks,
  selectedLanguage,
  onLanguageChange,
  isGenerating,
  progress,
  summaries,
  handleGenerateSummaries,
  handleClearSummaries,
}: SummariesSectionProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          disabled={isGenerating}
        />
      </div>

      <MainSummaryPanel
        bookmarks={bookmarks}
        selectedBookmarks={selectedBookmarks}
        selectedLanguage={selectedLanguage}
        isGenerating={isGenerating}
        progress={progress}
        summaries={summaries}
        handleGenerateSummaries={handleGenerateSummaries}
        handleClearSummaries={handleClearSummaries}
      />

      <SummaryHistoryPanel bookmarks={bookmarks} summaries={summaries} />
      <AutoGeneratedPanel bookmarks={bookmarks} summaries={summaries} />
    </div>
  );
};