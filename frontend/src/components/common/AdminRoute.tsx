import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user?.is_admin && !hasWarned.current) {
      toast.error('Admin access required');
      hasWarned.current = true;
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
