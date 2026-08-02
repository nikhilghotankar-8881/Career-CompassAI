import { motion } from 'framer-motion';
import { Mail, Lock, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-light)] flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-secondary-500)] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-10 h-10" />
            <span className="text-2xl font-bold font-[var(--font-display)]">OneStop AI</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg">
            Continue your career journey. Your personalized roadmap, assessments, and AI advisor are waiting.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Compass className="w-8 h-8 text-[var(--color-primary-600)]" />
            <span className="text-xl font-bold font-[var(--font-display)]">OneStop AI</span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Sign In</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Enter your credentials to access your account</p>

          {/* Form — Phase 3 will add real logic */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--color-primary-600)]" />
                <span className="text-[var(--color-text-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-[var(--color-primary-600)] hover:underline font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[var(--color-primary-600)] text-white font-semibold rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-primary-600)] hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
