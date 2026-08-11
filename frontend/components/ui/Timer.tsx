'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatTime } from '@/lib/utils';

interface TimerProps {
  duration: number; // seconds
  onExpire?: () => void;
  showRing?: boolean;
  autoStart?: boolean;
  paused?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  warningThreshold?: number; // percentage at which to turn yellow
  dangerThreshold?: number; // percentage at which to turn red
}

export function Timer({
  duration,
  onExpire,
  showRing = false,
  autoStart = true,
  paused = false,
  className,
  size = 'md',
  warningThreshold = 30,
  dangerThreshold = 10,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const started = autoStart;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredRef = useRef(false);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = percentage <= warningThreshold;
  const isDanger = percentage <= dangerThreshold;
  const isPulse = timeLeft <= 60 && timeLeft > 0;

  const getColor = useCallback(() => {
    if (isDanger) return '#DC2626';
    if (isWarning) return '#D97706';
    return '#2563EB';
  }, [isDanger, isWarning]);

  const getTextClasses = useCallback(() => {
    if (isDanger) return 'text-[#DC2626]';
    if (isWarning) return 'text-[#D97706]';
    return 'text-[#111827]';
  }, [isDanger, isWarning]);

  useEffect(() => {
    if (!started || paused) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [started, paused, onExpire]);

  const sizeConfig = {
    sm: { ring: 60, fontSize: 'text-sm', strokeWidth: 3 },
    md: { ring: 100, fontSize: 'text-xl', strokeWidth: 4 },
    lg: { ring: 140, fontSize: 'text-3xl', strokeWidth: 5 },
  };

  const { ring, fontSize, strokeWidth } = sizeConfig[size];
  const radius = (ring / 2) - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  if (showRing) {
    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <motion.div
          animate={isPulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 0.8, repeat: isPulse ? Infinity : 0 }}
        >
          <svg width={ring} height={ring} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={ring / 2}
              cy={ring / 2}
              r={radius}
              fill="none"
              stroke="#E9EBF0"
              strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <motion.circle
              cx={ring / 2}
              cy={ring / 2}
              r={radius}
              fill="none"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
            />
          </svg>
        </motion.div>
        <div className="absolute flex flex-col items-center">
          <span className={cn('font-bold tabular-nums', fontSize, getTextClasses())}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={Math.floor(timeLeft / 60)}
        className={cn(
          'font-mono font-bold tabular-nums px-3 py-1.5 rounded-lg border',
          isDanger
            ? 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]'
            : isWarning
            ? 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]'
            : 'text-[#111827] bg-white border-[#E4E7EC] shadow-[0_1px_2px_rgba(17,24,39,0.04)]',
          fontSize,
          className
        )}
        animate={isPulse ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {formatTime(timeLeft)}
      </motion.div>
    </AnimatePresence>
  );
}
