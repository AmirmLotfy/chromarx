import { Progress } from "@/components/ui/progress";

interface AIProgressBarProps {
  isGenerating: boolean;
  progress: number;
}

export const AIProgressBar = ({ isGenerating, progress }: AIProgressBarProps) => {
  if (!isGenerating) return null;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 bg-secondary/20 p-4 rounded-lg border border-secondary">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Generating summaries... Please wait</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
      <p className="text-xs text-muted-foreground">
        This may take a few moments depending on the number of bookmarks
      </p>
    </div>
  );
};