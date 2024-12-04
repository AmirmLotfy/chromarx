import { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import { findRelatedBookmarks, generateChatResponse } from "@/utils/chatUtils";
import { SupportedLanguage, translateText } from "@/utils/translationUtils";
import { verifyAIModels } from "@/utils/aiUtils";

interface UseAIChatProps {
  selectedLanguage: SupportedLanguage;
}

export const useAIChat = ({ selectedLanguage }: UseAIChatProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChatQuery = async (userMessage: string, bookmarks: Bookmark[]) => {
    setIsLoading(true);
    
    try {
      // Verify AI capabilities before proceeding
      await verifyAIModels();

      const relatedBookmarks = await findRelatedBookmarks(userMessage, bookmarks);
      const { response, webResults } = await generateChatResponse(userMessage, relatedBookmarks);
      
      // Translate response if needed
      const translatedResponse = selectedLanguage !== 'en' 
        ? await translateText(response, selectedLanguage)
        : response;

      return {
        role: 'assistant' as const,
        content: translatedResponse,
        relatedBookmarks,
        webResults
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleChatQuery
  };
};