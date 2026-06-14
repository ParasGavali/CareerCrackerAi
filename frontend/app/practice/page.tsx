'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import {
  BookOpen,
  Calculator,
  Brain,
  MessageSquare,
  Zap,
  Target,
  Clock,
  TrendingUp,
  ArrowRight,
  Hash,
  CheckCircle2,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: 'quantitative',
    label: 'Quantitative Aptitude',
    icon: Calculator,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    description:
      'Number systems, percentages, profit & loss, time & work, speed & distance, and more.',
    questionCount: 4200,
    topics: 18,
    userAccuracy: 74,
    slug: 'quantitative',
  },
  {
    id: 'logical',
    label: 'Logical Reasoning',
    icon: Brain,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    description:
      'Series completion, analogies, blood relations, coding-decoding, puzzles, and arrangements.',
    questionCount: 3800,
    topics: 14,
    userAccuracy: 68,
    slug: 'logical',
  },
  {
    id: 'verbal',
    label: 'Verbal Ability',
    icon: MessageSquare,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    description:
      'Reading comprehension, vocabulary, grammar, sentence completion, and verbal reasoning.',
    questionCount: 2100,
    topics: 10,
    userAccuracy: 82,
    slug: 'verbal',
  },
];

const quickPracticeOptions = [
  { count: 10, icon: Zap, time: '~5 min' },
  { count: 25, icon: Target, time: '~15 min' },
  { count: 50, icon: BookOpen, time: '~30 min' },
];

const recentHistory = [
  {
    topic: 'Percentages',
    category: 'Quantitative Aptitude',
    score: 8,
    total: 10,
    date: '2 hours ago',
    difficulty: 'medium' as const,
  },
  {
    topic: 'Blood Relations',
    category: 'Logical Reasoning',
    score: 6,
    total: 10,
    date: 'Yesterday',
    difficulty: 'hard' as const,
  },
  {
    topic: 'Reading Comprehension',
    category: 'Verbal Ability',
    score: 9,
    total: 10,
    date: '2 days ago',
    difficulty: 'easy' as const,
  },
];

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  const {
    icon: Icon,
    label,
    color,
    bgColor,
    description,
    questionCount,
    topics,
    userAccuracy,
    slug,
  } = category;

  const statusLabel =
    userAccuracy < 70
      ? '⚠️ Needs practice'
      : userAccuracy < 85
      ? '✅ Good progress'
      : '🔥 Excellent!';

  return (
    <Link href={`/practice/${slug}`}>
      <div
        className="bg-white border border-[#E4E7EC] rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:border-[#93C5FD] hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
        style={{ minHeight: 300 }}
      >
        {/* Icon box */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        {/* Title & description */}
        <h3 className="text-lg font-bold text-[#111827] mt-5 mb-1">{label}</h3>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-5">{description}</p>

        {/* Stats row */}
        <div className="flex items-center gap-5 mb-5">
          <div className="flex items-center gap-1.5">
            <Hash size={13} className="text-[#9CA3AF]" />
            <span className="text-xs text-[#6B7280] font-medium">
              {questionCount.toLocaleString()} questions
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-[#9CA3AF]" />
            <span className="text-xs text-[#6B7280] font-medium">{topics} topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-[#9CA3AF]" />
            <span className="text-xs text-[#6B7280] font-medium">{userAccuracy}% accuracy</span>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${userAccuracy}%`,
              background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            }}
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6B7280] font-medium">{statusLabel}</span>
          <span
            className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color }}
          >
            Start Practice <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function PracticeContent() {
  const [quickCount, setQuickCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  return (
    <div className="flex-1 ml-[260px] overflow-auto">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#111827]">Practice Hub</h1>
            <p className="text-sm text-[#6B7280] mt-1">Choose your topic and start practicing</p>
          </div>
          <Link href="/practice/quiz?category=all&difficulty=all&count=25">
            <button className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              <Zap size={15} />
              Quick Practice
            </button>
          </Link>
        </div>

        {/* ── Quick Practice Card ──────────────────────────────────────────── */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-[#2563EB]" />
            <h2 className="text-base font-bold text-[#111827]">Quick Practice Session</h2>
          </div>
          <p className="text-sm text-[#6B7280] mb-5">
            Jump in instantly with randomised questions across categories and difficulty levels.
          </p>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#6B7280]">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#F8FAFF] border border-[#E4E7EC] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="quantitative">Quantitative</option>
                <option value="logical">Logical Reasoning</option>
                <option value="verbal">Verbal Ability</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#6B7280]">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-[#F8FAFF] border border-[#E4E7EC] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Count selector */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {quickPracticeOptions.map((opt) => {
              const Ico = opt.icon;
              const isActive = quickCount === opt.count;
              return (
                <button
                  key={opt.count}
                  onClick={() => setQuickCount(opt.count)}
                  className={`border rounded-xl p-4 flex flex-col items-center gap-1 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'border-[#2563EB] bg-[#EFF6FF]'
                      : 'border-[#E4E7EC] hover:border-[#2563EB] hover:bg-[#EFF6FF]'
                  }`}
                >
                  <Ico
                    size={20}
                    className={isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}
                  />
                  <span
                    className={`text-lg font-black leading-none ${
                      isActive ? 'text-[#2563EB]' : 'text-[#111827]'
                    }`}
                  >
                    {opt.count}
                  </span>
                  <span className="text-xs text-[#6B7280] font-medium">{opt.time}</span>
                </button>
              );
            })}
          </div>

          <Link
            href={`/practice/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}&count=${quickCount}`}
          >
            <button className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
              <Zap size={15} />
              Start Practice
            </button>
          </Link>
        </div>

        {/* ── Topics Section ───────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-[#111827] mb-5">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>

        {/* ── Recent History ───────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#111827]">Recent History</h2>
            <Link href="/analytics">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                <TrendingUp size={13} />
                View All
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentHistory.map((item) => {
              const ratio = item.score / item.total;
              const scoreColor =
                ratio >= 0.8 ? '#059669' : ratio >= 0.6 ? '#D97706' : '#DC2626';

              return (
                <div
                  key={item.topic}
                  className="bg-white border border-[#E4E7EC] rounded-xl p-5 flex items-center justify-between hover:border-[#BFDBFE] transition-all duration-150"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{item.topic}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{item.category}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4">
                    <DifficultyBadge difficulty={item.difficulty} size="sm" />
                    <div className="text-right">
                      <p
                        className="text-sm font-black"
                        style={{ color: scoreColor }}
                      >
                        {item.score}/{item.total}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{item.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFF]">
        <Sidebar />
        <PracticeContent />
      </div>
    </ProtectedRoute>
  );
}
