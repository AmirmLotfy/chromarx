import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Bookmark } from "@/types/bookmark";
import { Globe } from "lucide-react";

interface DomainDistributionProps {
  bookmarks: Bookmark[];
  className?: string;
}

export const DomainDistribution = ({ bookmarks, className }: DomainDistributionProps) => {
  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "unknown";
    }
  };

  const domainData = bookmarks.reduce((acc: { [key: string]: number }, bookmark) => {
    const domain = getDomainFromUrl(bookmark.url);
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(domainData)
    .map(([domain, count]) => ({
      name: domain,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const COLORS = ['#9b87f5', '#D6BCFA', '#6E59A5', '#E5DEFF', '#FFDEE2', '#22c55e', '#86efac', '#4ade80', '#bbf7d0', '#dcfce7'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Time Distribution by Domain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};