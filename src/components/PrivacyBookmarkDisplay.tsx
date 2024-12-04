import { Bookmark } from "@/types/bookmark";
import { maskSensitiveData, maskUrl } from "@/utils/privacyUtils";

interface PrivacyBookmarkDisplayProps {
  bookmark: Bookmark;
  privacyMode: boolean;
}

export const PrivacyBookmarkDisplay = ({ bookmark, privacyMode }: PrivacyBookmarkDisplayProps) => {
  if (!privacyMode) {
    return (
      <>
        <span className="font-medium">{bookmark.title}</span>
        <span className="text-sm text-muted-foreground">{bookmark.url}</span>
      </>
    );
  }

  return (
    <>
      <span className="font-medium">{maskSensitiveData(bookmark.title)}</span>
      <span className="text-sm text-muted-foreground">{maskUrl(bookmark.url)}</span>
    </>
  );
};