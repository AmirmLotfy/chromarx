import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";

interface ProductivityScoreProps {
  score: number;
  className?: string;
}

export const ProductivityScore = ({ score, className }: ProductivityScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Productivity Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {score >= 80
              ? "Excellent productivity! Keep up the great work!"
              : score >= 60
              ? "Good progress, but there's room for improvement."
              : "Consider implementing the suggestions to improve your productivity."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
