'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Timer } from '@/components/ui/Timer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { testsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';
import toast from 'react-hot-toast';
import {
  AlertTriangle, ShieldAlert, Monitor, CheckCircle,
  HelpCircle, ChevronLeft, ChevronRight, CornerDownRight, X
} from 'lucide-react';

export default function TakeMockTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string>('');
  const [duration, setDuration] = useState<number>(30); // in minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  // Anti-cheat States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const startTimeRef = useRef<number>(Date.now());
  const examContainerRef = useRef<HTMLDivElement>(null);

  // 1. Initialise Test
  useEffect(() => {
    const initTest = async () => {
      try {
        const res = await testsApi.startTest(testId);
        const data = res.data.data;
        if (data) {
          setAttemptId(data.attemptId);
          setQuestions(data.questions || []);
          setDuration(data.duration || 30);
        }
      } catch (err: any) {
        console.error('Error starting exam, using demo mode:', err);
        // Fallback for offline usage
        setAttemptId(`demo-attempt-${Date.now()}`);
        setQuestions(generateMockQuestions(15));
        setDuration(30);
      } finally {
        setLoading(false);
      }
    };
    initTest();
  }, [testId]);

  // Mock generator
  const generateMockQuestions = (n: number): Question[] => {
    const topics = ['Numerical Ability', 'Reasoning Puzzles', 'Verbal Grammar'];
    return Array.from({ length: n }, (_, i) => ({
      _id: `q-mock-${i}`,
      questionText: `Assessment Question ${i + 1}: Select the option that best completes the sequence. If A takes 10 days and B takes 15 days to finish a piece of work, how long will they take working together?`,
      options: [
        { id: 'a', text: '5 days', isCorrect: false },
        { id: 'b', text: '6 days', isCorrect: true },
        { id: 'c', text: '7.5 days', isCorrect: false },
        { id: 'd', text: '8 days', isCorrect: false },
      ],
      correctOption: 'b',
      explanation: 'Time working together = (10 * 15) / (10 + 15) = 150 / 25 = 6 days.',
      category: topics[i % 3],
      subcategory: 'Time & Work',
      difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
      companies: ['TCS', 'Infosys'],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  };

  // 2. Fullscreen Handlers
  const requestFullscreen = () => {
    if (examContainerRef.current) {
      const elem = examContainerRef.current as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // 3. Tab-switch Detection (Anti-Cheat Mechanism)
  const handleTabSwitch = useCallback(() => {
    if (loading || isSubmitting) return;

    setTabSwitches(prev => {
      const nextCount = prev + 1;
      setShowWarningModal(true);
      toast.error(`Security Warning: Tab switch / focus loss detected! (${nextCount}/3)`);

      // Log tab switch to server
      if (attemptId && attemptId !== 'demo') {
        testsApi.logTabSwitch(attemptId).catch(console.error);
      }

      if (nextCount >= 3) {
        toast.error('Automatic Exam Submission: Exceeded security tab-switch limits.');
        // Trigger auto submit
        setTimeout(() => handleFinalSubmit(true), 1500);
      }

      return nextCount;
    });
  }, [loading, isSubmitting, attemptId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        handleTabSwitch();
      }
    };

    const onBlur = () => {
      handleTabSwitch();
    };

    // Only apply event listeners when user has entered Fullscreen (started test)
    if (isFullscreen) {
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('blur', onBlur);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  }, [isFullscreen, handleTabSwitch]);

  // 4. Submit logic
  const handleFinalSubmit = async (forced = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);
    setShowWarningModal(false);

    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

    toast.loading(forced ? 'Submitting due to security limits...' : 'Submitting exam scorecard...', { duration: 3000 });

    try {
      // Exit fullscreen before redirecting
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }

      const res = await testsApi.submitTest(attemptId, answers, timeTaken, tabSwitches);
      
      toast.success('Exam submitted successfully!');
      // Store in session for quick results review
      const quizResult = {
        questions,
        answers,
        timeTaken,
        flagged: Array.from(flagged)
      };
      sessionStorage.setItem('quizResult', JSON.stringify(quizResult));
      
      router.push(`/practice/quiz/results`);
    } catch (err) {
      console.error('Error submitting exam, routing locally:', err);
      // Demo submit
      const quizResult = {
        questions,
        answers,
        timeTaken,
        flagged: Array.from(flagged)
      };
      sessionStorage.setItem('quizResult', JSON.stringify(quizResult));
      router.push(`/practice/quiz/results`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ._id]: optionId }));
  };

  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ._id)) {
        next.delete(currentQ._id);
        toast('Removed bookmark', { icon: '🏳️' });
      } else {
        next.add(currentQ._id);
        toast('Marked for review', { icon: '🚩' });
      }
      return next;
    });
  };

  const handleClearAnswer = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ._id];
      return next;
    });
    toast('Selection cleared');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <LoadingSpinner size="xl" text="Setting up secure environment..." />
      </div>
    );
  }

  // Pre-test Enforcer screen
  if (!isFullscreen) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-4">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="glass-card p-8 max-w-lg w-full text-center relative z-10 border-white/5">
            <ShieldAlert size={56} className="text-purple-500 mx-auto mb-5 animate-pulse" />
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Secure Placement Assessment</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              This is an official placement-style exam with anti-cheat monitoring. To start this exam, you must enter <strong className="text-white">Fullscreen Mode</strong>.
            </p>

            <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-left space-y-3 mb-8 text-xs text-slate-400">
              <h3 className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Monitor size={14} className="text-purple-400" />
                Assessment Instructions:
              </h3>
              <p>• Navigating away from this tab or minimizing window will trigger a <strong>Security Violation</strong>.</p>
              <p>• <strong>3 Tab switches</strong> will lead to automatic submission of the test.</p>
              <p>• Ensure your internet connection is stable. The timer continues even if you close the window.</p>
              <p>• Once launched, you cannot go back without submitting.</p>
            </div>

            <button
              onClick={requestFullscreen}
              className="w-full btn-glow py-3.5 px-6 rounded-xl text-white font-extrabold text-sm tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Monitor size={16} />
              Launch Secure Fullscreen Test
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <ProtectedRoute>
      <div
        ref={examContainerRef}
        className="min-h-screen bg-[#0a0a0f] text-white flex flex-col select-none"
        style={{ userSelect: 'none' }}
      >
        {/* Secure Exam Top Bar */}
        <div className="sticky top-0 z-20 bg-slate-950 border-b border-white/5 px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-red-400 animate-pulse">
              <ShieldAlert size={14} />
              SECURE BROWSER ACTIVE
            </div>
            <div className="hidden md:block">
              <h2 className="text-sm font-bold text-white leading-tight">Mock Placement Assessment</h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Attempt ID: {attemptId.slice(0, 15)}...</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">Time Remaining:</span>
              <Timer
                duration={duration * 60}
                onExpire={() => handleFinalSubmit(false)}
                warningThreshold={15}
                dangerThreshold={5}
                size="md"
              />
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-glow px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl text-white cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Split Screen layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Question Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card p-6 border-white/5 mb-6 relative overflow-hidden">
                {/* Question Info Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-5 text-xs">
                  <span className="font-extrabold text-purple-400 uppercase tracking-widest">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-slate-400 uppercase">
                    {currentQuestion?.category || 'General'}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-white font-semibold text-lg leading-relaxed mb-6">
                  {currentQuestion?.questionText}
                </h3>

                {/* Options list */}
                <div className="space-y-3.5">
                  {currentQuestion?.options.map((opt, oIndex) => {
                    const optLetter = String.fromCharCode(65 + oIndex); // A, B, C, D
                    const isSelected = answers[currentQuestion._id] === optLetter.toLowerCase();

                    return (
                      <button
                        key={opt.id || optLetter}
                        onClick={() => handleSelectOption(optLetter.toLowerCase())}
                        className={cn(
                          'w-full text-left p-4 rounded-xl border text-sm flex items-center gap-3.5 transition-all cursor-pointer',
                          isSelected
                            ? 'bg-purple-600/10 border-purple-500/50 text-purple-300 font-bold'
                            : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                        )}
                      >
                        <span
                          className={cn(
                            'w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-all',
                            isSelected
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-slate-800 border-white/5 text-slate-500'
                          )}
                        >
                          {optLetter}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={handleToggleFlag}
                    className={cn(
                      'px-4.5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                      flagged.has(currentQuestion?._id)
                        ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                        : 'border-white/5 text-slate-400 hover:border-orange-500/20 hover:text-orange-400'
                    )}
                  >
                    {flagged.has(currentQuestion?._id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button
                    onClick={handleClearAnswer}
                    className="px-4 py-2.5 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-slate-400 transition-all cursor-pointer"
                  >
                    Clear Response
                  </button>
                </div>

                <div>
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex(p => Math.min(totalQuestions - 1, p + 1))}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/20 transition-all cursor-pointer"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="btn-glow px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white cursor-pointer"
                    >
                      Finish Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Navigator Panel */}
          <div className="w-80 border-l border-white/5 bg-slate-950 px-6 py-8 flex flex-col justify-between hidden lg:flex select-none">
            <div>
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider mb-5 flex items-center gap-2">
                <CornerDownRight size={14} className="text-purple-400" />
                Exam Navigator
              </h3>

              {/* Numbered Palette Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, i) => {
                  const isCurrent = i === currentIndex;
                  const isFlagged = flagged.has(q._id);
                  const isAnswered = !!answers[q._id];

                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentIndex(i)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        isCurrent
                          ? 'bg-purple-600 text-white'
                          : isFlagged
                          ? 'bg-orange-500/30 border border-orange-500/50 text-orange-400'
                          : isAnswered
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-900 border border-white/5 text-slate-500 hover:border-purple-500/30'
                      )}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Navigator Legend */}
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                {[
                  { color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', label: `Answered (${answeredCount})` },
                  { color: 'bg-slate-900 border-white/5 text-slate-500', label: `Unanswered (${totalQuestions - answeredCount})` },
                  { color: 'bg-orange-500/30 border-orange-500/50 text-orange-400', label: `Bookmarked (${flagged.size})` },
                  { color: 'bg-purple-600 text-white', label: 'Current Question' }
                ].map(legend => (
                  <div key={legend.label} className="flex items-center gap-2.5">
                    <div className={cn('w-5 h-5 rounded border shrink-0', legend.color)} />
                    <span className="text-slate-400 font-medium">{legend.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics security tracker */}
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 space-y-2 text-[10px] text-slate-500">
              <p className="font-semibold text-slate-400 flex items-center gap-1">
                <ShieldAlert size={12} className="text-yellow-400" />
                SECURITY LOG
              </p>
              <p>• Total window blurs: <strong className="text-slate-400">{tabSwitches} / 3 Allowed</strong></p>
              <p>• Enforced Fullscreen Mode: <strong className="text-emerald-400">Yes</strong></p>
            </div>
          </div>
        </div>

        {/* ─── SECURITY WARNING MODAL ─────────────────────────────────────── */}
        <AnimatePresence>
          {showWarningModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card max-w-md w-full p-6 text-center border-red-500/30"
                >
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Security Warning!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    A tab-switch or window blur has been detected. This event has been logged on the server.
                    Forced submission will occur if you switch tabs again.
                  </p>
                  
                  <div className="bg-slate-900 border border-white/5 rounded-xl p-3.5 text-center text-xs text-yellow-400 font-semibold mb-6">
                    🚨 Warning count: {tabSwitches} / 3
                  </div>

                  <button
                    onClick={() => { setShowWarningModal(false); requestFullscreen(); }}
                    className="w-full btn-glow py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Resume Secure Exam
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ─── CONFIRM SUBMIT MODAL ───────────────────────────────────────── */}
        <AnimatePresence>
          {showSubmitModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50"
                onClick={() => setShowSubmitModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="glass-card max-w-md w-full p-6 text-center border-white/5" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Submit Exam Scorecard?</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    You have answered <strong className="text-white">{answeredCount}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions. Are you sure you want to finish this placement assessment?
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 py-3 rounded-xl border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider hover:border-white/10 transition-all cursor-pointer"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleFinalSubmit(false)}
                      disabled={isSubmitting}
                      className="flex-1 btn-glow py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
