import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, Map, FileText, MessageSquare, TrendingUp, Award, BookOpen, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardSummary } from '@/types/dashboard';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getStats = () => {
    if (!summary) return [];
    
    return [
      { 
        label: 'Assessment Status', 
        value: summary.assessment_completed ? (summary.top_trait || 'Completed') : 'Pending', 
        icon: Brain, 
        color: 'var(--color-secondary-500)' 
      },
      { 
        label: 'Roadmap Progress', 
        value: summary.roadmap_active ? `${summary.roadmap_progress}%` : 'Not Started', 
        icon: Map, 
        color: 'var(--color-primary-600)' 
      },
      { 
        label: 'Resume Score', 
        value: summary.resume_score ? `${summary.resume_score}/100` : '—',
        icon: FileText, 
        color: 'var(--color-accent-500)' 
      },
      { 
        label: 'Milestones Completed', 
        value: summary.milestones_completed.toString(), 
        icon: Award, 
        color: 'var(--color-warning-500)' 
      },
    ];
  };

  const quickActions = [
    { title: 'My Profile', description: 'Update skills, goals & education', icon: UserIcon, href: '/profile' },
    { title: 'Take Assessment', description: 'Discover your ideal career path', icon: Brain, href: '/assessment' },
    { title: 'View Roadmap', description: 'Follow your learning journey', icon: Map, href: '/roadmap' },
    { title: 'Analyze Resume', description: 'Get AI feedback on your resume', icon: FileText, href: '/resume' },
    { title: 'Chat with AI', description: 'Ask career-related questions', icon: MessageSquare, href: '/chat' },
    { title: 'Explore Courses', description: 'Find recommended courses', icon: BookOpen, href: '/courses' },
    { title: 'Track Progress', description: 'View your analytics & achievements', icon: TrendingUp, href: '/progress' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-light)]">
      <div className="max-w-[var(--max-width)] mx-auto px-8 py-8">
        {/* Header with User Profile and Logout */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-[var(--color-border-light)] gap-4"
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
              <span className="text-sm font-medium text-[var(--color-text-primary)] hidden sm:inline">{user?.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-error-200)] text-[var(--color-error-600)] hover:bg-[var(--color-error-50)] rounded-[var(--radius-button)] transition-colors text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary-600)]" />
          </div>
        ) : (
          <>
            {/* Current Focus Widget */}
            {summary?.roadmap_active && summary?.target_role && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-gradient-to-r from-[var(--color-primary-800)] to-[var(--color-primary-600)] rounded-[var(--radius-card)] p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-primary-100)] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Current Focus
                  </h2>
                  <p className="text-2xl font-bold mb-1">Training to become a {summary.target_role}</p>
                  <p className="text-[var(--color-primary-50)] text-sm">
                    Keep going! You've completed {summary.milestones_completed} milestones so far.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => navigate('/roadmap')}
                    className="bg-white text-[var(--color-primary-700)] font-bold px-6 py-3 rounded-lg hover:bg-[var(--color-primary-50)] transition-colors shadow-md"
                  >
                    Resume Learning
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {getStats().map((stat, i) => (
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
                  <span className="text-2xl font-bold text-[var(--color-text-primary)] capitalize">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              onClick={() => navigate(action.href)}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
