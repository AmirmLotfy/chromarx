import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-4 fade-in">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {children}
      </div>
    </div>
  );
};