import { motion } from 'framer-motion';
import { FileText, Upload } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-[var(--color-accent-500)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Resume Analyzer</h1>
          </div>
          <p className="text-[var(--color-text-secondary)]">Upload your resume and get AI-powered improvement suggestions.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-24 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-border-light)]"
        >
          <Upload className="w-16 h-16 text-[var(--color-text-muted)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Resume Analysis Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] text-center max-w-md">
            Upload your resume in PDF or DOCX format and receive a detailed score, strengths, and improvement suggestions.
          </p>
          <span className="mt-4 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-600)] bg-[var(--color-accent-50)] rounded-full">
            Phase 9
          </span>
        </motion.div>
      </div>
    </div>
  );
}
