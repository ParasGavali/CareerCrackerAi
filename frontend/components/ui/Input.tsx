'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full px-4 py-2.5 bg-white border-[1.5px] border-[#E4E7EC] rounded-xl',
      'text-sm text-[#111827] font-medium placeholder:text-[#9CA3AF]',
      'outline-none transition-all duration-150',
      'focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full px-3.5 py-2.5 bg-white border-[1.5px] border-[#E4E7EC] rounded-xl',
      'text-sm text-[#111827] font-medium',
      'outline-none transition-all duration-150 cursor-pointer',
      'focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]',
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = 'Select';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full px-4 py-2.5 bg-white border-[1.5px] border-[#E4E7EC] rounded-xl',
      'text-sm text-[#111827] font-medium placeholder:text-[#9CA3AF]',
      'outline-none transition-all duration-150 resize-none',
      'focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

export default Input;
