import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const ConsentDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already given consent
    chrome.storage.sync.get(['userConsent'], (result) => {
      if (result.userConsent === undefined) {
        setOpen(true);
      }
    });
  }, []);

  const handleAccept = () => {
    chrome.storage.sync.set({ userConsent: true }, () => {
      setOpen(false);
      toast({
        title: "Consent Saved",
        description: "Thank you for accepting our privacy policy.",
      });
      // Reload the page to apply consent settings
      window.location.reload();
    });
  };

  const handleDecline = () => {
    chrome.storage.sync.set({ userConsent: false }, () => {
      setOpen(false);
      toast({
        title: "Consent Declined",
        description: "Some features will be limited without data collection consent.",
        variant: "destructive",
      });
      // Reload the page to apply consent settings
      window.location.reload();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Privacy Consent</DialogTitle>
          <DialogDescription>
            ChroMarx needs your consent to collect and process bookmark data for AI-powered features. We respect your privacy and handle your data securely.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            By accepting, you allow us to:
          </p>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>Access and analyze your bookmarks</li>
            <li>Store preferences and settings</li>
            <li>Process data for AI-powered features</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            You can change your preferences anytime in settings.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};