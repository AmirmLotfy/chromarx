import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportedLanguage, languageNames } from "@/utils/translationUtils";

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) => {
  return (
    <Select
      value={selectedLanguage}
      onValueChange={(value: SupportedLanguage) => onLanguageChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px] bg-primary/5 hover:bg-primary/10 border-primary/20">
        <Languages className="h-4 w-4 mr-2 text-primary" />
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languageNames).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};