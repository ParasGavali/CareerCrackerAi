'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/components/providers/AuthProvider';
import { analyticsApi } from '@/lib/api';
import {
  formatDate, formatTime, calculateGrade, getScoreBgColor,
  getPlacementReadinessLabel, getPlacementReadinessColor, cn
} from '@/lib/utils';
import type { DashboardStats } from '@/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Trophy, Target, CheckCircle, TrendingUp, TrendingDown,
  BookOpen, Clock, ArrowRight, Zap, Star, ChevronRight,
  FileText, BarChart3, Calendar
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getDashboard()
      .then(res => setStats(res.data.data || null))
      .catch(() => {
        // Use mock data if API not ready
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  // Mock data if API not ready
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 md:p-8 max-w-7xl space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(new Date())} · Keep the streak going!
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/practice">
              <motion.button
                className="btn-glow px-5 py-2.5 text-sm font-semibold rounded-xl text-white flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={16} fill="white" />
                Quick Practice
              </motion.button>
            </Link>
            <Link href="/mock-tests">
              <button className="px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-2">
                <FileText size={16} />
                Take Mock Test
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Star}
            label="Overall Score"
            value={overallScore}
            trend={5.2}
            trendLabel="vs last week"
            color="purple"
            suffix="/100"
          />
          <StatCard
            icon={FileText}
            label="Tests Taken"
            value={testsAttempted}
            trend={3}
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={`${accuracy.toFixed(1)}`}
            suffix="%"
            trend={2.1}
            color="green"
          />
          <StatCard
            icon={Trophy}
            label="Current Rank"
            value={`#${rank}`}
            trend={-12}
            trendLabel="positions up"
            color="orange"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Placement Readiness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col items-center"
          >
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
              Placement Readiness
            </h3>
            <ProgressRing
              percentage={placementScore}
              size={160}
              strokeWidth={12}
              gradientStart="#7c3aed"
              gradientEnd="#10b981"
              label={getPlacementReadinessLabel(placementScore)}
              sublabel="Overall Score"
            />
            <div className="mt-6 w-full space-y-3">
              {companyReadiness.slice(0, 4).map(({ company, readiness }) => (
                <div key={company}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">{company}</span>
                    <span style={{ color: getPlacementReadinessColor(readiness) }} className="font-semibold">
                      {readiness}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${getPlacementReadinessColor(readiness)}, ${getPlacementReadinessColor(readiness)}99)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${readiness}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Weekly Progress</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-400">Score</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,30,58,0.6)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18,18,31,0.95)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: '#7c3aed', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#a78bfa' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weak Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Weak Topics</h3>
              <Link href="/analytics" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-4">
              {weakTopics.slice(0, 5).map(({ topic, accuracy: topicAccuracy }) => (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-300 truncate flex-1 mr-2">{topic}</span>
                    <span className={cn(
                      'text-xs font-semibold flex-shrink-0',
                      topicAccuracy < 50 ? 'text-red-400' : topicAccuracy < 65 ? 'text-yellow-400' : 'text-emerald-400'
                    )}>
                      {topicAccuracy}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        topicAccuracy < 50 ? 'bg-red-500' : topicAccuracy < 65 ? 'bg-yellow-500' : 'bg-emerald-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${topicAccuracy}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/practice">
              <button className="mt-5 w-full py-2.5 text-xs font-semibold rounded-xl text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-all">
                Practice Weak Topics →
              </button>
            </Link>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
              <Link href="/mock-tests" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                All Tests <ChevronRight size={12} />
              </Link>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-purple-400" />
                </div>
                <p className="text-slate-400 text-sm mb-4">No tests taken yet. Start your first mock test!</p>
                <Link href="/mock-tests">
                  <button className="btn-glow px-5 py-2.5 text-sm font-semibold rounded-xl text-white">
                    Take First Test
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.slice(0, 5).map((attempt) => {
                  const grade = calculateGrade(attempt.percentage);
                  return (
                    <div key={attempt._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-purple-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                          <FileText size={16} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {typeof attempt.test === 'object' ? attempt.test.title : 'Mock Test'}
                          </p>
                          <p className="text-xs text-slate-500">{formatDate(attempt.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-300">{formatTime(attempt.timeTaken)}</span>
                        <span className={cn('px-2.5 py-1 text-xs font-bold rounded-lg border', getScoreBgColor(attempt.percentage))}>
                          {grade}
                        </span>
                        <span className="text-sm font-bold text-white">{attempt.percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recommended Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recommended For You</h3>
            <Link href="/mock-tests" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Browse All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'TCS NQT Mock Test', company: 'TCS', duration: 210, difficulty: 'medium' as const, questions: 82, attempts: 12450 },
              { title: 'Infosys PrepInsta', company: 'Infosys', duration: 165, difficulty: 'easy' as const, questions: 60, attempts: 8320 },
              { title: 'Wipro NLTH Mock', company: 'Wipro', duration: 180, difficulty: 'medium' as const, questions: 70, attempts: 6100 },
            ].map((test) => (
              <div key={test.title} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-purple-500/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xl font-black text-white">{test.company}</span>
                    <p className="text-sm text-slate-300 font-medium mt-0.5">{test.title}</p>
                  </div>
                  <DifficultyBadge difficulty={test.difficulty} size="sm" />
                </div>
                <div className="flex gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={10} />{test.duration}min</span>
                  <span className="flex items-center gap-1"><BookOpen size={10} />{test.questions}Q</span>
                </div>
                <Link href="/mock-tests">
                  <button className="w-full py-2 text-xs font-semibold rounded-lg text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 group-hover:border-purple-500/50 transition-all flex items-center justify-center gap-1">
                    Start Test <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
        <Sidebar />
        <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
          <DashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
