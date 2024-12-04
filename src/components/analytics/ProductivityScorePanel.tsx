import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { generateProductivityTips } from "@/utils/aiUtils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductivityScorePanelProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export const ProductivityScorePanel = ({ score, trend }: ProductivityScorePanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTips = async () => {
    setIsGenerating(true);
    try {
      const tips = await generateProductivityTips(score);
      toast({
        title: "Productivity Tips",
        description: tips,
        duration: 5000,
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
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Productivity Score</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateTips}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Get AI Tips
        </Button>
      </div>
      
      <div className="text-3xl font-bold text-primary">
        {score}
        <span className="text-sm text-muted-foreground ml-1">/ 100</span>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {trend === 'up' && '↑ Improving'}
        {trend === 'down' && '↓ Declining'}
        {trend === 'stable' && '→ Stable'}
      </div>
    </Card>
  );
};