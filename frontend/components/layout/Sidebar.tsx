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
  activePath?: string;
}

export function Sidebar({ className, activePath }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-[#004ac6] to-[#712ae2]';

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col',
        'border-r border-[#c3c6d7]/40 bg-white',
        'shadow-[1px_0_0_0_rgba(195,198,215,0.3)]',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#c3c6d7]/30 h-16">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 flex-shrink-0 bg-[#004ac6] rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={17} className="text-white" fill="white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-extrabold text-[13.5px] text-[#191c1e] whitespace-nowrap leading-tight"
              >
                CareerCracker <span className="text-[#004ac6]">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#737686] hover:text-[#004ac6] hover:bg-[#f2f4f6] transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative',
                active
                  ? 'bg-[#004ac6]/8 text-[#004ac6] border-l-[3px] border-[#004ac6]'
                  : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#f2f4f6] border-l-[3px] border-transparent'
              )}
            >
              <Icon
                size={17}
                className={cn('flex-shrink-0 transition-colors', active ? 'text-[#004ac6]' : 'text-[#737686] group-hover:text-[#004ac6]')}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#191c1e] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile card */}
      <div className="border-t border-[#c3c6d7]/30 p-3">
        {user && (
          <div className={cn(
            'rounded-xl p-3 bg-[#f7f9fb] border border-[#c3c6d7]/40',
            'flex items-center gap-3'
          )}>
            <div className={cn(
              'w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
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
                  transition={{ duration: 0.1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-[#191c1e] text-sm font-bold truncate">{user.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-amber-700 text-xs font-semibold">{user.score || 0} pts</span>
                    {user.rank && (
                      <span className="text-[#737686] text-xs">· #{user.rank}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 text-[#737686] hover:text-red-600 transition-colors flex-shrink-0 rounded-lg hover:bg-red-50"
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
