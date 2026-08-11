'use client';

import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'blue'
  | 'violet'
  | 'green'
  | 'yellow'
  | 'red'
  | 'gray'
  | 'success'
  | 'warning'
  | 'error';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  violet: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
  green: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
  yellow: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  red: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  gray: 'bg-[#F9FAFB] text-[#374151] border-[#E5E7EB]',
  success: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  warning: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
  error: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

const dots: Record<BadgeVariant, string> = {
  blue: 'bg-[#2563EB]',
  violet: 'bg-[#7C3AED]',
  green: 'bg-[#059669]',
  yellow: 'bg-[#D97706]',
  red: 'bg-[#DC2626]',
  gray: 'bg-[#6B7280]',
  success: 'bg-[#059669]',
  warning: 'bg-[#D97706]',
  error: 'bg-[#DC2626]',
};

const sizes = {
  sm: 'text-[0.68rem] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({
  variant = 'gray',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[variant])} />}
      {children}
    </span>
  );
}

export default Badge;
