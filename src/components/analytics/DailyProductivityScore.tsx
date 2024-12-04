import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { generateProductivityTips } from "@/utils/aiUtils";
import ReactMarkdown from "react-markdown";

interface DailyProductivityScoreProps {
  score: number;
  suggestions: string[];
  onFeedback: (isPositive: boolean) => void;
  className?: string;
}

export const DailyProductivityScore = ({
  score,
  suggestions,
  onFeedback,
  className,
}: DailyProductivityScoreProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);

  const handleFeedback = (isPositive: boolean) => {
    onFeedback(isPositive);
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve our recommendations.",
    });
  };

  const handleGenerateTips = async () => {
    setIsGenerating(true);
    try {
      const tips = await generateProductivityTips(score);
      // Convert single string to array if needed
      const tipsArray = Array.isArray(tips) ? tips : [tips];
      setAiTips(tipsArray);
      toast({
        title: "New Tips Generated",
        description: "AI has generated new productivity tips based on your score.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate productivity tips",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Daily Productivity Score</h3>
        <Progress value={score} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">Today's productivity score: {score}%</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">AI Suggestions</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTips}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate Tips"}
          </Button>
        </div>
        <div className="space-y-2">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Generating productivity tips...</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {(aiTips.length > 0 ? aiTips : suggestions).map((suggestion, index) => (
                <li key={index} className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{suggestion}</ReactMarkdown>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Was this assessment accurate?</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(true)}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            Yes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(false)}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            No
          </Button>
        </div>
      </div>
    </div>
  );
};