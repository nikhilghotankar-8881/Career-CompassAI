import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, Map, FileText, MessageSquare, TrendingUp, Award, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Assessment Score', value: '—', icon: Brain, color: 'var(--color-secondary-500)' },
    { label: 'Roadmap Progress', value: '—', icon: Map, color: 'var(--color-primary-600)' },
    { label: 'Resume Score', value: '—', icon: FileText, color: 'var(--color-accent-500)' },
    { label: 'Skills Learned', value: '—', icon: TrendingUp, color: 'var(--color-warning-500)' },
  ];

  const quickActions = [
    { title: 'Take Assessment', description: 'Discover your ideal career path', icon: Brain, href: '/assessment' },
    { title: 'View Roadmap', description: 'Follow your learning journey', icon: Map, href: '/roadmap' },
    { title: 'Analyze Resume', description: 'Get AI feedback on your resume', icon: FileText, href: '/resume' },
    { title: 'Chat with AI', description: 'Ask career-related questions', icon: MessageSquare, href: '/chat' },
    { title: 'Explore Courses', description: 'Find recommended courses', icon: BookOpen, href: '/dashboard' },
    { title: 'Achievements', description: 'View your badges and progress', icon: Award, href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      {/* Sidebar placeholder — will be extracted into layout component */}
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-7 h-7 text-[var(--color-primary-600)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
          </div>
          <p className="text-[var(--color-text-secondary)]">Welcome back! Here's your career overview.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)] shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[var(--color-text-secondary)]">{stat.label}</span>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, i) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="p-5 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-50)] group-hover:bg-[var(--color-primary-100)] transition-colors mb-3">
                <action.icon className="w-5 h-5 text-[var(--color-primary-600)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{action.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{action.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
