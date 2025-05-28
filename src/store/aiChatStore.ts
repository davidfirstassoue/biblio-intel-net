import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAiResponse, type Message } from '../lib/ai';

type AiChatState = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: string) => void;
  generateResponse: () => Promise<void>;
  clearMessages: () => void;
};

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      
      addMessage: (content: string) => {
        const message: Message = {
          role: 'user',
          content,
        };
        
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },
      
      generateResponse: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const messages = get().messages;
          const response = await generateAiResponse(messages);
          
          if (response.message) {
            set((state) => ({
              messages: [...state.messages, response.message],
              isLoading: false,
            }));
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to generate response', 
            isLoading: false 
          });
          
          // Add error message to chat
          set((state) => ({
            messages: [
              ...state.messages, 
              {
                role: 'assistant',
                content: "Je suis désolé, je ne peux pas vous aider pour le moment. Veuillez réessayer plus tard.",
              }
            ],
          }));
        }
      },
      
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'bibliotheque-ai-chat',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);