'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import {
  BookOpen, Calculator, Brain, MessageSquare, Shuffle, Clock, ChevronRight,
  TrendingUp, Zap, Target, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'quantitative',
    label: 'Quantitative Aptitude',
    icon: Calculator,
    color: '#004ac6',
    borderColor: 'border-primary/20 hover:border-primary/50',
    description: 'Number systems, percentages, profit & loss, time & work, speed & distance, and more.',
    questionCount: 4200,
    topics: 18,
    userAccuracy: 74,
    slug: 'quantitative',
  },
  {
    id: 'logical',
    label: 'Logical Reasoning',
    icon: Brain,
    color: '#712ae2',
    borderColor: 'border-secondary/20 hover:border-secondary/50',
    description: 'Series completion, analogies, blood relations, coding-decoding, puzzles, and arrangements.',
    questionCount: 3800,
    topics: 14,
    userAccuracy: 68,
    slug: 'logical',
  },
  {
    id: 'verbal',
    label: 'Verbal Ability',
    icon: MessageSquare,
    color: '#004ac6',
    borderColor: 'border-primary/20 hover:border-primary/50',
    description: 'Reading comprehension, vocabulary, grammar, sentence completion, and verbal reasoning.',
    questionCount: 2100,
    topics: 10,
    userAccuracy: 82,
    slug: 'verbal',
  },
];

const quickPracticeOptions = [
  { label: 'Quick 10 Questions', count: 10, icon: Zap, time: '~5 min' },
  { label: 'Standard 25 Questions', count: 25, icon: Target, time: '~15 min' },
  { label: 'Full 50 Questions', count: 50, icon: BookOpen, time: '~30 min' },
];

const recentHistory = [
  { topic: 'Percentages', category: 'Quantitative Aptitude', score: 8, total: 10, date: '2 hours ago', difficulty: 'medium' as const },
  { topic: 'Blood Relations', category: 'Logical Reasoning', score: 6, total: 10, date: 'Yesterday', difficulty: 'hard' as const },
  { topic: 'Reading Comprehension', category: 'Verbal Ability', score: 9, total: 10, date: '2 days ago', difficulty: 'easy' as const },
];

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const { icon: Icon, label, color, borderColor, description, questionCount, topics, userAccuracy, slug } = category;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn('bg-surface-container-lowest p-6 border rounded-xl ambient-shadow relative overflow-hidden cursor-pointer', borderColor)}
    >
      <Link href={`/practice/${slug}`}>
        <div className="relative z-10">
          {/* Icon & accuracy */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `${color}10`, border: `2px solid ${color}20` }}
            >
              <Icon size={28} style={{ color }} />
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant mb-1 font-semibold">Your Accuracy</p>
              <p className="text-2xl font-black" style={{ color }}>{userAccuracy}%</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-on-surface mb-2">{label}</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-5">{description}</p>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
              <BookOpen size={13} className="text-outline" />
              <span className="text-xs">{questionCount.toLocaleString()} questions</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
              <Target size={13} className="text-outline" />
              <span className="text-xs">{topics} topics</span>
            </div>
          </div>

          {/* Accuracy bar */}
          <div>
            <div className="h-1.5 bg-surface-container rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${userAccuracy}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-semibold">
                {userAccuracy < 70 ? '⚠️ Needs practice' : userAccuracy < 85 ? '✅ Good progress' : '🔥 Excellent!'}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold hover:underline" style={{ color }}>
                Practice Now <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PracticeContent() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickCount, setQuickCount] = useState(10);

  return (
    <div className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto bg-surface">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-on-surface mb-2">Aptitude Practice 📚</h1>
        <p className="text-on-surface-variant font-medium">Sharpen your skills with topic-wise practice questions</p>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CategoryCard category={cat} />
          </motion.div>
        ))}
      </div>

      {/* Filters & Quick Practice Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Practice */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 ambient-shadow"
        >
          <h3 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <Shuffle size={18} className="text-primary" />
            Quick Practice
          </h3>
          <p className="text-on-surface-variant text-sm mb-4 font-medium">Jump into a quick practice session with random questions</p>

          <div className="space-y-2 mb-5">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-on-surface-variant font-semibold mb-1 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="quantitative">Quantitative</option>
                  <option value="logical">Logical Reasoning</option>
                  <option value="verbal">Verbal Ability</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-on-surface-variant font-semibold mb-1 block">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {quickPracticeOptions.map(opt => (
              <button
                key={opt.count}
                onClick={() => setQuickCount(opt.count)}
                className={cn(
                  'p-3 rounded-xl border text-center transition-all cursor-pointer',
                  quickCount === opt.count
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                    : 'border-outline-variant/60 text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 font-semibold'
                )}
              >
                <opt.icon size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold block">{opt.count}Q</span>
                <span className="text-xs text-on-surface-variant font-medium">{opt.time}</span>
              </button>
            ))}
          </div>

          <Link href={`/practice/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}&count=${quickCount}`}>
            <motion.button
              className="btn-glow w-full py-3 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap size={16} fill="white" />
              Start Quick Practice
            </motion.button>
          </Link>
        </motion.div>

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 ambient-shadow"
        >
          <h3 className="font-bold text-on-surface mb-5 flex items-center gap-2">
            <Clock size={18} className="text-secondary" />
            Recent Practice
          </h3>
          <div className="space-y-3">
            {recentHistory.map((item) => (
              <div key={item.topic} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/30 group hover:border-primary/30 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{item.topic}</p>
                  <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{item.category} · {item.date}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <DifficultyBadge difficulty={item.difficulty} size="sm" />
                  <span className={cn(
                    'text-sm font-black',
                    item.score / item.total >= 0.8 ? 'text-emerald-600' : item.score / item.total >= 0.6 ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {item.score}/{item.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/analytics">
            <button className="mt-4 w-full py-2.5 text-xs font-semibold rounded-xl text-primary border border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-1 cursor-pointer">
              <TrendingUp size={13} />
              View Full History
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex-1 ml-[260px]">
          <PracticeContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
