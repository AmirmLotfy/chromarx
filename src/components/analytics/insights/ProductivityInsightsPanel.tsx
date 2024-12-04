import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "@/types/bookmark";
import { Brain, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductivityInsightsPanelProps {
  bookmarks: Bookmark[];
}

export const ProductivityInsightsPanel = ({ bookmarks }: ProductivityInsightsPanelProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const generateInsights = async () => {
      if (!window.ai?.languageModel) return;

      const session = await window.ai.languageModel.create({
        systemPrompt: "You are a productivity analysis assistant. Analyze bookmark data and provide actionable insights and recommendations."
      });

      try {
        const response = await session.prompt(
          `Analyze this bookmark data and provide:
          1. Three key insights about productivity patterns
          2. Three specific recommendations for improving productivity
          ${JSON.stringify(bookmarks)}`
        );

        const lines = response.split('\n').filter(line => line.trim());
        setInsights(lines.slice(0, 3));
        setRecommendations(lines.slice(3, 6));
      } finally {
        session.destroy();
      }
    };

    if (bookmarks.length > 0) {
      generateInsights();
    }
  }, [bookmarks]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Productivity Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <h4 className="font-medium">Key Insights</h4>
          </div>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground p-2 rounded-lg bg-accent/5"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-blue-400" />
            <h4 className="font-medium">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground p-2 rounded-lg bg-accent/5"
              >
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};