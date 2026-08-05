import { motion } from 'framer-motion';
import { Compass, ArrowRight, BookOpen, Brain, FileText, MessageSquare, Award, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Career Assessment Engine',
      description: 'Discover career options aligned with your unique personality archetype, skills, and goals.',
      tag: 'AI Diagnostics',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Compass,
      title: 'Interactive Learning Roadmap',
      description: 'Step-by-step personalized learning paths with live milestone tracking and completion badges.',
      tag: 'Pathfinder',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: FileText,
      title: 'AI Resume Analyzer',
      description: 'Instant ATS resume scoring with actionable strength, weakness, and keyword feedback.',
      tag: 'ATS Optimization',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Advisor Chat',
      description: '24/7 intelligent career assistant to answer study strategies, interview prep, and industry questions.',
      tag: '24/7 Guidance',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: BookOpen,
      title: 'Course & Cert Recommendations',
      description: 'Curated courses from Coursera, Udemy, and edX mapped specifically to your skill gaps.',
      tag: 'Skill Building',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: Award,
      title: 'Gamified Achievements',
      description: 'Earn badges, level up your profile, and track your analytical, technical, and creative growth.',
      tag: 'Gamification',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  const highlights = [
    'AI-powered 5-domain psychometric evaluation',
    'Personalized step-by-step skill tree',
    'Real-time ATS resume scoring & keyword analysis',
    'Gamified progress tracking with unlockable badges',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-pattern relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-emerald-400/10 blur-3xl rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/60">
        <div className="max-w-[var(--max-width)] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md">
              OS
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              OneStop AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[var(--max-width)] mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200/80 rounded-full shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI-Powered Career & Education Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 leading-[1.1] mb-6">
            Architect Your Future with <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Personalized AI Guidance
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Discover tailored career roadmaps, get real-time resume feedback, bridge skill gaps with course suggestions, and receive 24/7 advice from your dedicated AI advisor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Free Discovery
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 border border-slate-200 text-slate-800 hover:bg-slate-100 rounded-xl font-bold text-base transition-all shadow-xs"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Key Highlight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 text-sm font-medium">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-[var(--max-width)] mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-2 block">
            End-to-End Career Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            From self-discovery to job-ready skill building, OneStop AI guides every step of your educational and professional journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group border border-slate-200/70 hover:border-blue-400/60"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-10 text-center relative z-10">
        <div className="max-w-[var(--max-width)] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black flex items-center justify-center text-[10px]">
              OS
            </div>
            <span className="font-bold text-slate-800">OneStop AI Career-Compass Platform</span>
          </div>
          <p>© 2026 OneStop AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
