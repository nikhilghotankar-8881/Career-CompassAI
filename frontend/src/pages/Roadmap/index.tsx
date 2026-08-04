import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Circle, PlayCircle, Map, Target, AlertCircle } from 'lucide-react';
import { roadmapService } from '@/services/roadmapService';
import type { Roadmap, Milestone } from '@/types/roadmap';
import Navbar from '@/components/layout/Navbar';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recommendationId = searchParams.get('recommendationId');
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (recommendationId) {
      handleGenerateRoadmap(recommendationId);
    } else {
      fetchActiveRoadmap();
    }
  }, [recommendationId]);

  const fetchActiveRoadmap = async () => {
    try {
      setIsLoading(true);
      const data = await roadmapService.getActiveRoadmap();
      setRoadmap(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load roadmap');
      }
      setRoadmap(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async (id: string) => {
    try {
      setIsGenerating(true);
      const data = await roadmapService.generateRoadmap(id);
      setRoadmap(data);
      toast.success('Your personalized roadmap is ready!');
      // Remove query param without reloading page
      navigate('/roadmap', { replace: true });
    } catch (error) {
      toast.error('Failed to generate roadmap');
      fetchActiveRoadmap(); // Fallback to fetching active
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMilestoneStatus = async (milestone: Milestone) => {
    try {
      setUpdatingId(milestone.id);
      const newStatus = milestone.status === 'completed' ? 'pending' : (milestone.status === 'pending' ? 'in_progress' : 'completed');
      
      const updatedRoadmap = await roadmapService.updateMilestoneStatus(milestone.id, { status: newStatus });
      setRoadmap(updatedRoadmap);
      
      if (newStatus === 'completed') {
        toast.success(`Completed: ${milestone.title}`);
      }
    } catch (error) {
      toast.error('Failed to update milestone');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    if (status === 'in_progress') return <PlayCircle className="w-6 h-6 text-[var(--color-primary-500)]" />;
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] text-[var(--color-text-main)] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        
        {isLoading || isGenerating ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary-600)]" />
            <p className="text-[var(--color-text-muted)] font-medium">
              {isGenerating ? 'AI is crafting your personalized learning path...' : 'Loading your roadmap...'}
            </p>
          </div>
        ) : !roadmap ? (
          <div className="text-center py-20 bg-white border border-[var(--color-border-subtle)] rounded-xl shadow-sm">
            <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Active Roadmap</h3>
            <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
              You haven't generated a learning roadmap yet. Go to your recommendations to select a career path and build your journey.
            </p>
            <button 
              onClick={() => navigate('/recommendations')}
              className="bg-[var(--color-primary-600)] text-white px-6 py-3 rounded-lg font-bold hover:bg-[var(--color-primary-700)] transition-colors"
            >
              View Recommendations
            </button>
          </div>
        ) : (
          <>
            {/* Header / Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-subtle)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-primary-600)] font-semibold text-sm uppercase tracking-wider mb-2">
                  <Target className="w-4 h-4" /> Your Target Role
                </div>
                <h1 className="text-3xl font-bold">{roadmap.target_role}</h1>
                <p className="text-gray-500 mt-2">Follow these milestones to achieve your goal.</p>
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[120px]">
                <div className="text-4xl font-black text-[var(--color-primary-700)] mb-1">
                  {roadmap.progress_percentage}%
                </div>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Completed</span>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${roadmap.progress_percentage}%` }}
                    className="bg-[var(--color-primary-500)] h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Timeline UI */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-subtle)] p-6 md:p-10 relative">
              
              <div className="absolute left-10 md:left-14 top-10 bottom-10 w-0.5 bg-gray-100"></div>
              
              <div className="flex flex-col gap-8 relative z-10">
                {roadmap.milestones.map((milestone, idx) => (
                  <motion.div 
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 md:gap-6 group"
                  >
                    {/* Status Indicator */}
                    <button 
                      onClick={() => toggleMilestoneStatus(milestone)}
                      disabled={updatingId === milestone.id}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-white transition-transform ${updatingId === milestone.id ? 'opacity-50' : 'hover:scale-110'}`}
                    >
                      {updatingId === milestone.id ? (
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      ) : (
                        getStatusIcon(milestone.status)
                      )}
                    </button>
                    
                    {/* Milestone Content */}
                    <div className={`flex-grow bg-white border ${milestone.status === 'completed' ? 'border-green-200 bg-green-50/30' : (milestone.status === 'in_progress' ? 'border-[var(--color-primary-300)] shadow-[var(--color-primary-500)]/5 shadow-md' : 'border-gray-100')} p-5 rounded-xl transition-colors`}>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className={`font-bold text-lg ${milestone.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {milestone.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                          milestone.status === 'in_progress' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${milestone.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
            </div>
            
            {roadmap.progress_percentage === 100 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white text-center flex flex-col items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-12 h-12" />
                <h2 className="text-2xl font-bold">Congratulations! 🎉</h2>
                <p className="text-green-50">You have completed your learning roadmap for becoming a {roadmap.target_role}.</p>
              </motion.div>
            )}
          </>
        )}
        
      </main>
    </div>
  );
}
