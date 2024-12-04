import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardMetrics } from "@/components/analytics/metrics/DashboardMetrics";
import { DailyProductivityScore } from "@/components/analytics/DailyProductivityScore";
import { ProductivityInsights } from "@/components/analytics/ProductivityInsights";
import { TimeDistribution } from "@/components/charts/TimeDistribution";
import { DetailedCategoryAnalytics } from "@/components/analytics/DetailedCategoryAnalytics";
import { MostVisitedLinks } from "@/components/analytics/MostVisitedLinks";
import { WeeklyTrends } from "@/components/analytics/WeeklyTrends";
import { ActivityTimeline } from "@/components/analytics/ActivityTimeline";
import { DomainDistribution } from "@/components/analytics/domain/DomainDistribution";
import { CategoryDistribution } from "@/components/analytics/category/CategoryDistribution";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { DraggableAnalyticsCard } from "../analytics/DraggableAnalyticsCard";

interface AnalyticsCard {
  id: string;
  component: React.ReactNode;
}

export const AnalyticsTab = () => {
  const { bookmarks, categories } = useBookmarks();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("this-week");
  const [suggestions] = useState([
    "Consider allocating more time to work-related activities",
    "Take regular breaks to maintain productivity",
    "Group similar tasks to minimize context switching",
    "Focus on high-priority bookmarks first",
    "Review and organize bookmarks weekly"
  ]);

  const [cards, setCards] = useState<AnalyticsCard[]>([]);

  useEffect(() => {
    const initialCards: AnalyticsCard[] = [
      {
        id: "metrics",
        component: <DashboardMetrics bookmarks={bookmarks} />
      },
      {
        id: "domain-distribution",
        component: <DomainDistribution bookmarks={bookmarks} />
      },
      {
        id: "category-distribution",
        component: <CategoryDistribution bookmarks={bookmarks} categories={categories} />
      },
      {
        id: "productivity-score",
        component: (
          <Card className="p-6">
            <DailyProductivityScore
              score={75}
              suggestions={suggestions}
              onFeedback={(isPositive) => {
                toast({
                  title: "Feedback Received",
                  description: `Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`,
                });
              }}
            />
          </Card>
        )
      },
      {
        id: "time-distribution",
        component: <TimeDistribution bookmarks={bookmarks} />
      },
      {
        id: "category-analytics",
        component: <DetailedCategoryAnalytics categories={categories} bookmarks={bookmarks} />
      },
      {
        id: "most-visited",
        component: <MostVisitedLinks bookmarks={bookmarks} />
      },
      {
        id: "weekly-trends",
        component: <WeeklyTrends bookmarks={bookmarks} />
      },
      {
        id: "activity-timeline",
        component: <ActivityTimeline bookmarks={bookmarks} />
      }
    ];
    setCards(initialCards);
  }, [bookmarks, categories, suggestions, toast]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      toast({
        title: "Layout Updated",
        description: "Card positions have been saved.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <Select 
          value={selectedPeriod} 
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-primary/10">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-col space-y-6">
            {cards.map((card) => (
              <DraggableAnalyticsCard 
                key={card.id} 
                id={card.id}
                className="w-full bg-background/50 backdrop-blur-sm border-primary/10 transition-all duration-150 hover:shadow-lg"
              >
                {card.component}
              </DraggableAnalyticsCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};