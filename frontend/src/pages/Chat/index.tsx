import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, User, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { chatService } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';
import Navbar from '@/components/layout/Navbar';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getHistory();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Optimistic UI update for user message
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const aiResponse = await chatService.sendMessage({ content: userMessage });
      // We don't necessarily need to replace the temp user msg since the ID won't matter for rendering,
      // but we do need to append the AI response.
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error('Failed to get a response from AI');
      // Remove the optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen bg-[var(--color-background-light)] text-[var(--color-text-main)] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
            <Bot className="w-6 h-6 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">AI Career Advisor</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">I know your skills, goals, and roadmap. Ask me anything!</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto pr-2 pb-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary-600)]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-400" />
              <h2 className="text-lg font-bold mb-2">Start a conversation</h2>
              <p className="max-w-md mx-auto text-sm">
                Try asking about how to improve your skills, what to expect in an interview for your target role, or how to negotiate salary.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                  msg.role === 'user' ? 'bg-gray-200' : 'bg-[var(--color-primary-100)]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Bot className="w-6 h-6 text-[var(--color-primary-600)]" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`px-5 py-3.5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-primary-600)] text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                }`}>
                  {/* Basic markdown parsing could go here, but for now we just render text */}
                  <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {isSending && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center mt-1">
                <Bot className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white border border-gray-200 rounded-tl-sm shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 pt-4 pb-2">
          <form 
            onSubmit={handleSend}
            className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm focus-within:border-[var(--color-primary-500)] focus-within:ring-2 focus-within:ring-[var(--color-primary-200)] transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for career advice..."
              className="flex-grow bg-transparent px-6 py-4 outline-none text-gray-800 rounded-full"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="absolute right-2 shrink-0 p-3 bg-[var(--color-primary-600)] text-white rounded-full hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:hover:bg-[var(--color-primary-600)] transition-colors"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-400">AI can make mistakes. Verify important career information.</span>
          </div>
        </div>

      </main>
    </div>
  );
}
