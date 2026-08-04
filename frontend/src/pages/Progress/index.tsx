import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Brain,
  Map,
  FileText,
  BookOpen,
  MessageCircle,
  Award,
  Trophy,
  Flame,
  Zap,
  ClipboardCheck,
  Lock,
  Loader2,
  BarChart3,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { progressService } from '@/services/progressService';
import type { ProgressOverview, Achievement } from '@/types/progress';
import Navbar from '@/components/layout/Navbar';

// ========================
// Badge Icon Map
// ========================

const BADGE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardCheck,
  Map,
  Flame,
  Zap,
  FileText,
  MessageCircle,
  BookOpen,
  Trophy,
  Brain,
};

// All possible badges (for locked display)
const ALL_BADGE_KEYS = [
  { key: 'first_assessment', name: 'First Steps', description: 'Complete your first career assessment', icon: 'ClipboardCheck' },
  { key: 'roadmap_started', name: 'Pathfinder', description: 'Create your first learning roadmap', icon: 'Map' },
  { key: 'milestone_5', name: 'Momentum Builder', description: 'Complete 5 learning milestones', icon: 'Flame' },
  { key: 'milestone_15', name: 'Unstoppable', description: 'Complete 15 learning milestones', icon: 'Zap' },
  { key: 'resume_reviewed', name: 'Resume Pro', description: 'Get your first AI resume review', icon: 'FileText' },
  { key: 'chat_explorer', name: 'Curious Mind', description: 'Send 10+ messages to the AI advisor', icon: 'MessageCircle' },
  { key: 'course_learner', name: 'Knowledge Seeker', description: 'Receive 5+ course recommendations', icon: 'BookOpen' },
  { key: 'roadmap_master', name: 'Roadmap Master', description: 'Complete a roadmap to 100%', icon: 'Trophy' },
  { key: 'skill_analyst', name: 'Self-Aware', description: 'Take 3+ career assessments', icon: 'Brain' },
];

// ========================
// Progress Page
// ========================

export default function ProgressPage() {
  const [data, setData] = useState<ProgressOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const overview = await progressService.getOverview();
      setData(overview);
    } catch {
      toast.error('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  const earnedKeys = new Set(data?.achievements.map((a) => a.badge_key) || []);

  const statCards = data
    ? [
        {
          label: 'Assessments Taken',
          value: data.learning_stats.assessments_taken,
          icon: Brain,
          color: 'var(--color-secondary-500)',
          bg: 'var(--color-secondary-50)',
        },
        {
          label: 'Milestones Done',
          value: `${data.learning_stats.milestones_completed}/${data.learning_stats.milestones_total}`,
          icon: CheckCircle2,
          color: 'var(--color-accent-500)',
          bg: 'var(--color-accent-50)',
        },
        {
          label: 'Courses Recommended',
          value: data.learning_stats.courses_recommended,
          icon: BookOpen,
          color: 'var(--color-primary-600)',
          bg: 'var(--color-primary-50)',
        },
        {
          label: 'Resume Reviews',
          value: data.learning_stats.resume_reviews,
          icon: FileText,
          color: 'var(--color-warning-600)',
          bg: 'var(--color-warning-50)',
        },
      ]
    : [];

  // Radar chart data
  const radarData = data?.skill_progress.map((s) => ({
    domain: s.domain,
    score: s.score,
    fullMark: s.max_score,
  })) || [];

  // Line chart data — assessment history score evolution
  const lineData = data?.assessment_history.map((item, idx) => {
    const avgScore = Object.values(item.category_scores).length > 0
      ? Math.round(
          Object.values(item.category_scores).reduce((a, b) => a + b, 0) /
            Object.values(item.category_scores).length
        )
      : 0;
    return {
      name: `#${idx + 1}`,
      avgScore,
      date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }) || [];

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[var(--max-width)] w-full mx-auto px-6 py-12">
        {/* ========== Header ========== */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <TrendingUp className="w-8 h-8 text-[var(--color-primary-600)]" />
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Progress & Analytics
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[var(--color-text-secondary)] mb-10"
        >
          Track your career journey, skills growth, and achievements across the platform.
        </motion.p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary-600)]" />
          </div>
        ) : !data ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start by taking an assessment or creating a roadmap to begin tracking your progress.
            </p>
          </div>
        ) : (
          <>
            {/* ========== Stats Grid ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 bg-[var(--color-surface-light)] rounded-[var(--radius-card)] border border-[var(--color-border-light)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {stat.label}
                    </span>
                    <div
                      className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                    {stat.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* ========== Charts Row ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Skill Radar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[var(--color-secondary-500)]" />
                  Skill Radar
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Your latest assessment domain scores
                </p>
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="var(--color-border-light)" />
                      <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="var(--color-primary-600)"
                        fill="var(--color-primary-500)"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <Brain className="w-10 h-10 mb-2" />
                    <p className="text-sm">Complete an assessment to see your skill radar</p>
                  </div>
                )}
              </motion.div>

              {/* Assessment Score Evolution */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--color-accent-500)]" />
                  Assessment Evolution
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Average score trend across assessments
                </p>
                {lineData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border-light)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgScore"
                        name="Avg Score"
                        stroke="var(--color-accent-500)"
                        strokeWidth={2.5}
                        dot={{ fill: 'var(--color-accent-500)', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : lineData.length === 1 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <BarChart3 className="w-10 h-10 mb-2" />
                    <p className="text-sm">Take more assessments to see your evolution trend</p>
                    <p className="text-xs text-gray-300 mt-1">Current avg: {lineData[0]?.avgScore}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <BarChart3 className="w-10 h-10 mb-2" />
                    <p className="text-sm">No assessments yet</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ========== Roadmap History ========== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-[var(--color-primary-600)]" />
                Roadmap History
              </h2>
              {data.roadmap_history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.roadmap_history.map((rm, idx) => (
                    <motion.div
                      key={rm.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.08 }}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-[var(--color-text-primary)]">{rm.target_role}</h3>
                        {rm.is_active ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                            Past
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[var(--color-text-secondary)]">
                            {rm.milestones_completed}/{rm.milestones_total} milestones
                          </span>
                          <span className="font-bold text-[var(--color-primary-600)]">
                            {rm.progress_percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rm.progress_percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + idx * 0.08 }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                rm.progress_percentage >= 100
                                  ? 'linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600))'
                                  : 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))',
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Created {new Date(rm.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                  <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No roadmaps created yet. Start with a career recommendation!</p>
                </div>
              )}
            </motion.div>

            {/* ========== Achievement Badges ========== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--color-warning-500)]" />
                Achievements
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {earnedKeys.size}/{ALL_BADGE_KEYS.length} badges earned
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {ALL_BADGE_KEYS.map((badge, idx) => {
                  const isEarned = earnedKeys.has(badge.key);
                  const earned = data.achievements.find((a) => a.badge_key === badge.key);
                  const IconComponent = BADGE_ICON_MAP[badge.icon] || Award;

                  return (
                    <motion.div
                      key={badge.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 + idx * 0.05 }}
                      className={`relative rounded-2xl border p-5 text-center transition-all ${
                        isEarned
                          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      {!isEarned && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      )}
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${
                          isEarned
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md'
                            : 'bg-gray-200'
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-gray-400'}`}
                        />
                      </div>
                      <h4
                        className={`text-sm font-bold mb-1 ${
                          isEarned ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {badge.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-snug">{badge.description}</p>
                      {isEarned && earned && (
                        <p className="text-[10px] text-amber-600 font-medium mt-2">
                          Earned {new Date(earned.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
