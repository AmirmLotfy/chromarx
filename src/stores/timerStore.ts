import { create } from 'zustand';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  workDuration: number;
  isBreak: boolean;
  activeTask: { id: string; title: string; suggestedDuration?: number } | null;
  notificationsEnabled: boolean;
  setTimeLeft: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setWorkDuration: (duration: number) => void;
  setIsBreak: (isBreak: boolean) => void;
  setActiveTask: (task: { id: string; title: string; suggestedDuration?: number } | null) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: 25 * 60,
  isRunning: false,
  workDuration: 25,
  isBreak: false,
  activeTask: null,
  notificationsEnabled: true,
  setTimeLeft: (time) => set({ timeLeft: time }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setWorkDuration: (duration) => set({ workDuration: duration }),
  setIsBreak: (isBreak) => set({ isBreak }),
  setActiveTask: (task) => set({ activeTask: task }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  reset: () => set((state) => ({ 
    isRunning: false,
    timeLeft: state.workDuration * 60,
    isBreak: false 
  })),
}));