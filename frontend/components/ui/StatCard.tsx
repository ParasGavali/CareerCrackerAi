'use client';

import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'violet' | 'green' | 'amber' | 'red';
  className?: string;
  suffix?: string;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  blue: { iconBg: 'bg-[#EFF6FF]', iconBorder: 'border-[#BFDBFE]', iconColor: 'text-[#2563EB]' },
  violet: { iconBg: 'bg-[#F5F3FF]', iconBorder: 'border-[#DDD6FE]', iconColor: 'text-[#7C3AED]' },
  green: { iconBg: 'bg-[#ECFDF5]', iconBorder: 'border-[#A7F3D0]', iconColor: 'text-[#059669]' },
  amber: { iconBg: 'bg-[#FFFBEB]', iconBorder: 'border-[#FDE68A]', iconColor: 'text-[#D97706]' },
  red: { iconBg: 'bg-[#FEF2F2]', iconBorder: 'border-[#FECACA]', iconColor: 'text-[#DC2626]' },
} as const;

const sizeMap = {
  sm: { value: 'text-2xl', icon: 18 },
  md: { value: 'text-3xl', icon: 20 },
  lg: { value: 'text-4xl', icon: 22 },
} as const;

const trendConfig = {
  up: { text: 'text-[#059669]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
  down: { text: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
  neutral: { text: 'text-[#9CA3AF]', bg: 'bg-[#F3F4F6]', border: 'border-[#E4E7EC]' },
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'blue',
  className = '',
  suffix,
  prefix,
  size = 'md',
}: StatCardProps) {
  const palette = colorMap[color];
  const sizing = sizeMap[size];

  const trendDirection = trend === undefined ? null : trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const t = trendDirection ? trendConfig[trendDirection] : null;
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;

  return (
    <div
      className={cn(
        'bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl p-6',
        'shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]',
        'transition-all duration-200 hover:border-[#2563EB]/40 hover:shadow-[0_4px_16px_rgba(37,99,235,0.10)] hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'w-10 h-10 rounded-xl border-[1.5px] flex items-center justify-center shrink-0',
            palette.iconBg,
            palette.iconBorder
          )}
        >
          <Icon size={sizing.icon} className={palette.iconColor} strokeWidth={2} />
        </div>
        {t && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-xs font-semibold',
              t.bg,
              t.border,
              t.text
            )}
          >
            {trendDirection !== 'neutral' && <TrendIcon size={12} strokeWidth={2.5} />}
            {trendDirection === 'neutral' ? '—' : `${trend! > 0 ? '+' : ''}${trend}%`}
          </span>
        )}
      </div>

      <p className={cn('mt-4 font-black text-[#111827] leading-tight tracking-tight', sizing.value)}>
        {prefix && <span className="text-lg font-bold opacity-70">{prefix}</span>}
        {value}
        {suffix && <span className="text-lg font-bold opacity-70 ml-0.5">{suffix}</span>}
      </p>

      <p className="text-sm font-medium text-[#6B7280] mt-1">{label}</p>
      {trendLabel && <p className="text-xs text-[#9CA3AF] mt-1.5">{trendLabel}</p>}
    </div>
  );
}

export default StatCard;
