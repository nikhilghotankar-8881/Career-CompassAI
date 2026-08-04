import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trophy, Info, Map, BookOpen, Brain, Check, Trash2 } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types/notification';
import { useLocation } from 'react-router-dom';

// Map notification types to icons and colors
const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  achievement: { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-100' },
  system: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
  roadmap: { icon: Map, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  course: { icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
  assessment: { icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  default: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Re-fetch on navigation changes (simulating updates)

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)] cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <Bell className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={n.id}
                      className={`relative p-4 border-b border-gray-50 transition-colors ${
                        !n.is_read ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${config.bg}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-grow pr-6">
                          <h4 className={`text-sm font-semibold mb-0.5 ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {n.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-1 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mark read button (appears on hover) */}
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                          style={{ opacity: 1 }} // Show constantly for mobile/touch compatibility
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {/* Unread dot indicator */}
                      {!n.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
