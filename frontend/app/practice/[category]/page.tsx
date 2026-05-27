'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { ArrowLeft, BookOpen, Target, ChevronRight, Zap } from 'lucide-react';
import { cn, slugToTitle } from '@/lib/utils';

const categoryTopics: Record<string, {
  id: string; name: string; description: string; questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard'; accuracy?: number;
}[]> = {
  quantitative: [
    { id: 'number-systems', name: 'Number Systems', description: 'LCM, HCF, factors, divisibility rules', questionCount: 280, difficulty: 'easy', accuracy: 82 },
    { id: 'percentages', name: 'Percentages', description: 'Percentage calculations, increase/decrease', questionCount: 320, difficulty: 'easy', accuracy: 78 },
    { id: 'profit-loss', name: 'Profit & Loss', description: 'Cost price, selling price, discount, profit%', questionCount: 290, difficulty: 'medium', accuracy: 71 },
    { id: 'time-work', name: 'Time & Work', description: 'Work rate, pipes & cisterns, efficiency', questionCount: 260, difficulty: 'medium', accuracy: 58 },
    { id: 'speed-distance', name: 'Speed, Distance & Time', description: 'Relative speed, average speed, trains, boats', questionCount: 310, difficulty: 'medium', accuracy: 65 },
    { id: 'permutation-combination', name: 'Permutation & Combination', description: 'P&C formulae, arrangements, selections', questionCount: 200, difficulty: 'hard', accuracy: 42 },
    { id: 'probability', name: 'Probability', description: 'Basic probability, compound events', questionCount: 180, difficulty: 'hard', accuracy: 48 },
    { id: 'data-interpretation', name: 'Data Interpretation', description: 'Tables, bar graphs, pie charts, line charts', questionCount: 350, difficulty: 'medium', accuracy: 55 },
    { id: 'averages', name: 'Averages & Mean', description: 'Simple average, weighted average, mean/median/mode', questionCount: 240, difficulty: 'easy', accuracy: 88 },
    { id: 'ratio-proportion', name: 'Ratio & Proportion', description: 'Ratios, mixtures, alligation', questionCount: 270, difficulty: 'medium', accuracy: 72 },
  ],
  logical: [
    { id: 'series', name: 'Number & Letter Series', description: 'Number patterns, letter sequences, mixed series', questionCount: 310, difficulty: 'medium', accuracy: 74 },
    { id: 'analogies', name: 'Analogies', description: 'Verbal and non-verbal analogies', questionCount: 280, difficulty: 'easy', accuracy: 80 },
    { id: 'blood-relations', name: 'Blood Relations', description: 'Family tree, relationship problems', questionCount: 200, difficulty: 'medium', accuracy: 62 },
    { id: 'coding-decoding', name: 'Coding-Decoding', description: 'Letter substitution, number coding', questionCount: 260, difficulty: 'medium', accuracy: 68 },
    { id: 'direction-sense', name: 'Direction & Distance', description: 'Direction problems, displacement, shadow-based', questionCount: 180, difficulty: 'easy', accuracy: 85 },
    { id: 'syllogisms', name: 'Syllogisms', description: 'Logical deductions, Venn diagram statements', questionCount: 240, difficulty: 'hard', accuracy: 55 },
    { id: 'seating-arrangement', name: 'Seating Arrangement', description: 'Linear and circular arrangements', questionCount: 220, difficulty: 'hard', accuracy: 52 },
    { id: 'puzzles', name: 'Puzzles & Cubes', description: 'Logical puzzles, cube and dice problems', questionCount: 190, difficulty: 'hard', accuracy: 48 },
  ],
  verbal: [
    { id: 'reading-comprehension', name: 'Reading Comprehension', description: 'Passages, inference, tone, main idea', questionCount: 400, difficulty: 'medium', accuracy: 75 },
    { id: 'vocabulary', name: 'Vocabulary', description: 'Synonyms, antonyms, contextual usage', questionCount: 320, difficulty: 'easy', accuracy: 82 },
    { id: 'grammar', name: 'Grammar & Sentence Correction', description: 'Tenses, subject-verb agreement, error spotting', questionCount: 290, difficulty: 'medium', accuracy: 78 },
    { id: 'sentence-completion', name: 'Sentence Completion', description: 'Fill in the blanks, cloze test', questionCount: 240, difficulty: 'easy', accuracy: 88 },
    { id: 'para-jumbles', name: 'Para Jumbles', description: 'Rearranging sentences, paragraph ordering', questionCount: 180, difficulty: 'hard', accuracy: 58 },
  ],
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const topics = categoryTopics[category] || [];
  const filteredTopics = selectedDifficulty === 'all'
    ? topics
    : topics.filter(t => t.difficulty === selectedDifficulty);

  const categoryTitle = {
    quantitative: 'Quantitative Aptitude',
    logical: 'Logical Reasoning',
    verbal: 'Verbal Ability',
  }[category] || slugToTitle(category);

  const categoryColor = {
    quantitative: '#004ac6',
    logical: '#712ae2',
    verbal: '#004ac6',
  }[category] || '#004ac6';

  const totalQuestions = topics.reduce((sum, t) => sum + t.questionCount, 0);
  const avgAccuracy = topics.reduce((sum, t) => sum + (t.accuracy || 0), 0) / topics.length;

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex-1 ml-[260px] overflow-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto">
            {/* Back */}
            <Link href="/practice" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 transition-colors text-sm font-semibold">
              <ArrowLeft size={16} />
              Back to Practice
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 mb-8 relative overflow-hidden ambient-shadow"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-on-surface mb-2">{categoryTitle}</h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium">
                        <BookOpen size={14} className="text-outline" />
                        {totalQuestions.toLocaleString()} Questions
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium">
                        <Target size={14} className="text-outline" />
                        {topics.length} Topics
                      </span>
                      <span className="text-sm font-bold" style={{ color: categoryColor }}>
                        Your Avg: {avgAccuracy.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Link href={`/practice/quiz?category=${category}&count=25`} className="shrink-0">
                    <motion.button
                      className="btn-glow px-5 py-2.5 text-sm font-semibold rounded-xl text-white flex items-center gap-2 cursor-pointer shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap size={16} fill="white" />
                      Practice All
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Difficulty Filter */}
            <div className="flex gap-2 mb-6">
              {['all', 'easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-bold transition-all border cursor-pointer',
                    selectedDifficulty === d
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-primary/5 font-semibold'
                  )}
                >
                  {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Link href={`/practice/quiz?category=${category}&subcategory=${topic.id}&count=15`}>
                    <div className="bg-surface-container-lowest p-5 border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low/50 transition-all cursor-pointer group rounded-xl ambient-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                            {topic.name}
                          </h3>
                          <p className="text-on-surface-variant text-xs font-semibold mt-1 leading-relaxed">{topic.description}</p>
                        </div>
                        <DifficultyBadge difficulty={topic.difficulty} size="sm" className="ml-3 flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                          <BookOpen size={11} className="text-outline" />
                          {topic.questionCount} questions
                        </span>
                        {topic.accuracy !== undefined && (
                          <span className={cn(
                            'text-xs font-bold',
                            topic.accuracy >= 75 ? 'text-emerald-600' : topic.accuracy >= 55 ? 'text-amber-600' : 'text-red-600'
                          )}>
                            Your accuracy: {topic.accuracy}%
                          </span>
                        )}
                      </div>

                      {/* Accuracy bar */}
                      {topic.accuracy !== undefined && (
                        <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              topic.accuracy >= 75 ? 'bg-emerald-500' : topic.accuracy >= 55 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${topic.accuracy}%` }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-end mt-3 border-t border-outline-variant/10 pt-3">
                        <span className="text-xs text-primary group-hover:text-secondary flex items-center gap-1 font-bold">
                          Practice <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
