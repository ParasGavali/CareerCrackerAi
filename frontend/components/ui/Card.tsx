'use client';

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E4E7EC] rounded-2xl',
        'shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]',
        hover &&
          'transition-all duration-200 hover:border-[#2563EB]/40 hover:shadow-[0_4px_16px_rgba(37,99,235,0.10),0_1px_3px_rgba(17,24,39,0.05)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            {title}
          </p>
          {subtitle && (
            <p className="text-sm text-[#9CA3AF] font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default Card;
