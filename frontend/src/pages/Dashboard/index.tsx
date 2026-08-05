import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Map, FileText, MessageSquare, Award, BookOpen, User as UserIcon, Loader2, Sparkles, ArrowRight, CheckCircle, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardSummary } from '@/types/dashboard';
import Navbar from '@/components/layout/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();
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

  const quickActions = [
    { title: 'Take Career Quiz', description: 'Assess personality & technical strengths', icon: Brain, href: '/assessment', badge: 'Step 1' },
    { title: 'View Roadmap', description: 'Step-by-step personalized learning path', icon: Map, href: '/roadmap', badge: 'Step 2' },
    { title: 'AI Resume Score', description: 'Analyze ATS score & keyword gaps', icon: FileText, href: '/resume', badge: 'Tool' },
    { title: 'AI Career Chat', description: '24/7 intelligent career advisor', icon: MessageSquare, href: '/chat', badge: 'AI' },
    { title: 'Courses & Certs', description: 'Curated platforms for your target role', icon: BookOpen, href: '/courses', badge: 'Learn' },
    { title: 'Gamified Badges', description: 'Track level stats & unlock achievements', icon: Award, href: '/progress', badge: 'Stats' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-pattern">
      <Navbar />

      <main className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                Welcome back, {user?.full_name || 'Student'}! 👋
              </h1>
              <p className="text-blue-100/80 text-sm max-w-xl">
                {summary?.target_role 
                  ? `Your active target role is ${summary.target_role}. Keep progressing on your roadmap!` 
                  : 'Complete your career assessment to unlock personalized recommendations and roadmaps.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> Edit Profile
              </Link>
              <Link
                to="/assessment"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Brain className="w-4 h-4" /> Take Quiz
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              
              {/* Card 1: Assessment */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    summary?.assessment_completed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {summary?.assessment_completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Career Assessment</p>
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {summary?.top_trait || 'Not taken yet'}
                </h3>
              </motion.div>

              {/* Card 2: Roadmap Progress */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Map className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    {summary?.roadmap_progress || 0}% Progress
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Roadmap</p>
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {summary?.target_role || 'No active roadmap'}
                </h3>
              </motion.div>

              {/* Card 3: Resume Score */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ATS Score
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Resume Score</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {summary?.resume_score ? `${summary.resume_score} / 100` : 'Not uploaded'}
                </h3>
              </motion.div>

              {/* Card 4: Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Milestones
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Steps Mastered</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {summary?.milestones_completed || 0} Completed
                </h3>
              </motion.div>

            </div>

            {/* Quick Feature Shortcuts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                  <p className="text-xs text-slate-500">Access key modules of your career portal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.href}
                      className="glass-card p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 group flex items-start justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                              {action.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
