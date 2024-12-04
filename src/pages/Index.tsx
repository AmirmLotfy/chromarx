import { MainLayout } from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIZoneTab } from "@/components/tabs/AIZoneTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { TimerTab } from "@/components/tabs/TimerTab";
import { TasksTab } from "@/components/tabs/TasksTab";
import { NotesTab } from "@/components/tabs/NotesTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Index = () => {
  const [activeTab, setActiveTab] = useState("ai-zone");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const tabs = [
    { id: "ai-zone", label: "AI Zone" },
    { id: "analytics", label: "Analytics" },
    { id: "timer", label: "Timer" },
    { id: "tasks", label: "Tasks" },
    { id: "notes", label: "Notes" }
  ];

  return (
    <MainLayout>
      <div className="w-full max-w-[1200px] mx-auto space-y-4">
        {isMobile ? (
          <div className="w-full px-2">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SelectValue>
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map(tab => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 rounded-lg overflow-hidden">
              {activeTab === "ai-zone" && <AIZoneTab />}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "timer" && <TimerTab />}
              {activeTab === "tasks" && <TasksTab />}
              {activeTab === "notes" && <NotesTab />}
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-5 bg-background/50 backdrop-blur-sm p-2 rounded-lg">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-2.5 text-sm font-medium transition-all duration-200
                    data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                    data-[state=active]:shadow-sm data-[state=active]:scale-[1.02]
                    hover:bg-accent/5 hover:text-accent-foreground"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 rounded-lg overflow-hidden">
              <TabsContent value="ai-zone" className="mt-0 focus-visible:outline-none">
                <AIZoneTab />
              </TabsContent>
              <TabsContent value="analytics" className="mt-0 focus-visible:outline-none">
                <AnalyticsTab />
              </TabsContent>
              <TabsContent value="timer" className="mt-0 focus-visible:outline-none">
                <TimerTab />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0 focus-visible:outline-none">
                <TasksTab />
              </TabsContent>
              <TabsContent value="notes" className="mt-0 focus-visible:outline-none">
                <NotesTab />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};