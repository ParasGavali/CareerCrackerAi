'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { testsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Test, TestAttempt } from '@/types';
import {
  BookOpen, Clock, FileText, ChevronRight, Award,
  Sparkles, History, ShieldAlert, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MockTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'topic' | 'quick'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, attemptsRes] = await Promise.all([
          testsApi.getTests({ limit: 100 }),
          testsApi.getMyAttempts({ limit: 5 })
        ]);
        
        setTests(testsRes.data.data || []);
        setAttempts(attemptsRes.data.data || []);
      } catch (e) {
        console.error('API Error, falling back to mock tests:', e);
        setTests(generateFallbackTests());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateFallbackTests = (): Test[] => {
    const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Capgemini', 'Accenture'];
    return [
      {
        _id: 'tcs-nqt-mock',
        title: 'TCS Ninja National Qualifier Test (NQT) - Mock 1',
        description: 'Full-length mock test matching the latest TCS Ninja recruitment pattern including Numerical Ability, Verbal Ability, and Reasoning Ability.',
        category: 'mixed',
        company: 'TCS',
        duration: 30,
        totalMarks: 100,
        passingMarks: 50,
        questions: Array(15).fill(''),
        difficulty: 'mixed',
        isActive: true,
        attemptCount: 1420,
        tags: ['TCS', 'Ninja', 'NQT'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'infosys-se-mock',
        title: 'Infosys System Engineer (SE) recruitment - Mock 1',
        description: 'Comprehensive mock test designed for Infosys SE hiring, focusing on Mathematical Ability, Logical Reasoning, and Verbal English.',
        category: 'mixed',
        company: 'Infosys',
        duration: 40,
        totalMarks: 120,
        passingMarks: 60,
        questions: Array(16).fill(''),
        difficulty: 'mixed',
        isActive: true,
        attemptCount: 890,
        tags: ['Infosys', 'SE'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'accenture-mock',
        title: 'Accenture ASE Placement Qualifier',
        description: 'Mock exam matching the Accenture Associate Software Engineer cognitive assessment including English Ability, Critical Reasoning, and Problem Solving.',
        category: 'mixed',
        company: 'Accenture',
        duration: 45,
        totalMarks: 100,
        passingMarks: 55,
        questions: Array(15).fill(''),
        difficulty: 'mixed',
        isActive: true,
        attemptCount: 1105,
        tags: ['Accenture', 'ASE'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'wipro-mock',
        title: 'Wipro Elite NLTH Placement Mock',
        description: 'Full exam simulation matching the Wipro Elite National Level Talent Hunt (NLTH) pattern containing Aptitude and English.',
        category: 'mixed',
        company: 'Wipro',
        duration: 35,
        totalMarks: 100,
        passingMarks: 50,
        questions: Array(15).fill(''),
        difficulty: 'medium',
        isActive: true,
        attemptCount: 955,
        tags: ['Wipro', 'Elite', 'NLTH'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'quant-mega-mock',
        title: 'Quantitative Aptitude Mega Mock Test',
        description: 'In-depth evaluation of your Quantitative abilities covering Number Systems, Profit & Loss, Time & Work, Speed Distance, and Ratios.',
        category: 'quantitative',
        company: 'None',
        duration: 45,
        totalMarks: 150,
        passingMarks: 75,
        questions: Array(15).fill(''),
        difficulty: 'hard',
        isActive: true,
        attemptCount: 420,
        tags: ['Quantitative', 'Arithmetic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'logical-speed',
        title: 'Logical Reasoning Speed Challenge',
        description: 'Time-bound speed assessment testing analytical puzzles, blood relations, syllogisms, coding-decoding, and series completion.',
        category: 'logical',
        company: 'None',
        duration: 20,
        totalMarks: 60,
        passingMarks: 30,
        questions: Array(10).fill(''),
        difficulty: 'medium',
        isActive: true,
        attemptCount: 780,
        tags: ['Logical', 'Reasoning'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  };

  const handleStartTest = (testId: string) => {
    toast.success('Initializing focus assessment mode...');
    router.push(`/mock-tests/${testId}`);
  };

  // Filter logic
  const filteredTests = tests.filter(test => {
    // Tab filtering
    if (activeTab === 'company' && test.company === 'None') return false;
    if (activeTab === 'topic' && test.company !== 'None') return false;
    if (activeTab === 'quick' && test.duration > 25) return false;

    // Company specific dropdown filtering
    if (activeTab === 'company' && selectedCompany !== 'all' && test.company !== selectedCompany) return false;

    return true;
  });

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <Sidebar activePath="/mock-tests" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <Award className="text-purple-500 animate-pulse" />
                  Mock Placement Arena
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Enforced fullscreen examinations matching exact company recruitment patterns.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2.5 rounded-xl">
                <ShieldAlert size={18} className="text-yellow-400" />
                <span className="text-xs text-yellow-300 font-medium">Anti-Cheat Enabled (Auto Tab-Switch Detection)</span>
              </div>
            </div>

            {/* Assessment Tabs & Company Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
              <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All Exams' },
                  { id: 'company', label: 'Company-Specific' },
                  { id: 'topic', label: 'Section Tests' },
                  { id: 'quick', label: 'Quick Tests (< 25m)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSelectedCompany('all'); }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer',
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'company' && (
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Company:</span>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                  >
                    <option value="all">All Companies</option>
                    <option value="TCS">TCS</option>
                    <option value="Infosys">Infosys</option>
                    <option value="Wipro">Wipro</option>
                    <option value="HCL">HCL</option>
                    <option value="Cognizant">Cognizant</option>
                    <option value="Capgemini">Capgemini</option>
                    <option value="Accenture">Accenture</option>
                  </select>
                </div>
              )}
            </div>

            {/* Test Cards List */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" text="Loading available placement exams..." />
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-20 glass-card border-white/5 max-w-xl mx-auto mt-6">
                <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Placement Exams Found</h3>
                <p className="text-sm text-slate-500">No mock tests found matching the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredTests.map((test, index) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-card p-6 flex flex-col justify-between border-white/5 hover:border-purple-500/20 hover:bg-slate-900/10 transition-all relative overflow-hidden group"
                  >
                    {/* Glowing highlight decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-bl-full pointer-events-none group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

                    <div>
                      {/* Top stats info row */}
                      <div className="flex items-center justify-between mb-4">
                        {test.company && test.company !== 'None' ? (
                          <span className="text-[10px] font-black tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md">
                            {test.company} Premium Prep
                          </span>
                        ) : (
                          <span className="text-[10px] font-black tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md">
                            Sectional exam
                          </span>
                        )}
                        <DifficultyBadge difficulty={test.difficulty} />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors">
                        {test.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                        {test.description}
                      </p>
                    </div>

                    {/* Bottom stats and action bar */}
                    <div>
                      <div className="flex items-center gap-4 text-slate-500 text-xs border-t border-white/5 pt-4 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          {test.duration} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={13} className="text-slate-400" />
                          {test.questions ? test.questions.length : 15} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Award size={13} className="text-slate-400" />
                          {test.totalMarks || 100} Marks
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartTest(test._id)}
                        className="w-full btn-glow py-3 px-4 rounded-xl text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        Launch Placement Exam
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Test Attempts History */}
            <div className="mt-12">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <History size={18} className="text-purple-500" />
                Previous Placement Attempts
              </h2>

              {attempts.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  <p className="text-sm text-slate-500">You haven&apos;t taken any mock placement assessments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attempts.map(attempt => {
                    const testMeta = attempt.test as any;
                    return (
                      <div
                        key={attempt._id}
                        className="glass-card p-5 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                            <Award size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{testMeta?.title || 'Placement Assessment'}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                              <span>Score: <strong className="text-slate-300">{attempt.score}/{attempt.totalQuestions * 10}</strong></span>
                              <span>•</span>
                              <span>Accuracy: <strong className="text-slate-300">{attempt.percentage}%</strong></span>
                              <span>•</span>
                              <span>Date: <span>{new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString()}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                            <CheckCircle2 size={12} />
                            Completed
                          </div>

                          <button
                            onClick={() => router.push(`/practice/quiz/results`)} // Wait! If it has mock-test specific result, we go there, else standard quiz results or attempts
                            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-400 hover:border-purple-500/30 hover:text-purple-400 transition-all cursor-pointer"
                          >
                            Review
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
