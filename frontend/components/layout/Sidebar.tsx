'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, generateAvatar, getAvatarColor } from '@/lib/utils';
import {
  Zap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Code2,
  Building2,
  BarChart3,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Star,
  LogOut,
  X,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/practice',   label: 'Practice',     icon: BookOpen },
  { href: '/mock-tests', label: 'Mock Tests',   icon: FileText },
  { href: '/coding',     label: 'Coding Arena', icon: Code2 },
  { href: '/companies',  label: 'Companies',    icon: Building2 },
  { href: '/analytics',  label: 'Analytics',    icon: BarChart3 },
  { href: '/leaderboard',label: 'Leaderboard',  icon: Trophy },
];

export const SIDEBAR_EXPANDED = 260;
export const SIDEBAR_COLLAPSED = 72;

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapsed, mobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-[#2563EB] to-[#7C3AED]';

  return (
    <aside
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={cn(
        'h-full flex flex-col bg-white border-r border-[#E4E7EC] overflow-hidden',
        mobile
          ? 'w-[260px] fixed inset-y-0 left-0 z-50'
          : cn(
              'hidden md:flex shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
              collapsed ? 'w-[72px]' : 'w-[260px]'
            )
      )}
    >
      {/* ── Logo / header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#E4E7EC] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 shrink-0 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={17} className="text-white" fill="white" />
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-[14px] text-[#111827] whitespace-nowrap truncate"
              >
                CareerCracker <span className="text-[#2563EB]">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex items-center gap-1">
          {mobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150 shrink-0 md:hidden"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          )}
          {!mobile && (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150 shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={15} strokeWidth={2.2} /> : <ChevronLeft size={15} strokeWidth={2.2} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={mobile ? onCloseMobile : undefined}
              className={cn(
                'relative flex items-center gap-3 py-2.5 rounded-lg text-[13px] font-semibold',
                'transition-all duration-150 group',
                collapsed ? 'justify-center px-2' : 'px-3',
                active
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border-l-[3px] border-[#2563EB]'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#2563EB] border-l-[3px] border-transparent'
              )}
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.2 : 2}
                className={cn(
                  'shrink-0 transition-colors duration-150',
                  active ? 'text-[#1D4ED8]' : 'text-[#9CA3AF] group-hover:text-[#2563EB]'
                )}
              />

              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    key="label"
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

              {collapsed && (
                <div
                  className={cn(
                    'pointer-events-none absolute left-full ml-3 z-50',
                    'px-2.5 py-1.5 rounded-lg',
                    'bg-[#111827] text-white text-xs font-semibold whitespace-nowrap',
                    'opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0',
                    'transition-all duration-150 shadow-lg'
                  )}
                >
                  {label}
                  <span
                    className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111827]"
                    style={{ marginRight: '-1px' }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User card ─────────────────────────────────────────────────── */}
      <div className="border-t border-[#E4E7EC] p-3 shrink-0">
        {user && (
          collapsed && !mobile ? (
            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={logout}
                className={cn(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  'text-white text-xs font-bold shrink-0 cursor-pointer',
                  'hover:ring-2 hover:ring-[#2563EB]/30 transition-all duration-150',
                  avatarColor
                )}
                title="Sign out"
              >
                {avatarInitials}
              </button>
              <div
                className={cn(
                  'pointer-events-none absolute left-full ml-3 bottom-0 z-50',
                  'px-2.5 py-1.5 rounded-lg',
                  'bg-[#111827] text-white text-xs font-semibold whitespace-nowrap',
                  'opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0',
                  'transition-all duration-150 shadow-lg'
                )}
              >
                Sign out
              </div>
            </div>
          ) : (
            <div
              className="bg-white rounded-xl border border-[#E4E7EC] p-3 flex items-center gap-3"
              style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06)' }}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  'text-white text-xs font-bold shrink-0',
                  avatarColor
                )}
              >
                {avatarInitials}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#111827] text-sm font-bold truncate leading-tight">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={10} className="text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-amber-700 text-xs font-semibold">{user.score ?? 0} pts</span>
                  {user.rank && <span className="text-[#9CA3AF] text-xs">· #{user.rank}</span>}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-red-50 transition-colors duration-150 shrink-0 cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          )
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
