import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Brain,
  BookOpen,
  BarChart3,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  X,
  UserCheck,
  UserX,
  Activity,
  Map,
  FileText,
  MessageCircle,
  Award,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import type {
  PlatformAnalytics,
  AdminUser,
  AdminUserListResponse,
  AdminAssessmentItem,
  AdminAssessmentListResponse,
  AdminCourseItem,
  AdminCourseCreate,
} from '@/types/admin';
import Navbar from '@/components/layout/Navbar';

// ========================
// Tab Types
// ========================

type AdminTab = 'analytics' | 'users' | 'assessments' | 'courses';

const TABS: { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'assessments', label: 'Assessments', icon: Brain },
  { key: 'courses', label: 'Courses', icon: BookOpen },
];

// ========================
// Admin Page
// ========================

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[var(--max-width)] w-full mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Shield className="w-8 h-8 text-[var(--color-error-500)]" />
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[var(--color-text-secondary)] mb-8"
        >
          Manage users, monitor platform activity, and oversee learning content.
        </motion.p>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[var(--color-primary-600)] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && <AnalyticsTab key="analytics" />}
          {activeTab === 'users' && <UsersTab key="users" />}
          {activeTab === 'assessments' && <AssessmentsTab key="assessments" />}
          {activeTab === 'courses' && <CoursesTab key="courses" />}
        </AnimatePresence>
      </main>
    </div>
  );
}


// ========================
// Analytics Tab
// ========================

