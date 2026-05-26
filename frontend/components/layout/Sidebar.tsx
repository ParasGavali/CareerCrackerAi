'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, generateAvatar, getAvatarColor } from '@/lib/utils';
import {
  Zap, LayoutDashboard, BookOpen, FileText, Code2, Building2,
  BarChart3, Trophy, ChevronLeft, ChevronRight, Star, LogOut
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/mock-tests', label: 'Mock Tests', icon: FileText },
  { href: '/coding', label: 'Coding Arena', icon: Code2 },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-purple-500 to-blue-500';

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col',
        'border-r border-white/5',
        className
      )}
      style={{
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-extrabold text-base gradient-text-purple whitespace-nowrap"
              >
                CareerCracker AI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                active
                  ? 'bg-gradient-to-r from-purple-500/25 to-blue-500/10 text-purple-300 border-l-2 border-purple-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent'
              )}
            >
              <Icon
                size={18}
                className={cn('flex-shrink-0', active ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300')}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/5 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile card */}
      <div className="border-t border-white/5 p-3">
        {user && (
          <div className={cn(
            'rounded-xl p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/5 border border-purple-500/20',
            'flex items-center gap-3'
          )}>
            <div className={cn(
              'w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold',
              avatarColor
            )}>
              {avatarInitials}
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">{user.score || 0} pts</span>
                    {user.rank && (
                      <span className="text-slate-500 text-xs">· #{user.rank}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
