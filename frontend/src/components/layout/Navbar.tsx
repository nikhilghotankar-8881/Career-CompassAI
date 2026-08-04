import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, BookOpen, Map, ArrowLeft, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-black tracking-tighter text-[var(--color-primary-600)] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[var(--color-primary-600)] text-white flex items-center justify-center text-sm">OS</span>
                OneStop AI
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/roadmap"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/roadmap')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Map className="w-4 h-4 mr-2" />
                Roadmap
              </Link>
              <Link
                to="/resume"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/resume')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Resume
              </Link>
              <Link
                to="/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/courses')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Link>
              <Link
                to="/progress"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/progress')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Link>
              <Link
                to="/chat"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/chat')
                    ? 'border-[var(--color-primary-500)] text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Advisor
              </Link>
              {user?.is_admin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin')
                      ? 'border-red-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <Link to="/dashboard" className="text-gray-500 flex items-center gap-1 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
