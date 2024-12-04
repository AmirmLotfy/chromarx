import { Bookmark } from "./bookmark";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  relatedBookmarks?: Bookmark[];
  webResults?: Array<{ title: string; url: string }>;
}

export interface ChatMessage extends Message {}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ChatContextType = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createSession: () => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateSessionTitle: (id: string, title: string) => void;
};