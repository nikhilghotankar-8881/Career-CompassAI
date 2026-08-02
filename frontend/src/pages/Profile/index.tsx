import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  GraduationCap,
  Sparkles,
  Target,
  Plus,
  X,
  Save,
  Loader2,
  Mail,
  Phone,
  Building,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/services/profile';
import type { Profile } from '@/types';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'skills' | 'goals'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [profile, setProfile] = useState<Profile | null>(null);

  // Personal Info
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Education
  const [educationLevel, setEducationLevel] = useState('');
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | ''>('');

  // Skills & Interests Tags
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  // Career Goals
  const [careerGoals, setCareerGoals] = useState('');

  useEffect(() => {
    async function loadProfileData() {
      try {
        const data = await getProfile();
        setProfile(data);
        setPhone(data.phone || '');
        setBio(data.bio || '');
        setTargetRole(data.target_role || '');
        setEducationLevel(data.education_level || '');
        setInstitution(data.institution || '');
        setFieldOfStudy(data.field_of_study || '');
        setGraduationYear(data.graduation_year || '');
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        setCareerGoals(data.career_goals || '');
      } catch (err: any) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await updateProfile({
        phone,
        bio,
        target_role: targetRole,
        education_level: educationLevel,
        institution,
        field_of_study: fieldOfStudy,
        graduation_year: graduationYear === '' ? undefined : Number(graduationYear),
        skills,
        interests,
        career_goals: careerGoals,
      });
      setProfile(updated);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Interests', icon: Sparkles },
    { id: 'goals', label: 'Career Goals', icon: Target },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] py-10">
      <div className="max-w-[var(--max-width)] mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)]">
              Your Profile
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage your personal information, skills, and educational background.
            </p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary-600)] text-white font-semibold rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-all shadow-[var(--shadow-card)] disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>

        {/* User Card Summary */}
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-border-light)] rounded-[var(--radius-card)] p-6 mb-8 shadow-[var(--shadow-card)] flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-secondary-500)] text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{profile?.full_name}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] flex items-center justify-center md:justify-start gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
              {profile?.email}
            </p>
            {profile?.target_role && (
              <span className="inline-block mt-2 px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-600)] text-xs font-semibold rounded-full">
                🎯 {profile.target_role}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border-light)] mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-[var(--radius-md)] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[var(--color-primary-600)] text-[var(--color-primary-600)] bg-[var(--color-surface-light)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-border-light)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)]">
          {/* Tab 1: Personal Info */}
          {activeTab === 'personal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Target Career Role</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. AI Engineer, Full Stack Developer"
                      className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Bio / Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us a little bit about yourself, your background, and goals..."
                  className="w-full p-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)] resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Tab 2: Education */}
          {activeTab === 'education' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Educational Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full h-12 px-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)] bg-white"
                  >
                    <option value="">Select Level</option>
                    <option value="High School">High School (Class 9–12)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                    <option value="Postgraduate">Postgraduate (Master's / PhD)</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">School / University / College</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Field of Study / Major</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Computer Science, Business"
                      className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Graduation Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 2026"
                      className="w-full h-12 pl-11 pr-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Skills & Interests */}
          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Technical & Soft Skills</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">Add skills you possess or are currently learning.</p>

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add a skill (e.g. Python, React, Data Analysis)"
                    className="flex-1 h-12 px-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="h-12 px-5 bg-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-button)] hover:bg-[var(--color-primary-700)] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)] italic">No skills added yet.</p>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-medium text-sm rounded-full border border-[var(--color-primary-200)]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <hr className="border-[var(--color-border-light)]" />

              {/* Interests */}
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Fields of Interest</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">Add domain interests for personalized AI career recommendations.</p>

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    placeholder="Add an interest (e.g. Artificial Intelligence, Robotics, Cyber Security)"
                    className="flex-1 h-12 px-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="h-12 px-5 bg-[var(--color-secondary-500)] text-white font-medium rounded-[var(--radius-button)] hover:bg-[var(--color-secondary-600)] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {interests.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)] italic">No interests added yet.</p>
                  ) : (
                    interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)] font-medium text-sm rounded-full border border-[var(--color-secondary-200)]"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Career Goals */}
          {activeTab === 'goals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Career Aspirations & Goals</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Describe your long-term career goals. This helps our AI tailor learning roadmaps and course recommendations.
              </p>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Detailed Goals</label>
                <textarea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  rows={6}
                  placeholder="e.g. I want to transition into an AI Research Scientist role within 3 years, specializing in Natural Language Processing and LLM agents..."
                  className="w-full p-4 border border-[var(--color-border-light)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary-500)] resize-none"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
