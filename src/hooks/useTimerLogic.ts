import { useEffect } from "react";
import { useTimerStore } from "@/stores/timerStore";
import { toast } from "sonner";

export const useTimerLogic = () => {
  const {
    timeLeft,
    isRunning,
    workDuration,
    notificationsEnabled,
    isBreak,
    activeTask,
    setTimeLeft,
    setIsRunning,
    setIsBreak,
    setActiveTask,
  } = useTimerStore();

  useEffect(() => {
    const activeTimer = localStorage.getItem('activeTimer');
    if (activeTimer) {
      const timer = JSON.parse(activeTimer);
      setTimeLeft(timer.duration);
      setActiveTask({ id: timer.taskId, title: timer.taskTitle });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        
        if (timeLeft <= 1) {
          handleTimerComplete();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (activeTask) {
      const existingLog = JSON.parse(localStorage.getItem(`timerLog-${activeTask.id}`) || '[]');
      const newLog = {
        startTime: new Date().toISOString(),
        duration: workDuration * 60,
        completed: true
      };
      localStorage.setItem(`timerLog-${activeTask.id}`, JSON.stringify([...existingLog, newLog]));
    }
    
    if (notificationsEnabled) {
      new Audio("/notification.mp3").play().catch(() => {
        console.log("Audio playback failed");
      });
      
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(
              isBreak ? 'Break time is over!' : 'Work session completed!',
              {
                body: isBreak
                  ? "Time to get back to work!"
                  : `Completed work session${activeTask ? ` on: ${activeTask.title}` : ''}!`,
                icon: '/icons/icon128.png'
              }
            );
          }
        });
      }
      
      toast.success(
        isBreak ? "Break time is over!" : `Completed work session${activeTask ? ` on: ${activeTask.title}` : ''}!`,
        {
          description: isBreak
            ? "Time to get back to work!"
            : "Take a well-deserved break.",
        }
      );
    }
    
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? workDuration * 60 : 5 * 60);
  };

  return {
    timeLeft,
    isRunning,
    isBreak,
    activeTask,
    handleTimerComplete
  };
};