function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!analytics) return null;

  const metrics = [
    { label: 'Total Users', value: analytics.total_users, icon: Users, color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Active Users', value: analytics.active_users, icon: UserCheck, color: 'var(--color-accent-600)', bg: 'var(--color-accent-50)' },
    { label: 'Assessments', value: analytics.total_assessments, icon: Brain, color: 'var(--color-secondary-600)', bg: 'var(--color-secondary-50)' },
    { label: 'Roadmaps', value: analytics.total_roadmaps, icon: Map, color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Milestones Done', value: analytics.total_milestones_completed, icon: Activity, color: 'var(--color-accent-600)', bg: 'var(--color-accent-50)' },
    { label: 'Resume Reviews', value: analytics.total_resume_reviews, icon: FileText, color: 'var(--color-warning-600)', bg: 'var(--color-warning-50)' },
    { label: 'Chat Messages', value: analytics.total_chat_messages, icon: MessageCircle, color: 'var(--color-secondary-600)', bg: 'var(--color-secondary-50)' },
    { label: 'Courses', value: analytics.total_courses, icon: BookOpen, color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Badges Earned', value: analytics.total_achievements_earned, icon: Award, color: 'var(--color-warning-600)', bg: 'var(--color-warning-50)' },
    { label: 'New (7 days)', value: analytics.new_users_last_7_days, icon: TrendingUp, color: 'var(--color-accent-600)', bg: 'var(--color-accent-50)' },
    { label: 'New (30 days)', value: analytics.new_users_last_30_days, icon: TrendingUp, color: 'var(--color-secondary-600)', bg: 'var(--color-secondary-50)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{m.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.bg }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{m.value.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


// ========================
// Users Tab
// ========================

function UsersTab() {
  const [data, setData] = useState<AdminUserListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = async (p = page, s = search) => {
    try {
      setIsLoading(true);
      const result = await adminService.getUsers(s || undefined, p);
      setData(result);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, search);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, search);
  };

  const handleToggle = async (userId: string, field: 'is_active' | 'is_admin', currentValue: boolean) => {
    try {
      await adminService.updateUser(userId, { [field]: !currentValue });
      toast.success(`User ${field === 'is_active' ? (currentValue ? 'deactivated' : 'activated') : (currentValue ? 'demoted' : 'promoted to admin')}`);
      fetchUsers(page, search);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers(page, search);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)]"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-700)] transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !data || data.users.length === 0 ? (
        <EmptyState icon={Users} message="No users found" />
      ) : (
        <>
          {/* User Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Assessments</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Roadmaps</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{u.full_name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          u.is_active
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {u.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          u.is_admin
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.is_admin ? <Shield className="w-3 h-3" /> : null}
                          {u.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">{u.assessment_count}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{u.roadmap_count}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggle(u.id, 'is_active', u.is_active)}
                            title={u.is_active ? 'Deactivate' : 'Activate'}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {u.is_active ? (
                              <ToggleRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggle(u.id, 'is_admin', u.is_admin)}
                            title={u.is_admin ? 'Remove Admin' : 'Make Admin'}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Shield className={`w-4 h-4 ${u.is_admin ? 'text-purple-600' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            title="Delete user"
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * data.per_page) + 1}–{Math.min(page * data.per_page, data.total)} of {data.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const p = page - 1; setPage(p); fetchUsers(p, search); }}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700">Page {page}/{totalPages}</span>
                <button
                  onClick={() => { const p = page + 1; setPage(p); fetchUsers(p, search); }}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-500">This action is permanent.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this user? All their data (assessments, roadmaps, progress, etc.) will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// ========================
// Assessments Tab
// ========================

function AssessmentsTab() {
  const [data, setData] = useState<AdminAssessmentListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchAssessments = async (p = page) => {
    try {
      setIsLoading(true);
      const result = await adminService.getAssessments(p);
      setData(result);
    } catch {
      toast.error('Failed to load assessments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(1);
  }, []);

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {isLoading ? (
        <LoadingSpinner />
      ) : !data || data.assessments.length === 0 ? (
        <EmptyState icon={Brain} message="No assessments found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Personality Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Domain Scores</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Top Traits</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assessments.map((a) => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.user_name}</p>
                        <p className="text-xs text-gray-500">{a.user_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {a.personality_type || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(a.category_scores).map(([domain, score]) => (
                            <span key={domain} className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                              {domain}: {score}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {a.top_traits.slice(0, 3).map((t) => (
                            <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * data.per_page) + 1}–{Math.min(page * data.per_page, data.total)} of {data.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const p = page - 1; setPage(p); fetchAssessments(p); }}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700">Page {page}/{totalPages}</span>
                <button
                  onClick={() => { const p = page + 1; setPage(p); fetchAssessments(p); }}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}


// ========================
// Courses Tab
// ========================

function CoursesTab() {
  const [courses, setCourses] = useState<AdminCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AdminCourseCreate>({
    title: '',
    platform: 'Coursera',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    url: '',
    type: 'Course',
  });

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCourses();
      setCourses(data);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }
    try {
      await adminService.createCourse(formData);
      toast.success('Course created');
      setShowForm(false);
      setFormData({ title: '', platform: 'Coursera', difficulty: 'Intermediate', duration: '4 weeks', url: '', type: 'Course' });
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create course');
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      await adminService.deleteCourse(courseId);
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Add Course Button / Form */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-700)] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">New Platform Course</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <input
                placeholder="Course title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)]"
              />
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)] bg-white"
              >
                <option>Coursera</option>
                <option>Udemy</option>
                <option>edX</option>
                <option>Google</option>
                <option>AWS</option>
                <option>LinkedIn Learning</option>
                <option>Other</option>
              </select>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)] bg-white"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input
                placeholder="Duration (e.g. 4 weeks)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)]"
              />
              <input
                placeholder="URL (optional)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)]"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary-500)] bg-white"
              >
                <option>Course</option>
                <option>Certification</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 bg-[var(--color-primary-600)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-700)] transition-colors cursor-pointer"
            >
              Create Course
            </button>
          </motion.div>
        )}
      </div>

      {/* Course List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} message="No courses found" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Platform</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Difficulty</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Duration</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{c.title}</td>
                    <td className="px-4 py-3 text-gray-700">{c.platform}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        c.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                        c.difficulty === 'Advanced' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.type}</td>
                    <td className="px-4 py-3 text-gray-500">{c.duration}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}


// ========================
// Shared Components
// ========================

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary-600)]" />
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<{ className?: string }>; message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
      <Icon className="w-14 h-14 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}
