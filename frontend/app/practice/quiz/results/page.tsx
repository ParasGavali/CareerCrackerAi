'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { cn, formatTime } from '@/lib/utils';
import type { Question } from '@/types';
import {
  CheckCircle2, XCircle, AlertCircle, Clock,
  ArrowRight, RotateCcw, Home, Eye, Check, X
} from 'lucide-react';

interface QuizResult {
  questions: Question[];
  answers: Record<string, string>;
  timeTaken: number;
  flagged: string[];
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing quizResult:', e);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-4">
        <AlertCircle size={48} className="text-purple-500 mb-4 animate-bounce" />
        <p className="text-lg text-slate-400 mb-6">No quiz results found.</p>
        <button
          onClick={() => router.push('/practice')}
          className="btn-glow px-6 py-3 rounded-xl font-semibold text-white transition-all"
        >
          Go to Practice Section
        </button>
      </div>
    );
  }

  const { questions, answers, timeTaken } = result;

  // Calculations
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach(q => {
    const userAns = answers[q._id];
    if (!userAns) {
      unansweredCount++;
    } else if (userAns.toLowerCase() === q.correctOption?.toLowerCase() || 
               userAns.toLowerCase() === (q as any).correctAnswer?.toLowerCase()) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = questions.length;
  const score = correctCount * 10;
  const maxScore = totalQuestions * 10;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Filter questions based on filter selection
  const filteredQuestions = questions.filter(q => {
    const userAns = answers[q._id];
    const isCorrect = userAns && (userAns.toLowerCase() === q.correctOption?.toLowerCase() || userAns.toLowerCase() === (q as any).correctAnswer?.toLowerCase());
    
    if (activeFilter === 'correct') return isCorrect;
    if (activeFilter === 'wrong') return userAns && !isCorrect;
    if (activeFilter === 'unanswered') return !userAns;
    return true;
  });

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] text-white pb-16">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-purple-400 font-bold tracking-wider text-xs uppercase mb-2"
            >
              Quiz Assessment Completed
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            >
              Performance Summary
            </motion.h1>
          </div>

          {/* Results Summary Scorecard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Accuracy Circular Meter Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center col-span-1 border-white/5"
            >
              <h3 className="text-slate-400 text-sm font-semibold mb-4">Overall Accuracy</h3>
              <ProgressRing
                percentage={accuracy}
                size={140}
                strokeWidth={10}
                color={accuracy >= 70 ? 'var(--accent-green)' : accuracy >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)'}
                label={`${accuracy}%`}
              />
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {accuracy >= 70 ? 'Excellent job! You have a solid grasp on this.' : accuracy >= 40 ? 'Good effort, but there is room for improvement.' : 'We suggest reviewing these topics before proceeding.'}
              </p>
            </motion.div>

            {/* Score & Time Cards */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Score Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-5 flex flex-col justify-between border-white/5"
                >
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Score</p>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-none mt-4">
                      {score} <span className="text-lg font-medium text-slate-500">/ {maxScore}</span>
                    </h2>
                    <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      +10 points per correct answer
                    </p>
                  </div>
                </motion.div>

                {/* Time Taken Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="glass-card p-5 flex flex-col justify-between border-white/5"
                >
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Time Taken</p>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-none mt-4 flex items-center gap-2">
                      <Clock size={28} className="text-purple-400" />
                      {formatTime(timeTaken)}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2">
                      Average of {totalQuestions > 0 ? Math.round(timeTaken / totalQuestions) : 0}s per question
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Stats Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5 grid grid-cols-3 divide-x divide-white/5 border-white/5"
              >
                <div className="text-center px-2">
                  <span className="text-emerald-400 text-2xl font-black">{correctCount}</span>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Correct</p>
                </div>
                <div className="text-center px-2">
                  <span className="text-red-400 text-2xl font-black">{wrongCount}</span>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Incorrect</p>
                </div>
                <div className="text-center px-2">
                  <span className="text-slate-400 text-2xl font-black">{unansweredCount}</span>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Unanswered</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => router.push('/practice')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-semibold text-sm hover:bg-purple-600/20 hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Practice Another Topic
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:border-white/20 hover:text-white transition-all cursor-pointer"
            >
              <Home size={16} />
              Go to Dashboard
            </button>
          </div>

          {/* Detailed Question Review Header & Filters */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye size={20} className="text-purple-400" />
              Question-by-Question Review
            </h2>
            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
              {[
                { id: 'all', label: `All Questions (${totalQuestions})` },
                { id: 'correct', label: `Correct (${correctCount})`, activeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' },
                { id: 'wrong', label: `Incorrect (${wrongCount})`, activeColor: 'bg-red-500/15 border-red-500/40 text-red-400' },
                { id: 'unanswered', label: `Unanswered (${unansweredCount})`, activeColor: 'bg-slate-800 border-white/20 text-slate-300' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                    activeFilter === tab.id
                      ? tab.activeColor || 'bg-purple-600/15 border-purple-500/40 text-purple-300'
                      : 'border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of reviewed questions */}
          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 glass-card border-white/5">
                <p className="text-slate-500 text-sm">No questions match the selected filter.</p>
              </div>
            ) : (
              filteredQuestions.map((q, qIndex) => {
                const userAns = answers[q._id];
                const correctAns = q.correctOption || (q as any).correctAnswer;
                const isCorrect = userAns && userAns.toLowerCase() === correctAns.toLowerCase();

                return (
                  <motion.div
                    key={q._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'glass-card p-6 border transition-all',
                      !userAns
                        ? 'border-slate-800 bg-slate-900/10'
                        : isCorrect
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-red-500/20 bg-red-500/5'
                    )}
                  >
                    {/* Category & Status Indicator Tag */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">
                        {q.category} • {q.subcategory}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!userAns ? (
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <AlertCircle size={14} /> Unanswered
                          </span>
                        ) : isCorrect ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Correct
                          </span>
                        ) : (
                          <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                            <XCircle size={14} /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-white font-medium text-base mb-4 leading-relaxed">
                      <span className="text-purple-400 font-bold mr-1">Q{qIndex + 1}.</span> {q.questionText}
                    </h3>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt, optIndex) => {
                        const optLetter = getOptionLabel(optIndex).toLowerCase();
                        const isUserSelected = userAns && userAns.toLowerCase() === optLetter;
                        const isCorrectOption = correctAns && correctAns.toLowerCase() === optLetter;

                        return (
                          <div
                            key={opt.id || optLetter}
                            className={cn(
                              'p-3.5 rounded-xl border text-sm flex items-center gap-3 transition-all',
                              isCorrectOption
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium'
                                : isUserSelected
                                ? 'bg-red-500/15 border-red-500/40 text-red-300 font-medium'
                                : 'bg-slate-900/40 border-white/5 text-slate-400'
                            )}
                          >
                            <span
                              className={cn(
                                'w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center',
                                isCorrectOption
                                  ? 'bg-emerald-500 text-white'
                                  : isUserSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-slate-800 text-slate-500 border border-white/5'
                              )}
                            >
                              {getOptionLabel(optIndex)}
                            </span>
                            <span className="flex-1 leading-snug">{opt.text}</span>
                            {isCorrectOption && <Check size={16} className="text-emerald-400 shrink-0" />}
                            {isUserSelected && !isCorrect && <X size={16} className="text-red-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Question Explanation Card */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 mt-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-400" />
                        Correct Answer Explanation
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        {q.explanation || 'No explanation provided.'}
                      </p>
                      {q.shortcutTrick && (
                        <div className="border-t border-white/5 pt-2.5 mt-2 text-xs text-purple-300 flex items-start gap-1.5 leading-relaxed">
                          <span className="font-extrabold text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded shrink-0">
                            TRICK
                          </span>
                          <span>
                            <strong>Shortcut:</strong> {q.shortcutTrick}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
