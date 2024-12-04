import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Shield, Moon, MessageSquare, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { SettingItem } from "./SettingItem";
import { feedbackSystem } from "@/utils/feedbackSystem";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { TermsModal } from "./TermsModal";
import { FeedbackForm } from "./FeedbackForm";

interface SettingsProps {
  onSettingsChange: (settings: UserSettings) => void;
  initialSettings: UserSettings;
}

export interface UserSettings {
  enableAI: boolean;
  showSummaries: boolean;
  privacyMode: boolean;
  syncEnabled: boolean;
}

export const Settings = ({ onSettingsChange, initialSettings }: SettingsProps) => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Load settings from chrome.storage.sync on component mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['userSettings'], (result) => {
        if (result.userSettings) {
          setSettings(result.userSettings);
          onSettingsChange(result.userSettings);
        }
      });
    }
  }, []);

  const handleSettingChange = async (key: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    // Save settings to chrome.storage.sync
    if (typeof chrome !== 'undefined' && chrome.storage) {
      try {
        await chrome.storage.sync.set({ userSettings: newSettings });
        toast({
          title: "Settings Updated",
          description: "Your preferences have been saved and synced.",
        });
      } catch (error) {
        toast({
          title: "Sync Error",
          description: "Failed to sync settings. Please try again.",
          variant: "destructive",
        });
      }
    }

    feedbackSystem.addFeedback('settings', 5, `Changed ${key} to ${value}`);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Configure your bookmark management preferences
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <SettingItem
              label="Dark Mode"
              description="Toggle between light and dark theme"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              icon={Moon}
            />
            <SettingItem
              label="Enable AI Features"
              description="Use AI for categorization and summaries"
              checked={settings.enableAI}
              onCheckedChange={(checked) => handleSettingChange("enableAI", checked)}
            />
            <SettingItem
              label="Show Summaries"
              description="Display AI-generated summaries"
              checked={settings.showSummaries}
              onCheckedChange={(checked) => handleSettingChange("showSummaries", checked)}
            />
            <SettingItem
              label="Privacy Mode"
              description="Enhanced privacy for sensitive bookmarks"
              checked={settings.privacyMode}
              onCheckedChange={(checked) => handleSettingChange("privacyMode", checked)}
              icon={Shield}
            />
            <SettingItem
              label="Sync Settings"
              description="Sync your settings across devices"
              checked={settings.syncEnabled}
              onCheckedChange={(checked) => handleSettingChange("syncEnabled", checked)}
              icon={RefreshCw}
            />

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setPrivacyModalOpen(true)}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setTermsModalOpen(true)}
              >
                Terms & Conditions
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => setFeedbackFormOpen(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <PrivacyPolicyModal
        open={privacyModalOpen}
        onOpenChange={setPrivacyModalOpen}
      />
      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
      />
      <FeedbackForm
        open={feedbackFormOpen}
        onOpenChange={setFeedbackFormOpen}
      />
    </>
  );
};