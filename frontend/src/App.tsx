import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { router } from '@/routes';

// ========================
// React Query Client
// ========================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// ========================
// Loading Fallback
// ========================

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    </div>
  );
}

// ========================
// App Root
// ========================

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
