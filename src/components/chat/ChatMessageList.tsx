import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { Message } from "@/types/chat";
import { Bookmark } from "@/types/bookmark";

interface ChatMessageListProps {
  messages: Message[];
  onBookmarkSelect?: (bookmark: Bookmark) => void;
}

export const ChatMessageList = ({ messages, onBookmarkSelect }: ChatMessageListProps) => {
  return (
    <ScrollArea className="h-[500px] px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-accent/10">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground h-full flex items-center justify-center flex-col gap-3">
            <MessageCircle className="h-8 w-8 text-primary/20" />
            <p className="text-sm">Ask me anything about your bookmarks</p>
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
  );
};