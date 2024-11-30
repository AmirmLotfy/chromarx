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
import { Trash2 } from "lucide-react";

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
      // Add user message immediately
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      // Find related bookmarks and generate response
      const relatedBookmarks = await findRelatedBookmarks(userMessage, bookmarks);
      const { response, webResults } = await generateChatResponse(userMessage, relatedBookmarks);
      
      // Translate the response if not in English
      const translatedResponse = selectedLanguage !== 'en' 
        ? await translateText(response, selectedLanguage)
        : response;

      // Add assistant message with related content
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: translatedResponse,
          relatedBookmarks,
          webResults
        }
      ]);

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
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared.",
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
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
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 rounded-lg border bg-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground h-full flex items-center justify-center">
            <p>Ask me anything about your bookmarks! I'll analyze them and provide relevant suggestions.</p>
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
      </ScrollArea>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};