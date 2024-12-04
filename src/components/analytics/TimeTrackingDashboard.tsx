import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Globe, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeTrackingDashboardProps {
  totalVisits: number;
  avgTimePerVisit: number;
  topDomain: string;
  productivityScore: number;
  className?: string;
}

export const TimeTrackingDashboard = ({
  totalVisits,
  avgTimePerVisit,
  topDomain,
  productivityScore,
  className
}: TimeTrackingDashboardProps) => {
  return (
    <div className={`space-y-6 animate-fadeIn ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h2>
        <Select defaultValue="this-week">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">Total Visits</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-bold">{totalVisits}</span>
                <p className="text-sm text-muted-foreground">Across all bookmarks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">Avg. Time Per Visit</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-bold">{avgTimePerVisit} min</span>
                <p className="text-sm text-muted-foreground">Time spent reading</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">Top Domain</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-bold truncate">{topDomain}</span>
                <p className="text-sm text-muted-foreground">Most frequently visited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">Productivity Score</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-bold">{productivityScore}%</span>
                <p className="text-sm text-muted-foreground">Based on category usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};