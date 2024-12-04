import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import { findRelatedBookmarks, generateChatResponse } from "@/utils/chatUtils";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { SupportedLanguage, translateText } from "@/utils/translationUtils";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  relatedBookmarks?: Bookmark[];
  webResults?: Array<{ title: string; url: string }>;
}

interface ChatInterfaceProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const ChatInterface = ({ 
  bookmarks, 
  onBookmarkSelect, 
  selectedLanguage,
  onLanguageChange 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      if (!window.ai?.languageModel) {
        throw new Error("Chrome's Language Model API not available");
      }

      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === "no") {
        throw new Error("Chrome's Language Model is not available on this device");
      }

      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const relatedBookmarks = await findRelatedBookmarks(userMessage, bookmarks);
      const { response, webResults } = await generateChatResponse(userMessage, relatedBookmarks);
      const translatedResponse = selectedLanguage !== 'en' 
        ? await translateText(response, selectedLanguage)
        : response;

      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: translatedResponse,
          relatedBookmarks,
          webResults
        }
      ]);

      // Store messages in chrome.storage if available
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ chatMessages: messages });
      }

      if (relatedBookmarks.length > 0 || webResults?.length > 0) {
        toast({
          title: "Found Related Content",
          description: `Found ${relatedBookmarks.length} bookmarks and ${webResults?.length || 0} web results that might help.`,
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('chatMessages');
    }
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared.",
    });
  };

  return (
    <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/10 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Chat Assistant
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            disabled={isLoading}
          />
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              <Trash2 className="h-3 w-3 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-accent/10 h-[500px]">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center flex-col gap-3">
              <MessageCircle className="h-8 w-8 text-primary/20 animate-pulse" />
              <p className="text-sm">
                Ask me anything about your bookmarks
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  {...message}
                  onBookmarkSelect={onBookmarkSelect}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Card>
  );
};