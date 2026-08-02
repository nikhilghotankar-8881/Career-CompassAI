import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// ========================
// Lazy-loaded pages (code splitting)
// ========================

const HomePage = lazy(() => import('@/pages/Home'));
const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const AssessmentPage = lazy(() => import('@/pages/Assessment'));
const RoadmapPage = lazy(() => import('@/pages/Roadmap'));
const ResumePage = lazy(() => import('@/pages/Resume'));
const ChatPage = lazy(() => import('@/pages/Chat'));

// ========================
// Router Configuration
// ========================

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected routes (Requires Authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/assessment',
        element: <AssessmentPage />,
      },
      {
        path: '/roadmap',
        element: <RoadmapPage />,
      },
      {
        path: '/resume',
        element: <ResumePage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
    ],
  },
]);
