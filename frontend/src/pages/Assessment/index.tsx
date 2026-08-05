import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  BarChart3,
  Compass,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  getQuestions,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
} from '@/services/assessmentService';
import type { Question, AssessmentResult } from '@/types/assessment';

import Navbar from '@/components/layout/Navbar';

type ViewMode = 'intro' | 'quiz' | 'results';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Load initial state (check for existing result or questions)
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const existingResult = await getAssessmentResults();
        if (existingResult) {
          setResult(existingResult);
        }
      } catch (err: any) {
        // No result yet, normal flow
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await startAssessment();
      setAssessmentId(res.assessment_id);
      setQuestions(res.questions);
      setCurrentIndex(0);
      setUserAnswers({});
      setViewMode('quiz');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to start assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payloadAnswers = Object.entries(userAnswers).map(([question_id, selected_option_index]) => ({
        question_id,
        selected_option_index,
      }));

      const res = await submitAssessment({
        assessment_id: assessmentId,
        answers: payloadAnswers,
      });

      setResult(res);
      setViewMode('results');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to calculate assessment scores.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <p className="text-sm font-medium">Loading Assessment Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-pattern">
      <Navbar />
      <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[var(--color-primary-50)] rounded-xl border border-[var(--color-primary-100)]">
                <Brain className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Career Assessment</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Discover your cognitive strengths, personality traits, and ideal career matches.
                </p>
              </div>
            </div>

            {result && viewMode !== 'results' && (
              <button
                onClick={() => setViewMode('results')}
                className="px-4 py-2 text-sm font-medium text-[var(--color-primary-600)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] rounded-lg transition border border-[var(--color-primary-200)] flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Previous Results
              </button>
            )}
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 1: INTRO SCREEN                                           */}
        {/* ============================================================== */}
        {viewMode === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-8 bg-[var(--color-surface-light)] rounded-2xl border border-[var(--color-border-light)] shadow-sm relative overflow-hidden">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)] bg-[var(--color-primary-50)] rounded-full border border-[var(--color-primary-200)] mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Phase 5 Assessment Engine
                </span>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                  Uncover Your Strategic Skill & Personality Profile
                </h2>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  Our comprehensive evaluation tests 15 scenarios across analytical reasoning, creative design, technical execution, leadership, and collaboration to build your customized psychological and skill fingerprint.
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleStartQuiz}
                    className="px-6 py-3 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    Start Assessment <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-[var(--color-text-muted)]">⏱️ Takes ~3–5 minutes • 15 questions</span>
                </div>
              </div>
            </div>

            {/* 3 Pillars Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)]">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 font-bold">
                  01
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Personality & Work Style</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Evaluates how you solve problems, work in teams, and adapt to high-velocity environments.
                </p>
              </div>

              <div className="p-6 bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)]">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 font-bold">
                  02
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Technical Aptitude</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Measures software engineering, data analytics, product design, and architectural capabilities.
                </p>
              </div>

              <div className="p-6 bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)]">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 font-bold">
                  03
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Career Motivations</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Identifies long-term industry vision, preferred learning styles, and leadership aspirations.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* STATE 2: QUIZ WIZARD                                           */}
        {/* ============================================================== */}
        {viewMode === 'quiz' && questions.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Progress Bar & Header */}
            <div className="bg-[var(--color-surface-light)] p-5 rounded-2xl border border-[var(--color-border-light)] shadow-sm">
              <div className="flex items-center justify-between text-sm font-medium mb-3">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-2">
                  <span className="capitalize px-2.5 py-0.5 rounded-md bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-semibold text-xs border border-[var(--color-primary-200)]">
                    {currentQuestion.category}
                  </span>
                  {currentQuestion.sub_domain && `• ${currentQuestion.sub_domain}`}
                </span>
                <span className="text-[var(--color-text-primary)] font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-[var(--color-primary-600)] h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-[var(--color-surface-light)] p-8 rounded-2xl border border-[var(--color-border-light)] shadow-sm space-y-6"
              >
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] leading-snug">
                  {currentQuestion.question_text}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = userAnswers[currentQuestion.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] shadow-sm text-[var(--color-primary-900)]'
                            : 'border-[var(--color-border-light)] hover:border-[var(--color-primary-300)] hover:bg-gray-50 text-[var(--color-text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                              isSelected
                                ? 'bg-[var(--color-primary-600)] text-white'
                                : 'bg-gray-100 text-[var(--color-text-secondary)] group-hover:bg-gray-200'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm font-medium leading-relaxed">{option.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--color-primary-600)] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-light)] border border-[var(--color-border-light)] rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={userAnswers[currentQuestion.id] === undefined}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isAllAnswered || submitting}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Calculating Profile...
                    </>
                  ) : (
                    <>
                      Submit & Analyze <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 3: RESULTS DASHBOARD                                     */}
        {/* ============================================================== */}
        {viewMode === 'results' && result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header Hero Result Card */}
            <div className="p-8 bg-[var(--color-surface-light)] rounded-2xl border border-[var(--color-border-light)] shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> Assessment Complete
                  </span>
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    {result.personality_type}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                    {result.summary}
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[220px]">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full px-5 py-3 text-sm font-semibold text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="w-full px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-gray-50 hover:bg-gray-100 rounded-xl transition border border-[var(--color-border-light)] flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake Assessment
                  </button>
                </div>
              </div>
            </div>

            {/* Top Traits Badges */}
            <div className="p-6 bg-[var(--color-surface-light)] rounded-2xl border border-[var(--color-border-light)] space-y-3">
              <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Identified Core Strengths & Traits
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {result.top_traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 text-sm font-medium bg-[var(--color-primary-50)] text-[var(--color-primary-800)] border border-[var(--color-primary-200)] rounded-lg shadow-2xs"
                  >
                    ✨ {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Domain Scores Breakdown & Career Matches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Domain Skill Scores */}
              <div className="p-6 bg-[var(--color-surface-light)] rounded-2xl border border-[var(--color-border-light)] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--color-primary-600)]" /> Domain Score Distribution
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)]">Normalized %</span>
                </div>

                <div className="space-y-4">
                  {Object.entries(result.category_scores).map(([domain, score]) => (
                    <div key={domain} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[var(--color-text-primary)]">
                        <span>{domain}</span>
                        <span className="text-[var(--color-primary-600)]">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          className="bg-[var(--color-primary-500)] h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Domains */}
              <div className="p-6 bg-[var(--color-surface-light)] rounded-2xl border border-[var(--color-border-light)] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" /> Recommended Career Pathways
                  </h3>
                </div>

                <div className="space-y-3">
                  {result.recommended_domains.map((domainName, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[var(--color-border-light)] bg-gradient-to-r from-gray-50 to-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                          {domainName}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        High Match
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    💡 Phase 6 AI Recommendation Engine will use these result vectors to generate personalized learning paths and job role matches.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
