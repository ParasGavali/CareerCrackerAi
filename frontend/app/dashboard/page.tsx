'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { analyticsApi } from '@/lib/api';
import {
  formatDate, formatTime, calculateGrade, getScoreBgColor,
  getPlacementReadinessLabel, getPlacementReadinessColor, cn
} from '@/lib/utils';
import type { DashboardStats } from '@/types';
import {
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis
} from 'recharts';
import {
  Trophy, Target, Zap, Star, ChevronRight,
  FileText, Calendar, Clock, BookOpen, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getDashboard()
      .then(res => setStats(res.data.data || null))
      .catch(() => {
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F8FAFF]">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const weeklyData = stats?.weeklyProgress || [
    { date: 'Mon', score: 62, testsAttempted: 1 },
    { date: 'Tue', score: 68, testsAttempted: 2 },
    { date: 'Wed', score: 71, testsAttempted: 1 },
    { date: 'Thu', score: 75, testsAttempted: 3 },
    { date: 'Fri', score: 73, testsAttempted: 2 },
    { date: 'Sat', score: 80, testsAttempted: 4 },
    { date: 'Sun', score: 82, testsAttempted: 2 },
  ];

  const placementScore = stats?.placementReadiness ?? 72;
  const overallScore = stats?.overallScore ?? 78;
  const accuracy = stats?.accuracy ?? 74.5;
  const rank = stats?.rank ?? 142;
  const testsAttempted = stats?.testsAttempted ?? 8;

  const weakTopics = stats?.weakTopics || [
    { topic: 'Permutation & Combination', accuracy: 38, questionsAttempted: 24 },
    { topic: 'Time & Work', accuracy: 45, questionsAttempted: 18 },
    { topic: 'Data Interpretation', accuracy: 52, questionsAttempted: 30 },
    { topic: 'Blood Relations', accuracy: 55, questionsAttempted: 15 },
    { topic: 'Reading Comprehension', accuracy: 58, questionsAttempted: 20 },
  ];

  const companyReadiness = stats?.companyReadiness || [
    { company: 'TCS', readiness: 78 },
    { company: 'Infosys', readiness: 72 },
    { company: 'Wipro', readiness: 68 },
    { company: 'HCL', readiness: 65 },
    { company: 'Accenture', readiness: 70 },
  ];

  const recentAttempts = stats?.recentAttempts || [];
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="page-container space-y-8">
      {/* ── HEADER ROW ── */}
      <PageHeader
        title={<>Good morning, {firstName}! 👋</>}
        subtitle={
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#2563EB]" />
            {formatDate(new Date())} · Keep the streak going!
          </span>
        }
        actions={
          <>
            <Link href="/practice" className={buttonVariants({ variant: 'primary', size: 'md', className: 'rounded-xl' })}>
              <Zap size={15} fill="white" />
              Quick Practice
            </Link>
            <Link href="/mock-tests" className={buttonVariants({ variant: 'secondary', size: 'md', className: 'rounded-xl' })}>
              <FileText size={15} />
              Take Mock Test
            </Link>
          </>
        }
      />

      {/* ── STAT CARDS (4-col) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard icon={Star} label="Overall Score" value={overallScore} trend={5.2} trendLabel="vs last week" color="violet" suffix="/100" />
        <StatCard icon={FileText} label="Tests Taken" value={testsAttempted} trend={3} color="blue" />
        <StatCard icon={Target} label="Accuracy" value={`${accuracy.toFixed(1)}`} suffix="%" trend={2.1} color="green" />
        <StatCard icon={Trophy} label="Current Rank" value={`#${rank}`} trend={-12} trendLabel="positions up" color="amber" />
      </motion.div>

      {/* ── MID ROW: Placement Readiness + Weekly Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-6 flex flex-col items-center h-full">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-6 self-start">
              Placement Readiness
            </p>
            <ProgressRing
              percentage={placementScore}
              size={160}
              strokeWidth={12}
              gradientStart="#2563EB"
              gradientEnd="#7C3AED"
              label={getPlacementReadinessLabel(placementScore)}
              sublabel="Overall Score"
            />
            <div className="mt-6 w-full space-y-3">
              {companyReadiness.slice(0, 4).map(({ company, readiness }) => (
                <div key={company}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-[#6B7280]">{company}</span>
                    <span className="text-xs font-bold" style={{ color: getPlacementReadinessColor(readiness) }}>
                      {readiness}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)', opacity: 0.75 + (readiness / 400) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${readiness}%` }}
                      transition={{ duration: 1, delay: 0.35 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Weekly Progress</p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-xs text-[#6B7280] font-semibold">Score</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1.5px solid #E4E7EC',
                    borderRadius: '12px',
                    color: '#111827',
                    boxShadow: '0 4px 14px rgba(17,24,39,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: '#2563EB', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#7C3AED' }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* ── BOTTOM ROW: Weak Topics + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Weak Topics</p>
              <Link href="/analytics" className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 font-semibold transition-colors">
                View All <ChevronRight size={12} />
              </Link>
            </div>

            <div className="space-y-4 flex-1">
              {weakTopics.slice(0, 5).map(({ topic, accuracy: topicAccuracy }) => (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-[#111827] truncate flex-1 mr-2">{topic}</span>
                    <span className={cn(
                      'text-xs font-bold flex-shrink-0',
                      topicAccuracy < 50 ? 'text-[#DC2626]' : topicAccuracy < 65 ? 'text-[#D97706]' : 'text-[#059669]'
                    )}>
                      {topicAccuracy}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        topicAccuracy < 50 ? 'bg-[#DC2626]' : topicAccuracy < 65 ? 'bg-[#D97706]' : 'bg-[#059669]'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${topicAccuracy}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link href="/practice" className="mt-5 block">
              <button className={buttonVariants({ variant: 'secondary', size: 'md', className: 'w-full rounded-xl' })}>
                Practice Weak Topics →
              </button>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Recent Activity</p>
              <Link href="/mock-tests" className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 font-semibold transition-colors">
                All Tests <ChevronRight size={12} />
              </Link>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-4">
                  <FileText size={28} className="text-[#2563EB]" />
                </div>
                <p className="text-[#6B7280] text-sm font-medium mb-1">No tests taken yet.</p>
                <p className="text-[#9CA3AF] text-xs mb-5">Start your first mock test to track progress!</p>
                <Link href="/mock-tests" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                  Take First Test
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.slice(0, 5).map((attempt) => {
                  const grade = calculateGrade(attempt.percentage);
                  return (
                    <div
                      key={attempt._id}
                      className="bg-[#F9FAFB] rounded-xl p-4 flex items-center justify-between hover:bg-[#EFF6FF] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-[#2563EB]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                            {typeof attempt.test === 'object' ? attempt.test.title : 'Mock Test'}
                          </p>
                          <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">{formatDate(attempt.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#6B7280] font-medium">{formatTime(attempt.timeTaken)}</span>
                        <span className={cn('px-2.5 py-1 text-xs font-bold rounded-lg border', getScoreBgColor(attempt.percentage))}>
                          {grade}
                        </span>
                        <span className="text-sm font-black text-[#111827]">{attempt.percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── RECOMMENDED TESTS (full-width) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Recommended For You</p>
            <Link href="/mock-tests" className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 font-semibold transition-colors">
              Browse All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'TCS NQT Mock Test', company: 'TCS', duration: 210, difficulty: 'medium' as const, questions: 82, attempts: 12450 },
              { title: 'Infosys PrepInsta', company: 'Infosys', duration: 165, difficulty: 'easy' as const, questions: 60, attempts: 8320 },
              { title: 'Wipro NLTH Mock', company: 'Wipro', duration: 180, difficulty: 'medium' as const, questions: 70, attempts: 6100 },
            ].map((test) => (
              <div
                key={test.title}
                className="bg-[#F8FAFF] border border-[#E4E7EC] rounded-xl p-5 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg font-black text-[#2563EB]">{test.company}</span>
                  <DifficultyBadge difficulty={test.difficulty} size="sm" />
                </div>
                <p className="text-sm font-semibold text-[#111827] mb-3 leading-snug">{test.title}</p>
                <div className="flex items-center gap-3 text-xs text-[#6B7280] font-medium mb-4">
                  <span className="flex items-center gap-1"><Clock size={11} /> {test.duration} min</span>
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {test.questions}Q</span>
                </div>
                <Link href="/mock-tests" className="block">
                  <button className="w-full py-2 text-xs font-semibold rounded-lg text-[#2563EB] border border-[#BFDBFE] hover:bg-[#2563EB] hover:text-white group-hover:border-[#2563EB] transition-all flex items-center justify-center gap-1 cursor-pointer">
                    Start Test <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
