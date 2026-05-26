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
  const [started, setStarted] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredRef = useRef(false);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = percentage <= warningThreshold;
  const isDanger = percentage <= dangerThreshold;
  const isPulse = timeLeft <= 60 && timeLeft > 0;

  const getColor = useCallback(() => {
    if (isDanger) return '#ef4444';
    if (isWarning) return '#f59e0b';
    return '#7c3aed';
  }, [isDanger, isWarning]);

  const getTextColor = useCallback(() => {
    if (isDanger) return 'text-red-400';
    if (isWarning) return 'text-yellow-400';
    return 'text-slate-200';
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
              stroke="rgba(30, 30, 58, 0.8)"
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
          <span className={cn('font-bold tabular-nums', fontSize, getTextColor())}>
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
            ? 'text-red-400 bg-red-500/10 border-red-500/30'
            : isWarning
            ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
            : 'text-slate-200 bg-slate-800/50 border-slate-700/50',
          isPulse && 'animate-pulse-glow',
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
