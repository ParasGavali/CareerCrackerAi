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
  Flag, ChevronLeft, ChevronRight, BookmarkPlus,
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
          // Mock data for demo
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
    // Store result in sessionStorage for results page
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <LoadingSpinner size="xl" text="Loading questions..." />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center">
          <p className="text-white text-xl mb-4">No questions found</p>
          <button onClick={() => router.back()} className="btn-glow px-6 py-3 text-white rounded-xl">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between gap-4"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Practice Quiz</p>
            <p className="text-sm font-semibold text-white">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 hidden md:block max-w-xs">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">{answeredCount}/{questions.length} answered</p>
        </div>

        <div className="flex items-center gap-3">
          <Timer duration={count * 60} warningThreshold={20} dangerThreshold={10} size="sm" />
          <button
            onClick={() => setShowPalette(true)}
            className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/40 transition-all"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="btn-glow px-4 py-2 text-sm font-semibold rounded-xl text-white"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={toggleFlag}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                currentQuestion && flagged.has(currentQuestion._id)
                  ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                  : 'border-white/10 text-slate-400 hover:border-orange-500/30 hover:text-orange-400'
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-all"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="btn-glow px-6 py-2.5 text-sm font-semibold rounded-xl text-white flex items-center gap-2"
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
                'w-7 h-7 rounded-lg text-xs font-bold transition-all',
                i === currentIndex
                  ? 'bg-purple-500 text-white scale-110'
                  : flagged.has(q._id)
                  ? 'bg-orange-500/30 border border-orange-500/50 text-orange-400'
                  : answers[q._id]
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/60 border border-white/10 text-slate-500 hover:border-purple-500/30'
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
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowPalette(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 p-6"
              style={{ background: 'rgba(15,15,26,0.98)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(124,58,237,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Question Palette</h3>
                <button onClick={() => setShowPalette(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, i) => (
                  <button
                    key={q._id}
                    onClick={() => { setCurrentIndex(i); setShowPalette(false); }}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xs font-bold transition-all',
                      i === currentIndex ? 'bg-purple-500 text-white' :
                      flagged.has(q._id) ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50' :
                      answers[q._id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      'bg-slate-800 text-slate-500 border border-white/10'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', label: `Answered (${answeredCount})` },
                  { color: 'bg-slate-800 border-white/10 text-slate-500', label: `Unanswered (${unansweredCount})` },
                  { color: 'bg-orange-500/30 border-orange-500/50 text-orange-400', label: `Flagged (${flagged.size})` },
                  { color: 'bg-purple-500 text-white', label: 'Current' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded border', color)} />
                    <span className="text-slate-400">{label}</span>
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
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowSubmitDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={28} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Submit Quiz?</h3>
                <p className="text-slate-400 mb-2">
                  You&apos;ve answered <span className="text-white font-semibold">{answeredCount}</span> out of{' '}
                  <span className="text-white font-semibold">{questions.length}</span> questions.
                </p>
                {unansweredCount > 0 && (
                  <p className="text-yellow-400 text-sm mb-6">
                    ⚠️ {unansweredCount} question{unansweredCount > 1 ? 's' : ''} unanswered
                  </p>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:border-white/20 transition-all"
                  >
                    Continue Quiz
                  </button>
                  <button
                    onClick={submitQuiz}
                    className="flex-1 btn-glow py-3 rounded-xl text-white text-sm font-semibold"
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
