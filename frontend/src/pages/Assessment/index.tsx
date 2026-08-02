import { motion } from 'framer-motion';
import { Brain, ClipboardList } from 'lucide-react';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-7 h-7 text-[var(--color-secondary-500)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Career Assessment</h1>
          </div>
          <p className="text-[var(--color-text-secondary)]">Discover careers that match your personality, skills, and interests.</p>
        </motion.div>

        {/* Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)]"
        >
          <ClipboardList className="w-16 h-16 text-[var(--color-text-muted)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Assessment Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] text-center max-w-md">
            Take a comprehensive assessment covering personality, aptitude, interests, and skills to get AI-powered career recommendations.
          </p>
          <span className="mt-4 px-4 py-1.5 text-sm font-medium text-[var(--color-secondary-600)] bg-[var(--color-secondary-50)] rounded-full">
            Phase 5
          </span>
        </motion.div>
      </div>
    </div>
  );
}
