import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "@/types/bookmark";
import { findRelatedBookmarks, generateChatResponse } from "@/utils/chatUtils";
import { SupportedLanguage, translateText } from "@/utils/translationUtils";
import { MessageCircle } from "lucide-react";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { ChatControls } from "./chat/ChatControls";
import { Message } from "@/types/chat";

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
  onLanguageChange,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadChatMessages = async () => {
      if (typeof chrome !== "undefined" && chrome?.storage?.local) {
        try {
          const result = await chrome.storage.local.get(["chatMessages"]);
          if (result.chatMessages) {
            setMessages(result.chatMessages);
          }
        } catch (error) {
          console.error("Error loading chat messages:", error);
        }
      }
    };
    loadChatMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const relatedBookmarks = await findRelatedBookmarks(userMessage, bookmarks);
      const { response, webResults } = await generateChatResponse(
        userMessage,
        relatedBookmarks
      );
      const translatedResponse = selectedLanguage !== "en"
        ? await translateText(response, selectedLanguage)
        : response;

      const newUserMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        timestamp: Date.now()
      };

      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: translatedResponse,
        timestamp: Date.now(),
        relatedBookmarks,
        webResults,
      };

      setMessages(prev => [...prev, newUserMessage, newAssistantMessage]);

      if (relatedBookmarks.length > 0 || webResults?.length > 0) {
        toast({
          title: "Found Related Content",
          description: `Found ${relatedBookmarks.length} bookmarks and ${
            webResults?.length || 0
          } web results that might help.`,
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
      try {
        await chrome.storage.local.remove("chatMessages");
        toast({
          title: "Chat Cleared",
          description: "All messages have been cleared.",
        });
      } catch (error) {
        console.error("Error clearing chat messages:", error);
        toast({
          title: "Error",
          description: "Failed to clear chat messages.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-sm font-medium text-primary dark:text-primary-foreground">
            Chat Assistant
          </h2>
        </div>
        <ChatControls
          onClear={handleClearChat}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          messagesCount={messages.length}
          isLoading={isLoading}
        />
      </div>

      <ChatMessageList messages={messages} onBookmarkSelect={onBookmarkSelect} />

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Card>
  );
};