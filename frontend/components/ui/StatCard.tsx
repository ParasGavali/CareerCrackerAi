'use client';

import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

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
  blue: {
    iconBg: '#EFF6FF',
    iconBorder: '#BFDBFE',
    iconColor: '#2563EB',
  },
  violet: {
    iconBg: '#F5F3FF',
    iconBorder: '#DDD6FE',
    iconColor: '#7C3AED',
  },
  green: {
    iconBg: '#ECFDF5',
    iconBorder: '#A7F3D0',
    iconColor: '#059669',
  },
  amber: {
    iconBg: '#FFFBEB',
    iconBorder: '#FDE68A',
    iconColor: '#D97706',
  },
  red: {
    iconBg: '#FEF2F2',
    iconBorder: '#FECACA',
    iconColor: '#DC2626',
  },
} as const;

const sizeMap = {
  sm: {
    valueFontSize: '1.5rem',   // text-2xl
    valueFontWeight: 900,
    iconSize: 18,
  },
  md: {
    valueFontSize: '1.875rem', // text-3xl
    valueFontWeight: 900,
    iconSize: 20,
  },
  lg: {
    valueFontSize: '2.25rem',  // text-4xl
    valueFontWeight: 900,
    iconSize: 22,
  },
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

  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral  = trend !== undefined && trend === 0;

  const trendColor = trendPositive
    ? '#059669'
    : trendNegative
    ? '#DC2626'
    : '#9CA3AF';

  const trendBg = trendPositive
    ? '#ECFDF5'
    : trendNegative
    ? '#FEF2F2'
    : '#F3F4F6';

  const trendBorder = trendPositive
    ? '#A7F3D0'
    : trendNegative
    ? '#FECACA'
    : '#E4E7EC';

  const TrendIcon = trendNegative ? TrendingDown : TrendingUp;

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E4E7EC',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)',
        padding: '1.5rem',
        transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(37,99,235,0.4)';
        el.style.boxShadow =
          '0 4px 6px rgba(17,24,39,0.07), 0 10px 28px rgba(17,24,39,0.08)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = '#E4E7EC';
        el.style.boxShadow =
          '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Icon box */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '0.75rem',
            backgroundColor: palette.iconBg,
            border: `1.5px solid ${palette.iconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={sizing.iconSize} color={palette.iconColor} strokeWidth={2} />
        </div>

        {/* Trend badge */}
        {trend !== undefined && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              backgroundColor: trendBg,
              border: `1px solid ${trendBorder}`,
              borderRadius: '9999px',
              padding: '0.2rem 0.55rem',
            }}
          >
            {!trendNeutral && (
              <TrendIcon size={12} color={trendColor} strokeWidth={2.5} />
            )}
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: trendColor,
                lineHeight: 1,
              }}
            >
              {trendNeutral ? '—' : `${trendPositive ? '+' : ''}${trend}%`}
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <p
        style={{
          marginTop: '1rem',
          marginBottom: '0.25rem',
          fontSize: sizing.valueFontSize,
          fontWeight: sizing.valueFontWeight,
          color: '#111827',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          fontFamily: 'inherit',
        }}
      >
        {prefix && (
          <span style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.7 }}>
            {prefix}
          </span>
        )}
        {value}
        {suffix && (
          <span style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.7, marginLeft: '0.15rem' }}>
            {suffix}
          </span>
        )}
      </p>

      {/* Label */}
      <p
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#6B7280',
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>

      {/* Trend label */}
      {trendLabel && (
        <p
          style={{
            marginTop: '0.35rem',
            fontSize: '0.75rem',
            color: '#9CA3AF',
            lineHeight: 1.4,
          }}
        >
          {trendLabel}
        </p>
      )}
    </div>
  );
}

export default StatCard;
