import { Card } from "@/components/ui/card";
import { Star, Clock, Globe, Zap } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import { calculateProductivityScore } from "@/utils/analyticsUtils";
import { useEffect, useState } from "react";

interface DashboardMetricsProps {
  bookmarks: Bookmark[];
}

export const DashboardMetrics = ({ bookmarks }: DashboardMetricsProps) => {
  const [productivityScore, setProductivityScore] = useState(0);

  useEffect(() => {
    const calculateScore = async () => {
      const score = await calculateProductivityScore(bookmarks);
      setProductivityScore(score);
    };
    calculateScore();
  }, [bookmarks]);

  const getTopDomain = () => {
    if (bookmarks.length === 0) return "None";
    const domains = bookmarks.map(b => new URL(b.url).hostname);
    const domainCounts = domains.reduce((acc: Record<string, number>, domain) => {
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});
    const topDomain = Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)[0];
    return topDomain ? topDomain[0] : "None";
  };

  const metrics = [
    {
      icon: Star,
      title: "Total Visits",
      value: bookmarks.length,
      description: "Across all bookmarks",
      color: "text-yellow-400",
      valueClass: "text-4xl font-bold"
    },
    {
      icon: Clock,
      title: "Avg. Time Per Visit",
      value: "0 min",
      description: "Time spent reading",
      color: "text-blue-400",
      valueClass: "text-4xl font-bold text-primary"
    },
    {
      icon: Globe,
      title: "Top Domain",
      value: getTopDomain(),
      description: "Most frequently visited",
      color: "text-green-400",
      valueClass: "text-4xl font-bold text-primary"
    },
    {
      icon: Zap,
      title: "Productivity Score",
      value: `${productivityScore}%`,
      description: "Based on category usage",
      color: "text-purple-400",
      valueClass: "text-4xl font-bold text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="text-sm font-medium">{metric.title}</span>
            </div>
            <div className="space-y-1">
              <span className={metric.valueClass}>{metric.value}</span>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};