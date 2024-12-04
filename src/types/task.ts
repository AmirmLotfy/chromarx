export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes: string[];
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  category: string;
  timerId?: string;
  suggestedDuration?: number;
}