import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle2, AlertCircle, Lightbulb, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { resumeService } from '@/services/resumeService';
import { ResumeAnalysis } from '@/types/resume';
import Navbar from '@/components/layout/Navbar';

export default function ResumePage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      setIsLoading(true);
      const data = await resumeService.getAnalysis();
      setAnalysis(data);
    } catch (error: any) {
      // 404 is fine, just means they haven't uploaded yet
      if (error.response?.status !== 404) {
        toast.error('Failed to load past resume analysis');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const result = await resumeService.uploadResume(file);
      setAnalysis(result);
      toast.success('Resume analyzed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to analyze resume');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] text-[var(--color-text-main)] flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[var(--max-width)] w-full mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText className="w-8 h-8 text-[var(--color-primary-600)]" />
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">AI Resume Analyzer</h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            Upload your resume to get instant, actionable feedback powered by Gemini AI, tailored to your career roadmap.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary-600)]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                dragActive 
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] shadow-lg scale-105' 
                  : 'border-gray-300 hover:border-[var(--color-primary-400)] hover:bg-gray-50'
              } ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-16 h-16 animate-spin text-[var(--color-primary-600)]" />
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">Analyzing your resume...</p>
                  <p className="text-sm text-gray-500">Gemini is looking for keywords, impact, and formatting.</p>
                </div>
              ) : (
                <>
                  <Upload className={`w-16 h-16 mb-4 ${dragActive ? 'text-[var(--color-primary-600)]' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-bold mb-2">Drag & Drop your resume here</h3>
                  <p className="text-gray-500 mb-6">Supports PDF only (Max 5MB)</p>
                  <button className="bg-[var(--color-primary-600)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-700)] transition-colors shadow-md">
                    Browse Files
                  </button>
                </>
              )}
            </motion.div>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysis && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Score Card */}
                  <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-[var(--color-border-subtle)] p-8 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-gray-600 mb-6 uppercase tracking-wide">ATS Match Score</h3>
                    <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-[12px] border-gray-100 mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-6xl font-black ${getScoreColor(analysis.score)}`}>
                          {analysis.score}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Based on your current learning roadmap target role.
                    </p>
                    <button 
                      onClick={triggerFileInput}
                      className="mt-6 flex items-center gap-2 text-[var(--color-primary-600)] font-bold hover:text-[var(--color-primary-700)]"
                    >
                      <RefreshCcw className="w-4 h-4" /> Analyze Another
                    </button>
                  </div>

                  {/* Feedback Cards */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Strengths */}
                    <div className="bg-green-50/50 rounded-2xl border border-green-100 p-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500" /> Key Strengths
                      </h3>
                      <ul className="space-y-3">
                        {analysis.strengths.map((item, i) => (
                          <li key={i} className="flex gap-3 text-green-900">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-red-800 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" /> Areas for Improvement
                      </h3>
                      <ul className="space-y-3">
                        {analysis.weaknesses.map((item, i) => (
                          <li key={i} className="flex gap-3 text-red-900">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-[var(--color-primary-50)]/50 rounded-2xl border border-[var(--color-primary-100)] p-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary-800)] mb-4">
                        <Lightbulb className="w-6 h-6 text-[var(--color-primary-500)]" /> Actionable Suggestions
                      </h3>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((item, i) => (
                          <li key={i} className="flex gap-3 text-[var(--color-primary-900)]">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)]" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
