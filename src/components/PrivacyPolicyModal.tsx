import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyModal = ({ open, onOpenChange }: PrivacyPolicyModalProps) => {
  const formattedDate = format(new Date(), "MMMM d, yyyy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: {formattedDate}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Information Collection</h3>
              <p className="mb-2">ChroMarx collects and processes the following types of data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bookmark data (titles, URLs, and folder organization)</li>
                <li>User preferences and extension settings</li>
                <li>Optional AI-generated summaries and categories</li>
                <li>Anonymous usage statistics for feature improvement</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Data Storage and Protection</h3>
              <p className="mb-2">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Local storage encryption for sensitive bookmark data</li>
                <li>Secure data transmission when syncing across devices</li>
                <li>Regular security audits and updates</li>
                <li>No collection of personally identifiable information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Data Usage</h3>
              <p className="mb-2">Your data is used exclusively for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing bookmark management functionality</li>
                <li>Improving extension features and performance</li>
                <li>Generating AI-powered suggestions (when enabled)</li>
                <li>Syncing settings across devices (optional)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. User Rights and Control</h3>
              <p className="mb-2">You have complete control over your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and export your bookmark data at any time</li>
                <li>Delete or modify stored information</li>
                <li>Opt-out of AI features and data collection</li>
                <li>Control sync settings and privacy preferences</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Third-Party Services</h3>
              <p className="mb-2">We use limited third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chrome Storage API for bookmark synchronization</li>
                <li>AI processing services for bookmark categorization (optional)</li>
                <li>Anonymous analytics for extension improvement</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Data Retention</h3>
              <p>Your data is retained only as long as necessary for providing our services. Local data can be cleared at any time through the extension settings. Synced data is retained until you choose to delete it or remove the extension.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Updates to Privacy Policy</h3>
              <p>We may update this privacy policy to reflect changes in our practices or for legal compliance. Users will be notified of significant changes through the extension interface.</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};