import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAiChatStore } from '../../store/aiChatStore';
import { useAuthStore } from '../../store/authStore';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, addMessage, generateResponse, clearMessages } = useAiChatStore();
  const { user } = useAuthStore();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    addMessage(input);
    setInput('');
    
    await generateResponse();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative flex h-[80vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:max-w-lg md:h-[600px] dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assistant BiblioIntel
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X size={20} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 9.3345 4.15875 6.93964 6 5.29168M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 11.0907 7.22149 10.2338 7.61857 9.48102" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Comment puis-je vous aider ?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Je peux vous suggérer des livres, répondre à vos questions ou vous aider à naviguer dans notre bibliothèque.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white dark:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>
          
          {messages.length > 0 && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={clearMessages}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Effacer la conversation
              </button>
            </div>
          )}
          
          {!user && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <a href="/auth/signin" className="text-primary-600 hover:underline dark:text-primary-400">
                Connectez-vous
              </a>{' '}
              pour sauvegarder vos conversations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}