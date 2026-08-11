'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Input';
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

  const handleStartTest = (testId: string) => {
    toast.success('Initializing focus assessment mode...');
    router.push(`/mock-tests/${testId}`);
  };

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
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="Mock Tests"
          subtitle="Simulated placement assessments matching exact company recruitment patterns."
          actions={
            <>
              <span className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                <FileText size={15} className="text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#374151]">{tests.length} Tests</span>
              </span>
              <span className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                <Building2 size={15} className="text-[#7C3AED]" />
                <span className="text-xs font-semibold text-[#374151]">{companyTests.length} Company</span>
              </span>
              <span className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl px-4 py-2.5 shadow-sm">
                <Zap size={15} className="text-[#D97706]" />
                <span className="text-xs font-semibold text-[#374151]">{quickTests.length} Quick</span>
              </span>
            </>
          }
        />

        {/* ── RECENT ATTEMPTS ── */}
        {attempts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <History size={15} className="text-[#6B7280]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Recent Attempts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {attempts.map((attempt) => {
                const testMeta = typeof attempt.test === 'string' ? null : attempt.test;
                const displayDate =
                  attempt.submittedAt || attempt.createdAt
                    ? new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Recent';
                const pct = attempt.percentage ?? 0;
                const scoreColor = pct >= 70 ? 'text-[#059669]' : pct >= 45 ? 'text-[#D97706]' : 'text-[#DC2626]';

                return (
                  <Card key={attempt._id} hover className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                        <Award size={17} className="text-[#2563EB]" />
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} />
                        Completed
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#111827] leading-snug line-clamp-2 mb-2">
                      {testMeta?.title || 'Placement Assessment'}
                    </h4>

                    <div className="flex items-center gap-x-3 text-xs text-[#6B7280] mb-4 flex-wrap gap-y-1">
                      <span>
                        Score: <strong className={cn('font-bold', scoreColor)}>{attempt.score}/{attempt.totalQuestions * 10}</strong>
                      </span>
                      <span className="text-[#D1D5DB]">·</span>
                      <span>
                        Accuracy: <strong className={cn('font-bold', scoreColor)}>{attempt.percentage}%</strong>
                      </span>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="text-[#9CA3AF]">{displayDate}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push('/practice/quiz/results')}
                    >
                      Review Results
                      <ChevronRight size={13} />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* ── FILTER TABS + COMPANY FILTER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    isActive ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#2563EB]'
                  )}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'company' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Filter:</span>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-44 bg-white shadow-sm"
              >
                <option value="all">All Companies</option>
                <option value="TCS">TCS</option>
                <option value="Infosys">Infosys</option>
                <option value="Wipro">Wipro</option>
                <option value="HCL">HCL</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Capgemini">Capgemini</option>
                <option value="Accenture">Accenture</option>
              </Select>
            </div>
          )}
        </div>

        {/* ── TEST CARDS / LOADING / EMPTY ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <LoadingSpinner size="lg" text="Loading placement exams..." />
          </div>
        ) : filteredTests.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={32} className="text-[#2563EB]" />}
            title="No Tests Found"
            description="No mock tests match the current filters. Try switching tabs or adjusting your company filter."
            action={
              <Button variant="secondary" size="sm" onClick={() => router.push('/practice')}>
                <BookOpen size={15} />
                Go to Practice
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTests.map((test, index) => {
              const attemptForTest = attempts.find(
                (a) => (typeof a.test !== 'string' && a.test._id === test._id) || a.test === test._id
              );
              const questionCount = test.questions ? test.questions.length : 15;

              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.05 }}
                >
                  <Card hover className="group p-6 flex flex-col justify-between h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        {test.company && test.company !== 'None' ? (
                          <span className="text-[11px] font-black tracking-wider uppercase text-[#2563EB]">{test.company}</span>
                        ) : (
                          <span className="text-[11px] font-black tracking-wider uppercase text-[#7C3AED]">Topic Test</span>
                        )}
                        <DifficultyBadge difficulty={test.difficulty} />
                      </div>

                      <h3 className="font-bold text-[#111827] text-base leading-snug mt-1 mb-3 group-hover:text-[#2563EB] transition-colors line-clamp-2">
                        {test.title}
                      </h3>

                      <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">{test.description}</p>
                    </div>

                    <div>
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

                      {test.attemptCount !== undefined && (
                        <p className="text-xs text-[#9CA3AF] mb-3">{test.attemptCount.toLocaleString()} attempts</p>
                      )}

                      {attemptForTest ? (
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border',
                              (attemptForTest.percentage ?? 0) >= 60
                                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                                : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                            )}
                          >
                            <CheckCircle2 size={12} />
                            {attemptForTest.percentage}% scored
                          </div>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleStartTest(test._id)}>
                            <RotateCcw size={13} />
                            Retake
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartTest(test._id)}
                          className={buttonVariants({ variant: 'primary', size: 'md', className: 'w-full rounded-xl' })}
                        >
                          Start Test
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
