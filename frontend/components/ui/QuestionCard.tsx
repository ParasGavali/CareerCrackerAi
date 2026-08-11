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
        return 'border-[#2563EB] bg-[#EFF6FF] text-[#111827]';
      case 'correct':
        return 'border-[#6EE7B7] bg-[#ECFDF5] text-[#111827]';
      case 'wrong':
        return 'border-[#FECACA] bg-[#FEF2F2] text-[#111827]';
      default:
        return 'border-[#E4E7EC] bg-white text-[#111827] hover:border-[#BFDBFE] hover:bg-[#F8FAFF]';
    }
  };

  const getLabelClasses = (state: string) => {
    switch (state) {
      case 'selected':
        return 'bg-[#2563EB] text-white';
      case 'correct':
        return 'bg-[#059669] text-white';
      case 'wrong':
        return 'bg-[#DC2626] text-white';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#2563EB] group-hover:text-white';
    }
  };

  return (
    <div className={cn('bg-white border border-[#E4E7EC] rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]', className)}>
      {/* Question header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Question
          </span>
          <span className="text-sm font-bold text-[#2563EB]">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2.5 py-1 rounded-full font-semibold border',
            question.difficulty === 'easy'
              ? 'text-[#065F46] bg-[#ECFDF5] border-[#A7F3D0]'
              : question.difficulty === 'medium'
              ? 'text-[#92400E] bg-[#FFFBEB] border-[#FDE68A]'
              : 'text-[#991B1B] bg-[#FEF2F2] border-[#FECACA]'
          )}>
            {question.difficulty}
          </span>
          <span className="text-xs text-[#9CA3AF]">{question.subcategory}</span>
        </div>
      </div>

      {/* Question text */}
      <div className="mb-8">
        <p className="text-[#111827] text-base md:text-lg leading-relaxed font-semibold">
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
                'group w-full flex items-center gap-4 p-4 rounded-xl border-[1.5px] transition-all duration-200 text-left',
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
              <span className="flex-1 text-sm leading-relaxed font-medium">
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
                      ? <CheckCircle size={20} className="text-[#059669]" />
                      : <XCircle size={20} className="text-[#DC2626]" />
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover shimmer */}
              {isHovered && !showResult && !disabled && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB]/5 to-transparent"
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
            className="mt-6 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]"
          >
            <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
              Explanation
            </p>
            <p className="text-[#374151] text-sm leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
