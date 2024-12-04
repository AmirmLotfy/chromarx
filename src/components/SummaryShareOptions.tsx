import { Share2, Mail, MessageCircleMore, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SummaryShareOptionsProps {
  onShare: (type: 'whatsapp' | 'email' | 'copy') => void;
}

export const SummaryShareOptions = ({ onShare }: SummaryShareOptionsProps) => {
  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share Summaries
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onShare('whatsapp')}>
            <MessageCircleMore className="h-4 w-4 mr-2" />
            Share via WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('copy')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};