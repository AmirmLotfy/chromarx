import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SmartSuggestionsProps {
  suggestions: string[];
  isLoading?: boolean;
  className?: string;
}

export const SmartSuggestions = ({ suggestions, isLoading = false, className }: SmartSuggestionsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI-Powered Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Generating insights...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                >
                  <span className="text-primary font-medium mt-0.5">{index + 1}.</span>
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{suggestion}</ReactMarkdown>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add more bookmarks to receive AI-powered suggestions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};