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
  BookOpen,
  Clock,
  FileText,
  ChevronRight,
  Award,
  History,
  CheckCircle2,
  LayoutGrid,
  Building2,
  Zap,
  Tag,
  RotateCcw,
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
          testsApi.getMyAttempts({ limit: 5 }),
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
    return [
      {
        _id: 'tcs-nqt-mock',
        title: 'TCS Ninja National Qualifier Test (NQT) - Mock 1',
        description:
          'Full-length mock test matching the latest TCS Ninja recruitment pattern including Numerical Ability, Verbal Ability, and Reasoning Ability.',
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
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'infosys-se-mock',
        title: 'Infosys System Engineer (SE) Recruitment - Mock 1',
        description:
          'Comprehensive mock test designed for Infosys SE hiring, focusing on Mathematical Ability, Logical Reasoning, and Verbal English.',
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
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'accenture-mock',
        title: 'Accenture ASE Placement Qualifier',
        description:
          'Mock exam matching the Accenture Associate Software Engineer cognitive assessment including English Ability, Critical Reasoning, and Problem Solving.',
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
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'wipro-mock',
        title: 'Wipro Elite NLTH Placement Mock',
        description:
          'Full exam simulation matching the Wipro Elite National Level Talent Hunt (NLTH) pattern containing Aptitude and English.',
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
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'quant-mega-mock',
        title: 'Quantitative Aptitude Mega Mock Test',
        description:
          'In-depth evaluation of your Quantitative abilities covering Number Systems, Profit & Loss, Time & Work, Speed Distance, and Ratios.',
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
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'logical-speed',
        title: 'Logical Reasoning Speed Challenge',
        description:
          'Time-bound speed assessment testing analytical puzzles, blood relations, syllogisms, coding-decoding, and series completion.',
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
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  const handleStartTest = (testId: string) => {
    toast.success('Initializing focus assessment mode...');
    router.push(`/mock-tests/${testId}`);
  };

  // Filter logic
  const filteredTests = tests.filter((test) => {
    if (activeTab === 'company' && test.company === 'None') return false;
    if (activeTab === 'topic' && test.company !== 'None') return false;
    if (activeTab === 'quick' && test.duration > 25) return false;
    if (activeTab === 'company' && selectedCompany !== 'all' && test.company !== selectedCompany)
      return false;
    return true;
  });

  const companyTests = tests.filter((t) => t.company && t.company !== 'None');
  const quickTests = tests.filter((t) => t.duration <= 25);

  const tabs = [
    { id: 'all', label: 'All Exams', icon: LayoutGrid },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'topic', label: 'By Topic', icon: Tag },
    { id: 'quick', label: 'Quick (<25m)', icon: Zap },
  ] as const;

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFF]">
        <Sidebar />

        {/* Main scrollable content */}
        <main className="flex-1 ml-[260px] overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">

            {/* ── PAGE HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                  Mock Tests
                </h1>
                <p className="text-sm text-[#6B7280] mt-1">
                  Simulated placement assessments matching exact company recruitment patterns.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                  <FileText size={15} className="text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#374151]">
                    {tests.length} Tests
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                  <Building2 size={15} className="text-[#7C3AED]" />
                  <span className="text-xs font-semibold text-[#374151]">
                    {companyTests.length} Company
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                  <Zap size={15} className="text-[#D97706]" />
                  <span className="text-xs font-semibold text-[#374151]">
                    {quickTests.length} Quick
                  </span>
                </div>
              </div>
            </div>

            {/* ── RECENT ATTEMPTS ── */}
            {attempts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <History size={15} className="text-[#6B7280]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Recent Attempts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {attempts.map((attempt) => {
                    const testMeta = attempt.test as any;
                    const displayDate =
                      attempt.submittedAt || attempt.createdAt
                        ? new Date(
                            attempt.submittedAt || attempt.createdAt
                          ).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Recent';
                    const pct = attempt.percentage ?? 0;
                    const scoreColor =
                      pct >= 70
                        ? 'text-[#059669]'
                        : pct >= 45
                        ? 'text-[#D97706]'
                        : 'text-[#DC2626]';

                    return (
                      <div
                        key={attempt._id}
                        className="bg-white border border-[#E4E7EC] rounded-xl p-5 hover:border-[#BFDBFE] hover:shadow-md transition-all"
                        style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)' }}
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                            <Award size={17} className="text-[#2563EB]" />
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-[#D1FAE5] text-[#059669] border border-[#6EE7B7] px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} />
                            Completed
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[#111827] leading-snug line-clamp-2 mb-2">
                          {testMeta?.title || 'Placement Assessment'}
                        </h4>

                        <div className="flex items-center gap-x-3 text-xs text-[#6B7280] mb-4 flex-wrap gap-y-1">
                          <span>
                            Score:{' '}
                            <strong className={cn('font-bold', scoreColor)}>
                              {attempt.score}/{attempt.totalQuestions * 10}
                            </strong>
                          </span>
                          <span className="text-[#D1D5DB]">·</span>
                          <span>
                            Accuracy:{' '}
                            <strong className={cn('font-bold', scoreColor)}>
                              {attempt.percentage}%
                            </strong>
                          </span>
                          <span className="text-[#D1D5DB]">·</span>
                          <span className="text-[#9CA3AF]">{displayDate}</span>
                        </div>

                        <button
                          onClick={() => router.push('/practice/quiz/results')}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E4E7EC] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
                        >
                          Review Results
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── FILTER TABS + COMPANY FILTER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Pill tabs */}
              <div className="flex items-center gap-1 bg-white border border-[#E4E7EC] rounded-full p-1 w-fit shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedCompany('all');
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer',
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-[#6B7280] hover:text-[#2563EB]'
                      )}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Company dropdown — only on company tab */}
              {activeTab === 'company' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Filter:
                  </span>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="bg-white border border-[#E4E7EC] rounded-lg px-3 py-2 text-sm text-[#111827] font-medium focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer shadow-sm"
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

            {/* ── TEST CARDS / LOADING / EMPTY ── */}
            {loading ? (
              /* Loading state */
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <LoadingSpinner size="lg" text="Loading placement exams..." />
              </div>
            ) : filteredTests.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                  <BookOpen size={32} className="text-[#2563EB]" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#111827] mb-1">No Tests Found</h3>
                  <p className="text-sm text-[#6B7280] max-w-xs mx-auto">
                    No mock tests match the current filters. Try switching tabs or adjusting your
                    company filter.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/practice')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-sm font-semibold text-[#2563EB] hover:bg-[#DBEAFE] transition-all"
                >
                  <BookOpen size={15} />
                  Go to Practice
                </button>
              </div>
            ) : (
              /* Test cards grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTests.map((test, index) => {
                  const attemptForTest = attempts.find(
                    (a) => (a.test as any)?._id === test._id || (a.test as any) === test._id
                  );
                  const questionCount = test.questions ? test.questions.length : 15;

                  return (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: index * 0.05 }}
                      className="group bg-white border border-[#E4E7EC] rounded-2xl p-6 flex flex-col justify-between hover:border-[#93C5FD] hover:shadow-md transition-all duration-300 relative overflow-hidden"
                      style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)' }}
                    >
                      {/* Top accent line on hover */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                      {/* Card body */}
                      <div>
                        {/* Company + difficulty row */}
                        <div className="flex items-center justify-between mb-3">
                          {test.company && test.company !== 'None' ? (
                            <span className="text-[11px] font-black tracking-wider uppercase text-[#2563EB]">
                              {test.company}
                            </span>
                          ) : (
                            <span className="text-[11px] font-black tracking-wider uppercase text-[#7C3AED]">
                              Topic Test
                            </span>
                          )}
                          <DifficultyBadge difficulty={test.difficulty} />
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-[#111827] text-base leading-snug mt-1 mb-3 group-hover:text-[#2563EB] transition-colors line-clamp-2">
                          {test.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">
                          {test.description}
                        </p>
                      </div>

                      {/* Card footer */}
                      <div>
                        {/* Stats row */}
                        <div className="flex items-center gap-4 text-xs text-[#6B7280] border-t border-[#F3F4F6] pt-4 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#9CA3AF]" />
                            {test.duration} mins
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={13} className="text-[#9CA3AF]" />
                            {questionCount} Qs
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award size={13} className="text-[#9CA3AF]" />
                            {test.totalMarks || 100} Marks
                          </span>
                        </div>

                        {/* Attempts count */}
                        {test.attemptCount !== undefined && (
                          <p className="text-xs text-[#9CA3AF] mb-3">
                            {test.attemptCount.toLocaleString()} attempts
                          </p>
                        )}

                        {/* If already attempted — show score badge + retake */}
                        {attemptForTest ? (
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border',
                                (attemptForTest.percentage ?? 0) >= 60
                                  ? 'bg-[#D1FAE5] border-[#6EE7B7] text-[#059669]'
                                  : 'bg-[#FEF3C7] border-[#FCD34D] text-[#D97706]'
                              )}
                            >
                              <CheckCircle2 size={12} />
                              {attemptForTest.percentage}% scored
                            </div>
                            <button
                              onClick={() => handleStartTest(test._id)}
                              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E4E7EC] text-sm font-semibold text-[#6B7280] py-2.5 hover:border-[#2563EB] hover:text-[#2563EB] transition-all cursor-pointer"
                            >
                              <RotateCcw size={13} />
                              Retake
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartTest(test._id)}
                            className="btn-primary w-full rounded-xl text-sm py-2.5 flex items-center justify-center gap-2 font-semibold cursor-pointer"
                          >
                            Start Test
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
