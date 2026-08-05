import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, BookOpen, Map, Shield, Sparkles, User, LogOut, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/common/NotificationBell';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assessment', label: 'Assessment', icon: Sparkles },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/resume', label: 'Resume AI', icon: FileText },
    { path: '/chat', label: 'AI Advisor', icon: MessageSquare },
    { path: '/progress', label: 'Progress', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
              OS
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                OneStop AI
              </span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase -mt-1">
                Career Compass
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}

            {user?.is_admin && (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-red-600 hover:bg-red-50/80'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* User Controls & Notifications */}
          <div className="flex items-center gap-3">
            <NotificationBell />

            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                  title="Edit Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden shadow-xs">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      user.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium text-slate-700 max-w-[100px] truncate">
                    {user.full_name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
