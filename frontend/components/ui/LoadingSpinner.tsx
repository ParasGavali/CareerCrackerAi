'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: { spinner: 20, border: 2 },
  md: { spinner: 36, border: 3 },
  lg: { spinner: 56, border: 4 },
  xl: { spinner: 80, border: 5 },
};

export function LoadingSpinner({
  size = 'md',
  text,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { spinner, border } = sizeMap[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative" style={{ width: spinner, height: spinner }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${border}px solid rgba(124, 58, 237, 0.2)`,
          }}
        />
        {/* Spinning gradient ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${border}px solid transparent`,
            borderTopColor: '#7c3aed',
            borderRightColor: '#2563eb',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner pulse */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
          style={{
            inset: border * 2,
          }}
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {text && (
        <motion.p
          className="text-slate-400 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <LoadingSpinner size="xl" text="Loading CareerCracker AI..." />
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-10 w-full rounded-lg" />
    </div>
  );
}
