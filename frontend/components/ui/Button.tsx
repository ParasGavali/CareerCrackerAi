'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'danger-ghost'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-bold rounded-xl cursor-pointer transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_4px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.30)]',
  secondary:
    'bg-transparent text-[#2563EB] border-[1.5px] border-[#BFDBFE] hover:bg-[#EFF6FF] hover:border-[#2563EB]',
  outline:
    'bg-white text-[#374151] border border-[#E4E7EC] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#F8FAFF]',
  ghost:
    'bg-transparent text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF]',
  danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-[0_1px_4px_rgba(220,38,38,0.25)]',
  'danger-ghost': 'bg-transparent text-[#DC2626] hover:bg-[#FEF2F2]',
  success: 'bg-[#059669] text-white hover:bg-[#047857] shadow-[0_1px_4px_rgba(5,150,105,0.25)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
