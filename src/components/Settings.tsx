import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Shield, Moon } from "lucide-react";
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

interface SettingsProps {
  onSettingsChange: (settings: UserSettings) => void;
  initialSettings: UserSettings;
}

export interface UserSettings {
  enableAI: boolean;
  showSummaries: boolean;
  privacyMode: boolean;
}

export const Settings = ({ onSettingsChange, initialSettings }: SettingsProps) => {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
    toast({
      title: "Theme Updated",
      description: `Switched to ${isDark ? "dark" : "light"} mode.`,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customize ChroMarx</SheetTitle>
          <SheetDescription>
            Configure your bookmark management preferences
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <SettingItem
            label="Dark Mode"
            description="Toggle between light and dark theme"
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
            icon={Moon}
          />
          <SettingItem
            label="Enable AI Features"
            description="Use AI for categorization and summaries"
            checked={settings.enableAI}
            onCheckedChange={(checked) => handleSettingChange("enableAI", checked)}
          />
          <SettingItem
            label="Auto-generate Summaries"
            description="Create summaries when adding bookmarks"
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
        </div>
      </SheetContent>
    </Sheet>
  );
};