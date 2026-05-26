import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// ==================== CN UTILITY ====================
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ==================== TIME FORMATTING ====================
export function formatTime(seconds: number): string {
  if (seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeFromMs(ms: number): string {
  return formatTime(Math.floor(ms / 1000));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

// ==================== DATE FORMATTING ====================
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy • h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ==================== SCORE & GRADE ====================
export function calculateGrade(percentage: number): string {
  if (percentage >= 95) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B+';
  if (percentage >= 65) return 'B';
  if (percentage >= 55) return 'C';
  if (percentage >= 45) return 'D';
  return 'F';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
  if (score >= 60) return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
  if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
  return 'bg-red-500/20 border-red-500/30 text-red-400';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A+': return 'text-emerald-400';
    case 'A': return 'text-green-400';
    case 'B+': return 'text-blue-400';
    case 'B': return 'text-indigo-400';
    case 'C': return 'text-yellow-400';
    case 'D': return 'text-orange-400';
    default: return 'text-red-400';
  }
}

// ==================== DIFFICULTY ====================
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'text-emerald-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
    case 'medium': return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400';
    case 'hard': return 'bg-red-500/15 border-red-500/30 text-red-400';
    default: return 'bg-slate-500/15 border-slate-500/30 text-slate-400';
  }
}

// ==================== NUMBERS ====================
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ==================== STRING ====================
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ==================== COMPANY ====================
export function getCompanyColor(company: string): string {
  const colors: Record<string, string> = {
    TCS: '#0a6ed1',
    Infosys: '#007CC3',
    Wipro: '#39A7E1',
    HCL: '#E64C1F',
    Accenture: '#A100FF',
    Cognizant: '#0033A0',
    Capgemini: '#0070AD',
  };
  return colors[company] || '#7c3aed';
}

export function getCompanySlug(company: string): string {
  return company.toLowerCase().replace(/\s+/g, '-');
}

// ==================== RANK ====================
export function getRankBadge(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (rank <= 10) return '⭐';
  if (rank <= 50) return '🔥';
  return '';
}

export function getPlacementReadinessLabel(score: number): string {
  if (score >= 90) return 'Highly Ready';
  if (score >= 75) return 'Ready';
  if (score >= 60) return 'Almost Ready';
  if (score >= 40) return 'Needs Practice';
  return 'Keep Practicing';
}

export function getPlacementReadinessColor(score: number): string {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

// ==================== CODING ====================
export function getStatusColor(status: string): string {
  switch (status) {
    case 'accepted': return 'text-emerald-400';
    case 'wrong_answer': return 'text-red-400';
    case 'time_limit_exceeded': return 'text-yellow-400';
    case 'runtime_error': return 'text-orange-400';
    case 'compilation_error': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'accepted': return 'Accepted';
    case 'wrong_answer': return 'Wrong Answer';
    case 'time_limit_exceeded': return 'Time Limit Exceeded';
    case 'runtime_error': return 'Runtime Error';
    case 'compilation_error': return 'Compilation Error';
    case 'pending': return 'Pending';
    default: return status;
  }
}

export function getLanguageExtension(language: string): string {
  const exts: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
  };
  return exts[language.toLowerCase()] || 'txt';
}

// ==================== MISC ====================
export function generateAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return initials;
}

export function getAvatarColor(name: string): string {
  const colors = [
    'from-purple-500 to-blue-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
