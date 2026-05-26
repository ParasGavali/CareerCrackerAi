'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number; // percentage change
  trendLabel?: string;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'cyan';
  className?: string;
  animate?: boolean;
  suffix?: string;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  purple: {
    icon: 'bg-purple-500/20 text-purple-400',
    glow: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]',
    border: 'hover:border-purple-500/40',
    gradient: 'from-purple-500/10 to-purple-500/5',
    value: 'from-purple-400 to-blue-400',
  },
  blue: {
    icon: 'bg-blue-500/20 text-blue-400',
    glow: 'hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]',
    border: 'hover:border-blue-500/40',
    gradient: 'from-blue-500/10 to-blue-500/5',
    value: 'from-blue-400 to-cyan-400',
  },
  green: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    border: 'hover:border-emerald-500/40',
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    value: 'from-emerald-400 to-teal-400',
  },
  orange: {
    icon: 'bg-orange-500/20 text-orange-400',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    border: 'hover:border-orange-500/40',
    gradient: 'from-orange-500/10 to-orange-500/5',
    value: 'from-orange-400 to-yellow-400',
  },
  red: {
    icon: 'bg-red-500/20 text-red-400',
    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    border: 'hover:border-red-500/40',
    gradient: 'from-red-500/10 to-red-500/5',
    value: 'from-red-400 to-pink-400',
  },
  cyan: {
    icon: 'bg-cyan-500/20 text-cyan-400',
    glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    border: 'hover:border-cyan-500/40',
    gradient: 'from-cyan-500/10 to-cyan-500/5',
    value: 'from-cyan-400 to-blue-400',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'purple',
  className,
  animate = true,
  suffix = '',
  prefix = '',
  size = 'md',
}: StatCardProps) {
  const colors = colorMap[color];
  const isPositiveTrend = trend !== undefined && trend > 0;
  const isNegativeTrend = trend !== undefined && trend < 0;

  const TrendIcon = isPositiveTrend ? TrendingUp : isNegativeTrend ? TrendingDown : Minus;
  const trendColor = isPositiveTrend ? 'text-emerald-400' : isNegativeTrend ? 'text-red-400' : 'text-slate-400';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'glass-card p-6 relative overflow-hidden cursor-default',
        'border border-white/5 transition-all duration-300',
        colors.glow, colors.border,
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none',
        colors.gradient
      )} />

      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent)' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', colors.icon)}>
            <Icon size={size === 'sm' ? 18 : size === 'lg' ? 26 : 22} strokeWidth={2} />
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
              <TrendIcon size={14} />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className={cn('font-extrabold bg-gradient-to-r bg-clip-text text-transparent mb-1',
          colors.value,
          size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
        )}>
          {prefix}{animate ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {value}
            </motion.span>
          ) : value}{suffix}
        </div>

        <p className="text-slate-400 text-sm font-medium">{label}</p>

        {trendLabel && (
          <p className="text-slate-500 text-xs mt-1">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
