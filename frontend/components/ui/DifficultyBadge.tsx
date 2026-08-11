'use client';

import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const config = {
  easy: {
    label: 'Easy',
    classes: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    dot: 'bg-[#059669]',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
    dot: 'bg-[#D97706]',
  },
  hard: {
    label: 'Hard',
    classes: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    dot: 'bg-[#DC2626]',
  },
  mixed: {
    label: 'Mixed',
    classes: 'bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]',
    dot: 'bg-[#7C3AED]',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-3 py-1',
  lg: 'text-sm px-4 py-1.5',
};

export function DifficultyBadge({ difficulty, size = 'md', className }: DifficultyBadgeProps) {
  const key = difficulty?.toLowerCase() as keyof typeof config;
  const cfg = config[key] || {
    label: difficulty,
    classes: 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]',
    dot: 'bg-[#6B7280]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide',
        cfg.classes,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}
