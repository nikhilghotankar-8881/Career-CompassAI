import { motion } from 'framer-motion';
import { MessageSquare, Bot } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-7 h-7 text-[var(--color-primary-600)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Career Advisor</h1>
          </div>
          <p className="text-[var(--color-text-secondary)]">Chat with an AI assistant for career and education guidance.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)]"
        >
          <Bot className="w-16 h-16 text-[var(--color-text-muted)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">AI Chatbot Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] text-center max-w-md">
            Ask career questions, get course suggestions, receive interview preparation tips, and explore educational opportunities.
          </p>
          <span className="mt-4 px-4 py-1.5 text-sm font-medium text-[var(--color-primary-600)] bg-[var(--color-primary-50)] rounded-full">
            Phase 10
          </span>
        </motion.div>
      </div>
    </div>
  );
}
