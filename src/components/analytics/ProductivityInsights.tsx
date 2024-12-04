import { TrendingUp, Clock } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import { useEffect, useState } from "react";

interface ProductivityInsightsProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const ProductivityInsights = ({ bookmarks, className }: ProductivityInsightsProps) => {
  const [overview, setOverview] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const generateInsights = async () => {
      if (!window.ai?.languageModel) return;

      const session = await window.ai.languageModel.create({
        systemPrompt: "You are a productivity insights assistant. Analyze bookmark data and provide actionable insights."
      });

      const response = await session.prompt(
        `Analyze this bookmark data and provide:
        1. A brief productivity overview
        2. 3 specific recommendations for improvement
        ${JSON.stringify(bookmarks)}`
      );

      const lines = response.split('\n').filter(line => line.trim());
      const overviewText = lines[0];
      const recommendationsList = lines.slice(1, 4);

      setOverview(overviewText);
      setRecommendations(recommendationsList);
      session.destroy();
    };

    generateInsights();
  }, [bookmarks]);

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Productivity Overview
      </h3>
      <p className="text-sm text-muted-foreground">{overview || "Your productivity score is 0%. Consider allocating more time to work-related activities."}</p>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Recommendations
        </h4>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-accent/5"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-medium">{index + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};