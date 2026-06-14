'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, generateAvatar, getAvatarColor } from '@/lib/utils';
import {
  Zap, Menu, X, Bell, ChevronDown, User, Trophy, LogOut,
  LayoutDashboard, BookOpen, FileText, Code2, Building2, BarChart3,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/practice',   label: 'Practice',   icon: BookOpen },
  { href: '/mock-tests', label: 'Mock Tests', icon: FileText },
  { href: '/coding',     label: 'Coding',     icon: Code2 },
  { href: '/companies',  label: 'Companies',  icon: Building2 },
  { href: '/analytics',  label: 'Analytics',  icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close on route change ── */
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor    = user ? getAvatarColor(user.name) : 'from-[#2563EB] to-[#7C3AED]';

  return (
    <header
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E4E7EC] transition-shadow duration-300',
        scrolled && 'shadow-sm',
      )}
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <motion.div
              className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm"
              whileHover={{ scale: 1.07, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Zap size={17} className="text-white" fill="white" />
            </motion.div>
            <span className="hidden sm:block font-bold text-[15px] text-[#111827] tracking-tight">
              CareerCracker{' '}
              <span className="text-[#2563EB]">AI</span>
            </span>
          </Link>

          {/* ── Desktop nav (authenticated) ── */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                    isActive(href)
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF]',
                  )}
                >
                  <Icon size={14} strokeWidth={isActive(href) ? 2.2 : 2} />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full border-2 border-white" />
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={() => setUserMenuOpen(v => !v)}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#E4E7EC] transition-all duration-150"
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0',
                        avatarColor,
                      )}
                    >
                      {avatarInitials}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-[#111827] max-w-[88px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={13}
                      className={cn(
                        'text-[#9CA3AF] transition-transform duration-200',
                        userMenuOpen && 'rotate-180',
                      )}
                    />
                  </motion.button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {userMenuOpen && (
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
                        {/* User info block */}
                        <div className="px-4 py-3.5 bg-[#F8FAFF] border-b border-[#E4E7EC]">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0',
                                avatarColor,
                              )}
                            >
                              {avatarInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#111827] truncate">{user?.name}</p>
                              <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user?.email}</p>
                              {user?.score !== undefined && (
                                <p className="text-xs font-semibold text-[#7C3AED] mt-0.5">
                                  {user.score} pts
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="py-1">
                          {[
                            { href: '/profile',     icon: User,   label: 'My Profile' },
                            { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] hover:text-[#2563EB] transition-colors duration-100"
                            >
                              <Icon size={15} className="text-[#9CA3AF]" />
                              {label}
                            </Link>
                          ))}
                        </div>

                        {/* Sign out */}
                        <div className="border-t border-[#E4E7EC] py-1">
                          <button
                            type="button"
                            onClick={() => { setUserMenuOpen(false); logout(); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-red-50 transition-colors duration-100 w-full text-left"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(v => !v)}
                  className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              /* Unauthenticated CTA */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#2563EB] transition-colors duration-150"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-glow px-5 py-2 text-sm font-bold rounded-xl text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile slide-down menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[#E4E7EC] bg-white"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
                    isActive(href)
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF]',
                  )}
                >
                  <Icon size={17} strokeWidth={isActive(href) ? 2.2 : 2} />
                  {label}
                </Link>
              ))}

              <div className="pt-2 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#DC2626] w-full text-left rounded-xl hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
