import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface KeyMetricsProps {
  completionRate: number;
  dueSoonTasks: number;
  highPriorityTasks: number;
}

export const KeyMetrics = ({ completionRate, dueSoonTasks, highPriorityTasks }: KeyMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-500">{completionRate.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold text-amber-500">{dueSoonTasks}</div>
            <div className="text-sm text-muted-foreground">Due Soon</div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold text-red-500">{highPriorityTasks}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};