'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Timer } from '@/components/ui/Timer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { questionsApi } from '@/lib/api';
import { cn, capitalizeFirst } from '@/lib/utils';
import type { Question } from '@/types';
import toast from 'react-hot-toast';
import {
  Flag, ChevronLeft, ChevronRight,
  Grid3X3, X, AlertTriangle
} from 'lucide-react';

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
  const [startTime] = useState(Date.now());

  useEffect(() => {
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
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner size="xl" text="Loading questions..." />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="text-center bg-surface-container-lowest p-8 border border-outline-variant rounded-2xl ambient-shadow max-w-sm w-full mx-auto">
          <p className="text-on-surface text-xl font-bold mb-4">No questions found</p>
          <button onClick={() => router.back()} className="btn-glow px-6 py-3 text-white rounded-xl cursor-pointer shadow-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface select-none">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-surface-container/95 backdrop-blur-md border-b border-outline-variant/30 px-4 md:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-on-surface-variant hover:text-primary transition-all cursor-pointer">
            <X size={20} />
          </button>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Practice Quiz</p>
            <p className="text-sm font-black text-on-surface">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 hidden md:block max-w-xs">
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-on-surface-variant font-semibold mt-1 text-center">{answeredCount}/{questions.length} answered</p>
        </div>

        <div className="flex items-center gap-3">
          <Timer duration={count * 60} warningThreshold={20} dangerThreshold={10} size="sm" />
          <button
            onClick={() => setShowPalette(true)}
            className="p-2 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer shadow-sm bg-surface"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="btn-glow px-4 py-2 text-sm font-semibold rounded-xl text-white cursor-pointer shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8 bg-surface">
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
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={toggleFlag}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer',
                currentQuestion && flagged.has(currentQuestion._id)
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 shadow-sm'
                  : 'border-outline-variant text-on-surface-variant hover:border-amber-500/25 hover:text-amber-700'
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/25 transition-all cursor-pointer shadow-sm"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="btn-glow px-6 py-2.5 text-sm font-semibold rounded-xl text-white flex items-center gap-2 cursor-pointer shadow-sm"
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
                  ? 'bg-primary text-on-primary scale-110'
                  : flagged.has(q._id)
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700'
                  : answers[q._id]
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700'
                  : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary'
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
              className="fixed right-0 top-0 bottom-0 w-72 z-50 p-6 bg-surface-container/98 backdrop-blur-md border-l border-outline-variant/30 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-on-surface text-base">Question Palette</h3>
                  <button onClick={() => setShowPalette(false)} className="text-on-surface-variant hover:text-primary transition-all cursor-pointer">
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
                        i === currentIndex ? 'bg-primary text-on-primary' :
                        flagged.has(q._id) ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30' :
                        answers[q._id] ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30' :
                        'bg-surface border border-outline-variant/30 text-on-surface-variant'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold border-t border-outline-variant/20 pt-4">
                {[
                  { color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700', label: `Answered (${answeredCount})` },
                  { color: 'bg-surface border border-outline-variant/30 text-on-surface-variant', label: `Unanswered (${unansweredCount})` },
                  { color: 'bg-amber-500/10 border-amber-500/30 text-amber-700', label: `Flagged (${flagged.size})` },
                  { color: 'bg-primary text-on-primary', label: 'Current' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={cn('w-6 h-6 rounded border shrink-0', color)} />
                    <span className="text-on-surface-variant">{label}</span>
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
              <div className="bg-surface-container-lowest p-8 max-w-md w-full text-center border border-outline-variant/30 rounded-2xl ambient-shadow pointer-events-auto" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <AlertTriangle size={28} className="text-amber-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-on-surface mb-2">Submit Quiz?</h3>
                <p className="text-on-surface-variant font-semibold mb-2">
                  You&apos;ve answered <span className="text-on-surface font-bold">{answeredCount}</span> out of{' '}
                  <span className="text-on-surface font-bold">{questions.length}</span> questions.
                </p>
                {unansweredCount > 0 && (
                  <p className="text-amber-600 text-sm mb-6 font-bold">
                    ⚠️ {unansweredCount} question{unansweredCount > 1 ? 's' : ''} unanswered
                  </p>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:border-primary transition-all cursor-pointer"
                  >
                    Continue Quiz
                  </button>
                  <button
                    onClick={submitQuiz}
                    className="flex-1 btn-glow py-3 rounded-xl text-white text-sm font-semibold cursor-pointer shadow-sm"
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
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner size="xl" fullScreen text="Loading quiz..." />}>
        <QuizInterface />
      </Suspense>
    </ProtectedRoute>
  );
}
