'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Button } from '@/components/ui/Button';
import { cn, formatTime } from '@/lib/utils';
import type { Question } from '@/types';
import {
  CheckCircle2, XCircle, AlertCircle, Clock,
  Home, RotateCcw, Eye, Check, X
} from 'lucide-react';

interface QuizResult {
  questions: Question[];
  answers: Record<string, string>;
  timeTaken: number;
  flagged: string[];
}

function isCorrectAnswer(q: Question, userAns: string | undefined): boolean {
  if (!userAns) return false;
  const legacy = q as Question & { correctAnswer?: string };
  const expected = q.correctOption || legacy.correctAnswer;
  return expected !== undefined && userAns.toLowerCase() === expected.toLowerCase();
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing quizResult:', e);
      }
    }
  }, []);

  if (!result) {
    return (
      <AppShell variant="focus">
        <div className="min-h-screen flex flex-col items-center justify-center text-[#111827] p-4">
          <AlertCircle size={48} className="text-[#2563EB] mb-4 animate-bounce" />
          <p className="text-lg text-[#6B7280] font-semibold mb-6">No quiz results found.</p>
          <Button variant="primary" size="md" onClick={() => router.push('/practice')}>
            Go to Practice Section
          </Button>
        </div>
      </AppShell>
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
    } else if (isCorrectAnswer(q, userAns)) {
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
    const isCorrect = isCorrectAnswer(q, userAns);
    
    if (activeFilter === 'correct') return isCorrect;
    if (activeFilter === 'wrong') return userAns && !isCorrect;
    if (activeFilter === 'unanswered') return !userAns;
    return true;
  });

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <AppShell variant="focus">
      <div className="min-h-screen bg-[#F8FAFF] text-[#111827] pb-16 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#2563EB] font-bold tracking-wider text-xs uppercase mb-2"
            >
              Quiz Assessment Completed
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight"
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
              className="bg-white p-6 flex flex-col items-center justify-center text-center col-span-1 border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]"
            >
              <h3 className="text-[#6B7280] text-sm font-semibold mb-4">Overall Accuracy</h3>
              <ProgressRing
                percentage={accuracy}
                size={140}
                strokeWidth={10}
                gradientStart="#2563EB"
                gradientEnd="#7C3AED"
                label={`${accuracy}%`}
              />
              <p className="text-xs text-[#6B7280] font-semibold mt-4 leading-relaxed">
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
                  className="bg-white p-5 flex flex-col justify-between border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]"
                >
                  <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Total Score</p>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#111827] leading-none mt-4">
                      {score} <span className="text-lg font-semibold text-[#6B7280]">/ {maxScore}</span>
                    </h2>
                    <p className="text-xs text-[#059669] font-bold mt-2 flex items-center gap-1">
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
                  className="bg-white p-5 flex flex-col justify-between border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]"
                >
                  <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Time Taken</p>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#111827] leading-none mt-4 flex items-center gap-2">
                      <Clock size={28} className="text-[#2563EB]" />
                      {formatTime(timeTaken)}
                    </h2>
                    <p className="text-xs text-[#6B7280] font-semibold mt-2">
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
                className="bg-white p-5 grid grid-cols-3 divide-x divide-[#E4E7EC] border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]"
              >
                <div className="text-center px-2">
                  <span className="text-[#059669] text-2xl font-black">{correctCount}</span>
                  <p className="text-xs text-[#6B7280] font-semibold mt-1">Correct</p>
                </div>
                <div className="text-center px-2">
                  <span className="text-[#DC2626] text-2xl font-black">{wrongCount}</span>
                  <p className="text-xs text-[#6B7280] font-semibold mt-1">Incorrect</p>
                </div>
                <div className="text-center px-2">
                  <span className="text-[#6B7280] text-2xl font-black">{unansweredCount}</span>
                  <p className="text-xs text-[#6B7280] font-semibold mt-1">Unanswered</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push('/practice')}
            >
              <RotateCcw size={16} />
              Practice Another Topic
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/dashboard')}
            >
              <Home size={16} />
              Go to Dashboard
            </Button>
          </div>

          {/* Detailed Question Review Header & Filters */}
          <div className="mb-8 border-b border-[#E4E7EC] pb-4">
            <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
              <Eye size={20} className="text-[#2563EB]" />
              Question-by-Question Review
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: `All Questions (${totalQuestions})` },
                { id: 'correct', label: `Correct (${correctCount})`, activeColor: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857] font-bold' },
                { id: 'wrong', label: `Incorrect (${wrongCount})`, activeColor: 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] font-bold' },
                { id: 'unanswered', label: `Unanswered (${unansweredCount})`, activeColor: 'bg-white border-[#E4E7EC] text-[#6B7280] font-bold' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm',
                    activeFilter === tab.id
                      ? tab.activeColor || 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-bold'
                      : 'border-[#E4E7EC] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB] bg-white'
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
              <div className="text-center py-12 bg-white border border-[#E4E7EC] rounded-2xl shadow-sm">
                <p className="text-[#6B7280] font-semibold text-sm">No questions match the selected filter.</p>
              </div>
            ) : (
              filteredQuestions.map((q, qIndex) => {
                const userAns = answers[q._id];
                const correctAns = q.correctOption || (q as Question & { correctAnswer?: string }).correctAnswer;
                const isCorrect = userAns !== undefined && correctAns !== undefined && userAns.toLowerCase() === correctAns.toLowerCase();

                return (
                  <motion.div
                    key={q._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'p-6 border transition-all rounded-2xl shadow-sm',
                      !userAns
                        ? 'border-[#E4E7EC] bg-[#F9FAFB]/60'
                        : isCorrect
                        ? 'border-[#A7F3D0] bg-[#ECFDF5]/50'
                        : 'border-[#FECACA] bg-[#FEF2F2]/50'
                    )}
                  >
                    {/* Category & Status Indicator Tag */}
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] bg-white border border-[#E4E7EC] px-2.5 py-1 rounded-md">
                        {q.category} • {q.subcategory}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!userAns ? (
                          <span className="text-xs text-[#6B7280] font-bold flex items-center gap-1">
                            <AlertCircle size={14} /> Unanswered
                          </span>
                        ) : isCorrect ? (
                          <span className="text-xs text-[#059669] font-extrabold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Correct
                          </span>
                        ) : (
                          <span className="text-xs text-[#DC2626] font-extrabold flex items-center gap-1">
                            <XCircle size={14} /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-[#111827] font-semibold text-base mb-4 leading-relaxed">
                      <span className="text-[#2563EB] font-black mr-1">Q{qIndex + 1}.</span> {q.questionText}
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
                              'p-3.5 rounded-xl border-[1.5px] text-sm flex items-center gap-3 transition-all font-medium',
                              isCorrectOption
                                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857] font-bold shadow-sm'
                                : isUserSelected
                                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] font-bold shadow-sm'
                                : 'bg-white border-[#E4E7EC] text-[#6B7280]'
                            )}
                          >
                            <span
                              className={cn(
                                'w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0',
                                isCorrectOption
                                  ? 'bg-[#059669] text-white'
                                  : isUserSelected
                                  ? 'bg-[#DC2626] text-white'
                                  : 'bg-white border border-[#E4E7EC] text-[#6B7280]'
                              )}
                            >
                              {getOptionLabel(optIndex)}
                            </span>
                            <span className="flex-1 leading-snug">{opt.text}</span>
                            {isCorrectOption && <Check size={16} className="text-[#059669] shrink-0" />}
                            {isUserSelected && !isCorrect && <X size={16} className="text-[#DC2626] shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Question Explanation Card */}
                    <div className="p-4 rounded-xl bg-white border border-[#E4E7EC] mt-4">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-[#2563EB]" />
                        Correct Answer Explanation
                      </h4>
                      <p className="text-[#6B7280] text-sm font-medium leading-relaxed mb-3">
                        {q.explanation || 'No explanation provided.'}
                      </p>
                      {q.shortcutTrick && (
                        <div className="border-t border-[#E4E7EC] pt-2.5 mt-2 text-xs text-[#2563EB] flex items-start gap-1.5 leading-relaxed font-bold">
                          <span className="font-extrabold text-[10px] bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-1.5 py-0.5 rounded shrink-0">
                            TRICK
                          </span>
                          <span>
                            Shortcut: {q.shortcutTrick}
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
    </AppShell>
  );
}
