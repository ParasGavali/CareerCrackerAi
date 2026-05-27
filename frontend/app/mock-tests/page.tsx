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
      <div className="flex min-h-screen bg-surface text-on-surface font-body-md">
        <Sidebar activePath="/mock-tests" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-xs">
                  <Award className="text-primary animate-pulse" />
                  Mock Placement Arena
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  Enforced fullscreen examinations matching exact company recruitment patterns.
                </p>
              </div>
              <div className="flex items-center gap-xs bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-lg">
                <ShieldAlert size={18} className="text-amber-700" />
                <span className="font-label-sm text-label-sm text-amber-800">Anti-Cheat Enabled (Auto Tab-Switch Detection)</span>
              </div>
            </div>

            {/* Assessment Tabs & Company Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm border-b border-outline-variant/30 pb-sm mb-md">
              <div className="flex flex-wrap gap-xs bg-surface-container p-1 rounded-lg border border-outline-variant/30">
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
                      'px-4 py-2 rounded-md font-label-md text-label-sm tracking-wide transition-all cursor-pointer',
                      activeTab === tab.id
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'company' && (
                <div className="flex items-center gap-xs self-start md:self-auto">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Company:</span>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 font-label-md text-label-sm text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
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
              <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-xl mx-auto mt-sm ambient-shadow">
                <BookOpen size={48} className="text-outline mx-auto mb-sm" />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No Placement Exams Found</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">No mock tests found matching the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
                {filteredTests.map((test, index) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-surface-container-lowest p-md flex flex-col justify-between border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 rounded-xl relative overflow-hidden group ambient-shadow"
                  >
                    {/* Subtle border top glow for interaction */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Top stats info row */}
                      <div className="flex items-center justify-between mb-sm">
                        {test.company && test.company !== 'None' ? (
                          <span className="font-label-sm text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md">
                            {test.company} Premium Prep
                          </span>
                        ) : (
                          <span className="font-label-sm text-[10px] font-bold tracking-wider uppercase bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-md">
                            Sectional exam
                          </span>
                        )}
                        <DifficultyBadge difficulty={test.difficulty} />
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-xs leading-tight group-hover:text-primary transition-colors">
                        {test.title}
                      </h3>
                      <p className="font-body-md text-label-sm text-on-surface-variant leading-relaxed mb-sm line-clamp-2">
                        {test.description}
                      </p>
                    </div>

                    {/* Bottom stats and action bar */}
                    <div>
                      <div className="flex items-center gap-sm text-on-surface-variant font-label-sm text-xs border-t border-outline-variant/30 pt-sm mb-sm">
                        <span className="flex items-center gap-xs">
                          <Clock size={13} className="text-outline" />
                          {test.duration} mins
                        </span>
                        <span className="flex items-center gap-xs">
                          <FileText size={13} className="text-outline" />
                          {test.questions ? test.questions.length : 15} Questions
                        </span>
                        <span className="flex items-center gap-xs">
                          <Award size={13} className="text-outline" />
                          {test.totalMarks || 100} Marks
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartTest(test._id)}
                        className="w-full btn-glow font-label-md text-label-md py-3 px-4 rounded-lg text-white font-bold tracking-wide flex items-center justify-center gap-xs transition-all cursor-pointer shadow-sm"
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
            <div className="mt-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-xs">
                <History size={18} className="text-primary" />
                Previous Placement Attempts
              </h2>

              {attempts.length === 0 ? (
                <div className="text-center py-sm border border-dashed border-outline-variant rounded-xl bg-surface-container">
                  <p className="font-body-md text-body-md text-on-surface-variant">You haven&apos;t taken any mock placement assessments yet.</p>
                </div>
              ) : (
                <div className="space-y-sm">
                  {attempts.map(attempt => {
                    const testMeta = attempt.test as any;
                    const displayDate = attempt.submittedAt || attempt.createdAt 
                      ? new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString()
                      : 'Recent';

                    return (
                      <div
                        key={attempt._id}
                        className="bg-surface-container-lowest p-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-sm hover:border-primary/30 transition-all rounded-xl ambient-shadow"
                      >
                        <div className="flex items-start gap-sm">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <Award size={20} />
                          </div>
                          <div>
                            <h4 className="font-label-md text-body-md font-bold text-on-surface">{testMeta?.title || 'Placement Assessment'}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label-sm text-xs text-on-surface-variant mt-1">
                              <span>Score: <strong className="text-on-surface">{attempt.score}/{attempt.totalQuestions * 10}</strong></span>
                              <span>•</span>
                              <span>Accuracy: <strong className="text-on-surface">{attempt.percentage}%</strong></span>
                              <span>•</span>
                              <span>Date: <span className="text-on-surface">{displayDate}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-sm border-t md:border-t-0 border-outline-variant/30 pt-sm md:pt-0">
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                            <CheckCircle2 size={12} />
                            Completed
                          </div>

                          <button
                            onClick={() => router.push(`/practice/quiz/results`)}
                            className="flex items-center gap-xs px-4 py-2 font-label-md text-label-sm rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer"
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
