'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Timer } from '@/components/ui/Timer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buttonVariants } from '@/components/ui/Button';
import { questionsApi } from '@/lib/api';
import { cn, capitalizeFirst } from '@/lib/utils';
import type { Question } from '@/types';
import toast from 'react-hot-toast';
import {
  Flag, ChevronLeft, ChevronRight,
  Grid3X3, X, AlertTriangle
} from 'lucide-react';

function generateMockQuestions(n: number): Question[] {
  return Array.from({ length: n }, (_, i) => ({
    _id: `mock-${i}`,
    questionText: `Sample Question ${i + 1}: If a train travels at 60 km/h for 2.5 hours, what distance does it cover?`,
    options: [
      { id: 'a', text: '120 km', isCorrect: false },
      { id: 'b', text: '150 km', isCorrect: true },
      { id: 'c', text: '135 km', isCorrect: false },
      { id: 'd', text: '160 km', isCorrect: false },
    ],
    correctOption: 'b',
    explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km',
    category: 'Quantitative Aptitude',
    subcategory: 'Speed & Distance',
    difficulty: 'medium',
    companies: ['TCS', 'Infosys'],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function QuizInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const count = parseInt(searchParams.get('count') || '10');
  const subcategory = searchParams.get('subcategory') || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const params: Record<string, string | number> = { count };
    if (category !== 'all') params.category = capitalizeFirst(category);
    if (difficulty !== 'all') params.difficulty = difficulty;
    if (subcategory) params.subcategory = subcategory;

    questionsApi.getRandomQuestions(params as Parameters<typeof questionsApi.getRandomQuestions>[0])
      .then(res => {
        const qs = res.data.data || [];
        if (qs.length === 0) {
          setQuestions(generateMockQuestions(count));
        } else {
          setQuestions(qs);
        }
      })
      .catch(() => setQuestions(generateMockQuestions(count)))
      .finally(() => setLoading(false));
  }, [category, difficulty, count, subcategory]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleAnswer = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion._id]: optionId }));
  };

  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion._id)) {
        next.delete(currentQuestion._id);
        toast('Question unflagged', { icon: '🏳️' });
      } else {
        next.add(currentQuestion._id);
        toast('Question flagged for review', { icon: '🚩' });
      }
      return next;
    });
  }, [currentQuestion]);

  const submitQuiz = () => {
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const result = {
      questions,
      answers,
      timeTaken,
      flagged: Array.from(flagged),
    };
    sessionStorage.setItem('quizResult', JSON.stringify(result));
    router.push('/practice/quiz/results');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <LoadingSpinner size="xl" text="Loading questions..." />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <AppShell variant="focus">
        <div className="min-h-screen flex items-center justify-center text-[#111827]">
          <div className="text-center bg-white p-8 border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] max-w-sm w-full mx-auto">
            <p className="text-[#111827] text-xl font-bold mb-4">No questions found</p>
            <button onClick={() => router.back()} className="bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-3 text-white rounded-xl cursor-pointer shadow-sm font-bold transition-all">
              Go Back
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <AppShell variant="focus">
      <div className="min-h-screen flex flex-col bg-[#F8FAFF] text-[#111827] select-none">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] px-4 md:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => router.back()} className="text-[#6B7280] hover:text-[#2563EB] transition-all cursor-pointer shrink-0">
              <X size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-[#6B7280] uppercase tracking-wider font-bold">Practice Quiz</p>
              <p className="text-sm font-black text-[#111827] truncate">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 hidden md:block max-w-xs">
            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#2563EB]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 text-center">{answeredCount}/{questions.length} answered</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Timer duration={count * 60} warningThreshold={20} dangerThreshold={10} size="sm" />
            <button
              onClick={() => setShowPalette(true)}
              className="p-2 rounded-xl border border-[#E4E7EC] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-all cursor-pointer shadow-sm bg-white"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setShowSubmitDialog(true)}
              className={buttonVariants({ variant: 'primary', size: 'sm' })}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8 bg-[#F8FAFF]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={answers[currentQuestion._id]}
                  onAnswer={handleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between mt-6 gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E4E7EC] bg-white text-[#6B7280] text-sm font-bold hover:border-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                onClick={toggleFlag}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer bg-white',
                  currentQuestion && flagged.has(currentQuestion._id)
                    ? 'border-[#FCD34D] bg-[#FFFBEB] text-[#B45309] shadow-sm'
                    : 'border-[#E4E7EC] text-[#6B7280] hover:border-[#FCD34D] hover:text-[#D97706]'
                )}
              >
                <Flag size={15} />
                {currentQuestion && flagged.has(currentQuestion._id) ? 'Unflag' : 'Flag'}
              </button>
            </div>

            <div className="flex gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-sm font-bold hover:bg-[#DBEAFE] transition-all cursor-pointer shadow-sm"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitDialog(true)}
                  className={buttonVariants({ variant: 'primary', size: 'sm' })}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>

          {/* Question dots progress */}
          <div className="mt-6 flex flex-wrap gap-1.5 justify-center">
            {questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm',
                  i === currentIndex
                    ? 'bg-[#2563EB] text-white scale-110'
                    : flagged.has(q._id)
                    ? 'bg-[#FFFBEB] border border-[#FCD34D] text-[#B45309]'
                    : answers[q._id]
                    ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]'
                    : 'bg-white border border-[#E4E7EC] text-[#6B7280] hover:border-[#2563EB]'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Palette */}
        <AnimatePresence>
          {showPalette && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setShowPalette(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="fixed right-0 top-0 bottom-0 w-72 z-50 p-6 bg-white/98 backdrop-blur-md border-l border-[#E4E7EC] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-[#111827] text-base">Question Palette</h3>
                    <button onClick={() => setShowPalette(false)} className="text-[#6B7280] hover:text-[#2563EB] transition-all cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {questions.map((q, i) => (
                      <button
                        key={q._id}
                        onClick={() => { setCurrentIndex(i); setShowPalette(false); }}
                        className={cn(
                          'w-10 h-10 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm',
                          i === currentIndex ? 'bg-[#2563EB] text-white' :
                          flagged.has(q._id) ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D]' :
                          answers[q._id] ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' :
                          'bg-white border border-[#E4E7EC] text-[#6B7280]'
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold border-t border-[#E4E7EC] pt-4">
                  {[
                    { color: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]', label: `Answered (${answeredCount})` },
                    { color: 'bg-white border-[#E4E7EC] text-[#6B7280]', label: `Unanswered (${unansweredCount})` },
                    { color: 'bg-[#FFFBEB] border-[#FCD34D] text-[#B45309]', label: `Flagged (${flagged.size})` },
                    { color: 'bg-[#2563EB] text-white', label: 'Current' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className={cn('w-6 h-6 rounded border shrink-0', color)} />
                      <span className="text-[#6B7280]">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Submit Confirmation Dialog */}
        <AnimatePresence>
          {showSubmitDialog && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowSubmitDialog(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-white p-8 max-w-md w-full text-center border border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] pointer-events-auto" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FDE68A]">
                    <AlertTriangle size={28} className="text-[#D97706] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black text-[#111827] mb-2">Submit Quiz?</h3>
                  <p className="text-[#6B7280] font-semibold mb-2">
                    You&apos;ve answered <span className="text-[#111827] font-bold">{answeredCount}</span> out of{' '}
                    <span className="text-[#111827] font-bold">{questions.length}</span> questions.
                  </p>
                  {unansweredCount > 0 && (
                    <p className="text-[#D97706] text-sm mb-6 font-bold">
                      ⚠️ {unansweredCount} question{unansweredCount > 1 ? 's' : ''} unanswered
                    </p>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowSubmitDialog(false)}
                      className="flex-1 py-3 rounded-xl border border-[#E4E7EC] bg-white text-[#6B7280] text-sm font-bold hover:border-[#2563EB] transition-all cursor-pointer"
                    >
                      Continue Quiz
                    </button>
                    <button
                      onClick={submitQuiz}
                      className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] py-3 rounded-xl text-white text-sm font-semibold cursor-pointer shadow-sm transition-all"
                    >
                      Submit Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="xl" fullScreen text="Loading quiz..." />}>
      <QuizInterface />
    </Suspense>
  );
}
