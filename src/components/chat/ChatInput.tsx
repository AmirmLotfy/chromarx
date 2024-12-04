import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ input, setInput, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 relative">
      {isLoading && (
        <div className="absolute -top-12 left-0 right-0 flex items-center justify-center">
          <div className="bg-secondary/10 text-secondary text-xs px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing your request...
          </div>
        </div>
      )}
      
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your bookmarks..."
        disabled={isLoading}
        className={cn(
          "flex-1 bg-background/80 backdrop-blur-sm border-accent/20",
          "focus-visible:ring-1 focus-visible:ring-primary/20 text-sm rounded-lg",
          isLoading && "opacity-50"
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              onSubmit(e);
            }
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input.trim()} 
        size="icon"
        className={cn(
          "bg-primary/10 hover:bg-primary/20 text-primary rounded-lg",
          "transition-all duration-200",
          isLoading && "opacity-50"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};