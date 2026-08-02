import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, Map, FileText, MessageSquare, TrendingUp, Award, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const stats = [
    { label: 'Assessment Score', value: '—', icon: Brain, color: 'var(--color-secondary-500)' },
    { label: 'Roadmap Progress', value: '—', icon: Map, color: 'var(--color-primary-600)' },
    { label: 'Resume Score', value: '—', icon: FileText, color: 'var(--color-accent-500)' },
    { label: 'Skills Learned', value: '—', icon: TrendingUp, color: 'var(--color-warning-500)' },
  ];

  const quickActions = [
    { title: 'My Profile', description: 'Update skills, goals & education', icon: UserIcon, href: '/profile' },
    { title: 'Take Assessment', description: 'Discover your ideal career path', icon: Brain, href: '/assessment' },
    { title: 'View Roadmap', description: 'Follow your learning journey', icon: Map, href: '/roadmap' },
    { title: 'Analyze Resume', description: 'Get AI feedback on your resume', icon: FileText, href: '/resume' },
    { title: 'Chat with AI', description: 'Ask career-related questions', icon: MessageSquare, href: '/chat' },
    { title: 'Explore Courses', description: 'Find recommended courses', icon: BookOpen, href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        {/* Header with User Profile and Logout */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--color-border-light)]"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[var(--color-primary-600)]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
              <p className="text-[var(--color-text-secondary)]">Welcome back, <span className="font-semibold text-[var(--color-primary-600)]">{user?.full_name || 'Student'}</span>!</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3.5 py-2 bg-[var(--color-surface-light)] border border-[var(--color-border-light)] hover:border-[var(--color-primary-500)] rounded-[var(--radius-button)] transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[var(--color-primary-600)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{user?.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-error-200)] text-[var(--color-error-600)] hover:bg-[var(--color-error-50)] rounded-[var(--radius-button)] transition-colors text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
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
