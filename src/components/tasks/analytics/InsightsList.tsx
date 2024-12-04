import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface AIInsight {
  type: 'productivity' | 'time' | 'category' | 'priority' | 'suggestion';
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface InsightsListProps {
  insights: AIInsight[];
  isLoading: boolean;
}

export const InsightsList = ({ insights, isLoading }: InsightsListProps) => {
  return (
    <Card className="border-primary/10">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Clock className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="bg-accent/5 border-accent/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className={`${insight.color} mt-1`}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};