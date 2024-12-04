import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

export const useChatStorage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from storage
  useEffect(() => {
    const loadMessages = async () => {
      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        try {
          const result = await chrome.storage.local.get(['chatMessages']);
          if (result.chatMessages) {
            setMessages(result.chatMessages);
          }
        } catch (error) {
          console.error('Error loading chat messages:', error);
        }
      }
    };
    loadMessages();
  }, []);

  // Save messages to storage
  useEffect(() => {
    const saveMessages = async () => {
      if (messages.length > 0 && typeof chrome !== 'undefined' && chrome?.storage?.local) {
        try {
          await chrome.storage.local.set({ chatMessages: messages });
        } catch (error) {
          console.error('Error saving chat messages:', error);
        }
      }
    };
    saveMessages();
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = async () => {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      try {
        await chrome.storage.local.remove('chatMessages');
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat messages:', error);
      }
    }
  };

  return {
    messages,
    addMessage,
    clearMessages
  };
};