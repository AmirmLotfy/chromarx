import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useChatStorage } from "@/hooks/useChatStorage";
import { useAIChat } from "@/hooks/useAIChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { SupportedLanguage } from "@/utils/translationUtils";

interface ChatContainerProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (bookmark: Bookmark) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const ChatContainer = ({
  bookmarks,
  onBookmarkSelect,
  selectedLanguage,
  onLanguageChange,
}: ChatContainerProps) => {
  const [input, setInput] = useState('');
  const { messages, addMessage, clearMessages } = useChatStorage();
  const { isLoading, handleChatQuery } = useAIChat({ selectedLanguage });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    try {
      const response = await handleChatQuery(userMessage, bookmarks);
      addMessage(response);
    } catch (error) {
      console.error("Chat Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      <ChatHeader
        messages={messages}
        onClearChat={clearMessages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        isLoading={isLoading}
      />
      
      <ScrollArea className="flex-1 px-4 py-2 rounded-lg">
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
    </div>
  );
};