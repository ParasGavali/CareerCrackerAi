'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswer: (optionId: string) => void;
  showResult?: boolean;
  correctAnswer?: string;
  disabled?: boolean;
  className?: string;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showResult = false,
  correctAnswer,
  disabled = false,
  className,
}: QuestionCardProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const getOptionState = (optionId: string) => {
    if (!showResult) {
      if (selectedAnswer === optionId) return 'selected';
      return 'default';
    }
    if (optionId === correctAnswer) return 'correct';
    if (optionId === selectedAnswer && selectedAnswer !== correctAnswer) return 'wrong';
    return 'default';
  };

  const getOptionClasses = (state: string) => {
    switch (state) {
      case 'selected':
        return 'border-purple-500/60 bg-purple-500/20 text-white';
      case 'correct':
        return 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300';
      case 'wrong':
        return 'border-red-500/60 bg-red-500/15 text-red-300';
      default:
        return 'border-white/8 bg-slate-900/40 text-slate-300 hover:border-purple-500/40 hover:bg-purple-500/10';
    }
  };

  const getLabelClasses = (state: string) => {
    switch (state) {
      case 'selected':
        return 'bg-purple-500 text-white';
      case 'correct':
        return 'bg-emerald-500 text-white';
      case 'wrong':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-800 text-slate-400 group-hover:bg-purple-500/30 group-hover:text-purple-300';
    }
  };

  return (
    <div className={cn('glass-card p-6 md:p-8', className)}>
      {/* Question header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Question
          </span>
          <span className="text-sm font-bold text-purple-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2.5 py-1 rounded-full font-medium border',
            question.difficulty === 'easy'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : question.difficulty === 'medium'
              ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
              : 'text-red-400 bg-red-500/10 border-red-500/30'
          )}>
            {question.difficulty}
          </span>
          <span className="text-xs text-slate-500">{question.subcategory}</span>
        </div>
      </div>

      {/* Question text */}
      <div className="mb-8">
        <p className="text-white text-base md:text-lg leading-relaxed font-medium">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const state = getOptionState(option.id);
          const isHovered = hoveredOption === option.id;

          return (
            <motion.button
              key={option.id}
              className={cn(
                'group w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left',
                'cursor-pointer relative overflow-hidden',
                getOptionClasses(state),
                disabled && 'cursor-default'
              )}
              onClick={() => !disabled && !showResult && onAnswer(option.id)}
              onHoverStart={() => setHoveredOption(option.id)}
              onHoverEnd={() => setHoveredOption(null)}
              whileHover={!disabled && !showResult ? { x: 4 } : {}}
              whileTap={!disabled && !showResult ? { scale: 0.99 } : {}}
              disabled={disabled}
            >
              {/* Option label */}
              <span className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                'font-bold text-sm transition-all duration-200',
                getLabelClasses(state)
              )}>
                {OPTION_LABELS[index]}
              </span>

              {/* Option text */}
              <span className="flex-1 text-sm leading-relaxed">
                {option.text}
              </span>

              {/* Result icon */}
              <AnimatePresence>
                {showResult && (state === 'correct' || state === 'wrong') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex-shrink-0"
                  >
                    {state === 'correct'
                      ? <CheckCircle size={20} className="text-emerald-400" />
                      : <XCircle size={20} className="text-red-400" />
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover shimmer */}
              {isHovered && !showResult && !disabled && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (after submit) */}
      <AnimatePresence>
        {showResult && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
          >
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              💡 Explanation
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
