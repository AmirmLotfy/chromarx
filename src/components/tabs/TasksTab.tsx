import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskAnalytics } from "@/components/tasks/TaskAnalytics";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { toggleTaskCompletion } from "@/utils/taskUtils/taskOperations";

export const TasksTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView = activeView === "all" || 
                       (activeView === "completed" && task.completed) ||
                       (activeView === "pending" && !task.completed);
    return matchesPriority && matchesCategory && matchesSearch && matchesView;
  });

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    setEditingTask(null);
    toast.success("Task updated successfully");
  };

  const handleToggleComplete = (taskId: string, subtaskId?: string) => {
    const { updatedTasks, message } = toggleTaskCompletion(tasks, taskId, subtaskId);
    setTasks(updatedTasks);
    if (message) {
      toast.success(message);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  const handleAddNote = (taskId: string, note: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, notes: [...task.notes, note] }
          : task
      )
    );
    toast.success("Note added successfully");
  };

  const categories = Array.from(new Set(tasks.map(task => task.category || "Uncategorized")));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-6"
    >
      <div className="flex flex-col space-y-6">
        <div className="w-full">
          <CreateTaskForm 
            onCreateTask={(task) => {
              setTasks([...tasks, task]);
              // Dispatch event for timer tab
              window.dispatchEvent(new Event('tasksUpdated'));
            }}
            onUpdateTask={handleUpdateTask}
            editingTask={editingTask}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Management</span>
              <Tabs defaultValue="all" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" onClick={() => setActiveView("all")}>All Tasks</TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => setActiveView("pending")}>Pending</TabsTrigger>
                  <TabsTrigger value="completed" onClick={() => setActiveView("completed")}>Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterPriority={filterPriority}
                onPriorityChange={setFilterPriority}
                filterCategory={filterCategory}
                onCategoryChange={setFilterCategory}
                categories={categories}
                totalTasks={filteredTasks.length}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskList 
                    tasks={filteredTasks}
                    onToggleComplete={handleToggleComplete}
                    onAddNote={handleAddNote}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={(taskId) => {
                      const task = tasks.find(t => t.id === taskId);
                      if (task) setEditingTask(task);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <div className="w-full">
          <TaskAnalytics tasks={filteredTasks} />
        </div>
      </div>
    </motion.div>
  );
};
