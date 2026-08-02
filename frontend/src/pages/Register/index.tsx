import { motion } from 'framer-motion';
import { Mail, Lock, User, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-light)] flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-secondary-500)] to-[var(--color-primary-600)] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-10 h-10" />
            <span className="text-2xl font-bold font-[var(--font-display)]">OneStop AI</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-white/80 text-lg">
            Join thousands of students who are discovering their ideal career path with AI-powered guidance.
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

          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Create Account</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Fill in your details to get started</p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Nikhil Ghotankar"
                  className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition-all"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[var(--color-primary-600)] text-white font-semibold rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary-600)] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
