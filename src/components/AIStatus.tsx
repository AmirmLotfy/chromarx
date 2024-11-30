import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const AIStatus = () => {
  const [status, setStatus] = useState<'checking' | 'downloading' | 'available' | 'unavailable'>('checking');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const checkAIStatus = async () => {
      if (!window.ai?.languageModel || !window.ai?.summarizer || !window.translation) {
        setStatus('unavailable');
        return;
      }

      try {
        const [promptCapabilities, summarizerCapabilities] = await Promise.all([
          window.ai.languageModel.capabilities(),
          window.ai.summarizer.capabilities(),
        ]);

        const translationCapabilities = await window.translation.canTranslate({
          sourceLanguage: 'en',
          targetLanguage: 'es'
        });
        
        if (promptCapabilities.available === 'no' || 
            summarizerCapabilities.available === 'no' || 
            translationCapabilities === 'no') {
          setStatus('unavailable');
        } else if (promptCapabilities.available === 'after-download' || 
                   summarizerCapabilities.available === 'after-download' ||
                   translationCapabilities === 'after-download') {
          setStatus('downloading');
          setIsDownloading(true);
          
          // Initialize all models to trigger downloads
          const session = await window.ai.languageModel.create({
            systemPrompt: "You are a helpful AI assistant.",
            monitor: (monitor) => {
              monitor.addEventListener('downloadprogress', (e: any) => {
                setProgress(Math.round((e.loaded / e.total) * 100));
              });
            }
          });

          const summarizer = await window.ai.summarizer.create();
          const translator = await window.translation.createTranslator({
            sourceLanguage: 'en',
            targetLanguage: 'es'
          });

          if (session.ready) await session.ready;
          if (summarizer.ready) await summarizer.ready;
          if (translator.ready) await translator.ready;
          
          setStatus('available');
          setIsDownloading(false);
          
          session.destroy();
          summarizer.destroy();
        } else {
          setStatus('available');
        }
      } catch (error) {
        console.error('Error checking AI status:', error);
        setStatus('unavailable');
        toast({
          title: "Error",
          description: "Failed to initialize Chrome's built-in AI capabilities",
          variant: "destructive",
        });
      }
    };

    checkAIStatus();
  }, [toast]);

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Chrome AI status...
      </div>
    );
  }

  if (status === 'downloading') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading Chrome AI models...
        </div>
        <Progress value={progress} className="h-2 w-full" />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="text-destructive">
        Chrome's built-in AI capabilities are not available. Please ensure you have Chrome version 128+ and have enabled the required flags.
      </div>
    );
  }

  return (
    <div className="text-primary">
      Chrome AI capabilities are ready
    </div>
  );
};