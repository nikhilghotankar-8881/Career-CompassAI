import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, Briefcase, TrendingUp, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { recommendationService } from '@/services/recommendationService';
import { CareerRecommendation } from '@/types/recommendation';
import Navbar from '@/components/layout/Navbar';

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const data = await recommendationService.getRecommendations();
      setRecommendations(data.recommendations);
      setUserSkills(data.user_skills);
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const data = await recommendationService.generateRecommendations();
      setRecommendations(data.recommendations);
      setUserSkills(data.user_skills);
      toast.success('AI Recommendations generated!');
    } catch (error) {
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] text-[var(--color-text-main)] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Career Match 🚀</h1>
            <p className="text-[var(--color-text-muted)]">
              Discover roles tailored to your skills, personality, and interests.
            </p>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || isLoading}
            className="flex items-center gap-2 bg-[var(--color-primary-600)] text-white px-5 py-3 rounded-full hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-md shadow-primary-500/20"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'Analyzing Profile...' : 'Generate New Matches'}
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary-600)]" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[var(--color-border-subtle)] rounded-xl shadow-sm">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              Generate AI recommendations based on your profile and assessment.
            </p>
            <button 
              onClick={handleGenerate}
              className="bg-[var(--color-primary-600)] text-white px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-700)] transition-colors"
            >
              Generate Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Top Match */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {recommendations.map((rec, idx) => (
                <motion.div 
                  key={rec.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm border ${idx === 0 ? 'border-[var(--color-primary-500)] shadow-[var(--color-primary-500)]/10 shadow-md' : 'border-[var(--color-border-subtle)]'} overflow-hidden p-6`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {rec.career_title}
                        {idx === 0 && <span className="bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Top Match</span>}
                      </h2>
                      <p className="text-gray-500 mt-1">{rec.description}</p>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-bold text-xl border-4 border-[var(--color-primary-200)] shrink-0">
                      {rec.match_percentage}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50/50 border border-green-100 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" /> Skills You Have
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.required_skills.filter(s => userSkills.includes(s)).map(skill => (
                          <span key={skill} className="bg-white border border-green-200 text-green-700 text-sm px-2 py-1 rounded-md">{skill}</span>
                        ))}
                        {rec.required_skills.filter(s => userSkills.includes(s)).length === 0 && (
                          <span className="text-sm text-green-600/70 italic">None yet, but you can learn!</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4" /> Skills to Learn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.skill_gaps.map(skill => (
                          <span key={skill} className="bg-white border border-orange-200 text-orange-700 text-sm px-2 py-1 rounded-md">{skill}</span>
                        ))}
                         {rec.skill_gaps.length === 0 && (
                          <span className="text-sm text-orange-600/70 italic">You have all core skills!</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                     {rec.salary_range && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="font-medium text-gray-900">Salary:</span> {rec.salary_range}
                      </div>
                     )}
                     {rec.job_outlook && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <TrendingUp className="w-4 h-4 text-[var(--color-primary-500)]" />
                        <span className="font-medium text-gray-900">Outlook:</span> {rec.job_outlook}
                      </div>
                     )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: CTA */}
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-primary-950)] text-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">Ready to skill up?</h3>
                <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                  Now that you know your recommended roles and skill gaps, it's time to build a personalized learning roadmap to achieve your goals.
                </p>
                <button 
                  onClick={() => navigate(`/roadmap?recommendationId=${recommendations[0]?.id}`)}
                  className="w-full bg-white text-[var(--color-primary-800)] font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  Generate Roadmap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}
        
      </main>
    </div>
  );
}
