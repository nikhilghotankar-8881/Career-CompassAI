import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Clock, ExternalLink, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/services/courseService';
import { CourseRecommendation } from '@/types/course';
import Navbar from '@/components/layout/Navbar';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to load course recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewCourses = async () => {
    try {
      setIsGenerating(true);
      const data = await courseService.generateCourses();
      setCourses(data);
      toast.success('Successfully generated new course recommendations!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate courses. Do you have an active roadmap?');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('coursera')) return 'text-blue-700 bg-blue-50';
    if (p.includes('udemy')) return 'text-purple-700 bg-purple-50';
    if (p.includes('edx')) return 'text-red-700 bg-red-50';
    if (p.includes('google') || p.includes('aws')) return 'text-orange-700 bg-orange-50';
    return 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] text-[var(--color-text-main)] flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[var(--max-width)] w-full mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-[var(--color-primary-600)]" />
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Learning Resources</h1>
            </div>
            <p className="text-[var(--color-text-secondary)]">AI-curated courses to help you achieve your career roadmap goals.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={generateNewCourses}
              disabled={isGenerating || isLoading}
              className="flex items-center gap-2 bg-[var(--color-primary-600)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-700)] disabled:opacity-70 transition-all shadow-md"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Gaps...</>
              ) : (
                <><RefreshCcw className="w-5 h-5" /> Generate New Recommendations</>
              )}
            </button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary-600)]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Recommended Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Generate AI recommendations to find the best courses and certifications to bridge your skill gaps.
            </p>
            <button
              onClick={generateNewCourses}
              className="text-[var(--color-primary-600)] font-bold hover:underline"
            >
              Generate Recommendations Now
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlatformColor(course.platform)}`}>
                        {course.platform}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {course.type === 'Certification' ? <GraduationCap className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        {course.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[var(--color-primary-600)] transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className={`px-2.5 py-1 rounded-md border font-semibold ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" /> {course.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                    <a 
                      href={course.url || "#"} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                      View Resource <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
