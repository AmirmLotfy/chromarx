import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface DraggableAnalyticsCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const DraggableAnalyticsCard = ({ id, children, className }: DraggableAnalyticsCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none",
        isDragging && "opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
};