'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, generateAvatar, getAvatarColor } from '@/lib/utils';
import { ChevronDown, User, Trophy, LogOut } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const initials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-[#2563EB] to-[#7C3AED]';

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#E4E7EC] transition-all duration-150 cursor-pointer"
        aria-label="Account menu"
      >
        <div
          className={cn(
            'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0',
            avatarColor
          )}
        >
          {initials}
        </div>
        <span className="hidden lg:block text-sm font-semibold text-[#111827] max-w-[88px] truncate">
          {user?.name?.split(' ')[0]}
        </span>
        <ChevronDown
          size={13}
          className={cn('text-[#9CA3AF] transition-transform duration-200', open && 'rotate-180')}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-60 bg-white border border-[#E4E7EC] rounded-2xl shadow-lg overflow-hidden z-50"
            style={{
              boxShadow: '0 8px 32px rgba(17,24,39,0.10), 0 1.5px 6px rgba(17,24,39,0.06)',
            }}
          >
            <div className="px-4 py-3.5 bg-[#F8FAFF] border-b border-[#E4E7EC]">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0',
                    avatarColor
                  )}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#111827] truncate">{user?.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user?.email}</p>
                  {user?.score !== undefined && (
                    <p className="text-xs font-semibold text-[#7C3AED] mt-0.5">{user.score} pts</p>
                  )}
                </div>
              </div>
            </div>

            <div className="py-1">
              {[
                { href: '/profile', icon: User, label: 'My Profile' },
                { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition-colors duration-100"
                >
                  <Icon size={15} className="text-[#9CA3AF]" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-[#E4E7EC] py-1">
              <button
                type="button"
                onClick={() => { setOpen(false); logout(); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-red-50 transition-colors duration-100 w-full text-left cursor-pointer"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;
