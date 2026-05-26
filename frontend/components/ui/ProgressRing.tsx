'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
  className?: string;
  animate?: boolean;
  showPercentage?: boolean;
}

let gradientIdCounter = 0;

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color,
  gradientStart = '#7c3aed',
  gradientEnd = '#2563eb',
  className,
  animate = true,
  showPercentage = true,
}: ProgressRingProps) {
  const gradientId = `progress-gradient-${++gradientIdCounter}`;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const radius = (size / 2) - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedPct / 100);

  const center = size / 2;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          style={{ filter: `drop-shadow(0 0 8px ${color || gradientStart}40)` }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientEnd} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(30, 30, 58, 0.8)"
            strokeWidth={strokeWidth}
          />

          {/* Progress */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color || `url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <motion.span
              className="font-extrabold text-white leading-none"
              style={{
                fontSize: size * 0.2,
                background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={animate ? { opacity: 0, scale: 0.5 } : {}}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {Math.round(clampedPct)}
              <span style={{ fontSize: size * 0.1 }}>%</span>
            </motion.span>
          )}
          {label && !showPercentage && (
            <span
              className="font-bold text-white text-center leading-tight"
              style={{ fontSize: size * 0.14, maxWidth: size * 0.7 }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="text-slate-400 text-center mt-0.5"
              style={{ fontSize: size * 0.09 }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && showPercentage && (
        <div className="mt-3 text-center">
          <p className="text-white font-semibold text-sm">{label}</p>
          {sublabel && <p className="text-slate-400 text-xs mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
