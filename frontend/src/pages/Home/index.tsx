import { motion } from 'framer-motion';
import { Compass, ArrowRight, BookOpen, Brain, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Career Assessment',
      description: 'Discover careers that match your personality, skills, and interests.',
    },
    {
      icon: Compass,
      title: 'Learning Roadmap',
      description: 'Get a personalized step-by-step plan to reach your career goals.',
    },
    {
      icon: FileText,
      title: 'Resume Analyzer',
      description: 'Get AI-powered feedback to improve your resume instantly.',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Advisor',
      description: 'Chat with an AI assistant for education and career guidance.',
    },
    {
      icon: BookOpen,
      title: 'Course Recommendations',
      description: 'Find the best courses and certifications for your career path.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-[var(--max-width)] mx-auto">
        <div className="flex items-center gap-2">
          <Compass className="w-8 h-8 text-[var(--color-primary-600)]" />
          <span className="text-xl font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
            OneStop AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-[var(--color-primary-600)] text-white rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[var(--max-width)] mx-auto px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-[var(--color-secondary-600)] bg-[var(--color-secondary-50)] rounded-full">
            🚀 AI-Powered Career Guidance
          </span>
          <h1 className="text-5xl md:text-6xl font-bold font-[var(--font-display)] text-[var(--color-text-primary)] leading-tight mb-6">
            Your Personalized
            <br />
            <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-500)] bg-clip-text text-transparent">
              Career & Education
            </span>
            <br />
            Advisor
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
            Discover the right career path, build skills, analyze your resume, and get personalized
            guidance — all powered by AI, all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary-600)] text-white rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-all font-semibold shadow-[var(--shadow-hover)] hover:shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[var(--color-border-light)] text-[var(--color-text-primary)] rounded-[var(--radius-button)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)] transition-all font-semibold"
            >
              I have an account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-[var(--max-width)] mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold font-[var(--font-display)] text-[var(--color-text-primary)] mb-4">
            Everything You Need for Your Career
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            One platform to discover, learn, build, and grow your career.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-[var(--spacing-lg)] bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] mb-4">
                <feature.icon className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-light)] py-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          © 2026 OneStop AI. Built by Nikhil Ghotankar.
        </p>
      </footer>
    </div>
  );
}
