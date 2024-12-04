import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateSummary } from "@/utils/aiUtils";
import { Bookmark } from "@/types/bookmark";
import { SupportedLanguage, translateText, languageNames } from "@/utils/translationUtils";

export const useSummaryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [recentSummaries, setRecentSummaries] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleGenerateSummaries = async (selectedBookmarks: Bookmark[], language: SupportedLanguage) => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const newSummaries: Record<string, string> = {};
      
      for (let i = 0; i < selectedBookmarks.length; i++) {
        const bookmark = selectedBookmarks[i];
        const prompt = `Generate a summary for this URL:\n${bookmark.url}`;
        const summary = await generateSummary(prompt);
        
        // Translate the summary if not in English
        const translatedSummary = language !== 'en' 
          ? await translateText(summary, language)
          : summary;
        
        newSummaries[bookmark.id] = translatedSummary;
        
        const currentProgress = ((i + 1) / selectedBookmarks.length) * 100;
        setProgress(currentProgress);
      }
      
      // Update both current summaries and recent summaries
      setSummaries(newSummaries);
      setRecentSummaries(prev => ({...prev, ...newSummaries}));
      
      toast({
        title: "Success",
        description: `Generated summaries for ${selectedBookmarks.length} bookmarks in ${languageNames[language]}`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate or translate summaries",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleClearSummaries = () => {
    setSummaries({}); // Only clear current summaries, keep recent ones
    toast({
      title: "Summaries cleared",
      description: "Current summaries have been cleared.",
    });
  };

  return {
    isGenerating,
    progress,
    summaries,
    recentSummaries,
    handleGenerateSummaries,
    handleClearSummaries
  };
};