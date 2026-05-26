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
    classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  hard: {
    label: 'Hard',
    classes: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
  mixed: {
    label: 'Mixed',
    classes: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    dot: 'bg-purple-400',
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
    classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    dot: 'bg-slate-400',
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
