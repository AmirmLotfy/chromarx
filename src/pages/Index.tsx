import { MainLayout } from "@/components/layouts/MainLayout";
import { AIZoneTab } from "@/components/tabs/AIZoneTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { TimerTab } from "@/components/tabs/TimerTab";
import { TasksTab } from "@/components/tabs/TasksTab";
import { NotesTab } from "@/components/tabs/NotesTab";
import { useState } from "react";
import { Brain, BarChart2, Timer, ListTodo, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

export const Index = () => {
  const [activeTab, setActiveTab] = useState("ai-zone");

  const tabs = [
    { id: "ai-zone", label: "AI", icon: Brain },
    { id: "analytics", label: "Stats", icon: BarChart2 },
    { id: "timer", label: "Timer", icon: Timer },
    { id: "tasks", label: "Tasks", icon: ListTodo },
    { id: "notes", label: "Notes", icon: StickyNote }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-[600px] w-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-16">
          {activeTab === "ai-zone" && <AIZoneTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "timer" && <TimerTab />}
          {activeTab === "tasks" && <TasksTab />}
          {activeTab === "notes" && <NotesTab />}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
          <nav className="flex h-full items-center justify-around px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-full",
                    "transition-colors duration-200",
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary/80"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </MainLayout>
  );
};