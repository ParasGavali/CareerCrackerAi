'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, generateAvatar, getAvatarColor } from '@/lib/utils';
import {
  Zap, Menu, X, Bell, ChevronDown, User, Trophy, LogOut,
  LayoutDashboard, BookOpen, FileText, Code2, Building2, BarChart3
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/mock-tests', label: 'Mock Tests', icon: FileText },
  { href: '/coding', label: 'Coding', icon: Code2 },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-[#004ac6] to-[#712ae2]';

  return (
    <header
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#c3c6d7]/40 shadow-[0_1px_8px_rgba(15,23,42,0.06)]'
          : 'bg-white border-b border-[#c3c6d7]/30'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              className="w-9 h-9 bg-[#004ac6] rounded-xl flex items-center justify-center shadow-sm"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Zap size={17} className="text-white" fill="white" />
            </motion.div>
            <span className="font-extrabold text-[15px] text-[#191c1e] hidden sm:block tracking-tight">
              CareerCracker <span className="text-[#004ac6]">AI</span>
            </span>
          </Link>

          {/* Desktop Nav (authenticated only) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                    isActive(href)
                      ? 'bg-[#004ac6]/8 text-[#004ac6]'
                      : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#004ac6]/5'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <button className="relative p-2 rounded-lg text-[#434655] hover:text-[#004ac6] hover:bg-[#004ac6]/5 transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#712ae2] rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#f2f4f6] transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                      avatarColor
                    )}>
                      {avatarInitials}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-[#191c1e] max-w-[90px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={13}
                      className={cn('text-[#737686] transition-transform', userMenuOpen && 'rotate-180')}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-[#c3c6d7]/50 rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.12)] overflow-hidden z-50"
                      >
                        {/* User info */}
                        <div className="p-4 border-b border-[#c3c6d7]/30 bg-[#f7f9fb]">
                          <p className="font-bold text-[#191c1e] text-sm">{user?.name}</p>
                          <p className="text-[#737686] text-xs mt-0.5 truncate">{user?.email}</p>
                          {user?.score !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-[#737686]">Score:</span>
                              <span className="text-xs font-bold text-[#712ae2]">{user.score}</span>
                            </div>
                          )}
                        </div>

                        {[
                          { href: '/profile', icon: User, label: 'My Profile' },
                          { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#434655] hover:bg-[#f2f4f6] hover:text-[#004ac6] transition-colors"
                          >
                            <Icon size={15} className="text-[#737686]" />
                            {label}
                          </Link>
                        ))}

                        <div className="border-t border-[#c3c6d7]/30">
                          <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 text-[#434655] hover:text-[#004ac6] rounded-lg hover:bg-[#f2f4f6] transition-colors"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-[#434655] hover:text-[#004ac6] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-glow px-5 py-2.5 text-sm font-bold rounded-xl text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#c3c6d7]/30 overflow-hidden bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                    isActive(href)
                      ? 'bg-[#004ac6]/8 text-[#004ac6]'
                      : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#f2f4f6]'
                  )}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#c3c6d7]/30">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 w-full text-left rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
}
