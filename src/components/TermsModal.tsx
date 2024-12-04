import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TermsModal = ({ open, onOpenChange }: TermsModalProps) => {
  const formattedDate = format(new Date(), "MMMM d, yyyy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last updated: {formattedDate}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
              <p>By installing and using ChroMarx, you agree to these terms and conditions. If you disagree with any part of these terms, you should uninstall the extension immediately.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Service Description</h3>
              <p className="mb-2">ChroMarx provides the following services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bookmark management and organization</li>
                <li>AI-powered categorization and summaries</li>
                <li>Cross-device synchronization</li>
                <li>Privacy-focused bookmark handling</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. User Responsibilities</h3>
              <p className="mb-2">Users must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the extension in compliance with all applicable laws</li>
                <li>Maintain the security of their browser and device</li>
                <li>Not attempt to reverse engineer or modify the extension</li>
                <li>Report any security vulnerabilities or bugs</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Intellectual Property</h3>
              <p>All content, features, and functionality within ChroMarx are protected by intellectual property rights. Users may not copy, modify, or distribute the extension's code or content without explicit permission.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Service Modifications</h3>
              <p className="mb-2">We reserve the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue features</li>
                <li>Update the extension for security or functionality</li>
                <li>Change terms of service with notice to users</li>
                <li>Limit service availability in certain regions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Limitation of Liability</h3>
              <p>ChroMarx is provided "as is" without warranties. We are not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data loss or corruption</li>
                <li>Service interruptions or failures</li>
                <li>Accuracy of AI-generated content</li>
                <li>Third-party website content or availability</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Privacy and Data Protection</h3>
              <p>User privacy and data protection are governed by our Privacy Policy. Users should review this document to understand how their data is collected, used, and protected.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">8. Termination</h3>
              <p>Users may terminate their use of ChroMarx at any time by uninstalling the extension. We reserve the right to terminate or restrict service to any user violating these terms.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">9. Contact Information</h3>
              <p>For questions about these terms or the extension's services, please contact us through the feedback form in the extension settings.</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};