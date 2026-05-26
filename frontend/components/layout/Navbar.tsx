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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const avatarInitials = user ? generateAvatar(user.name) : 'U';
  const avatarColor = user ? getAvatarColor(user.name) : 'from-purple-500 to-blue-500';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Zap size={18} className="text-white" fill="white" />
            </motion.div>
            <span className="font-extrabold text-lg gradient-text-purple hidden sm:block">
              CareerCracker AI
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(href)
                      ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_12px_rgba(124,58,237,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
                </motion.button>

                {/* User menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold',
                      avatarColor
                    )}>
                      {avatarInitials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn('text-slate-400 transition-transform', userMenuOpen && 'rotate-180')}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 glass-card border border-white/10 overflow-hidden z-50"
                        style={{ background: 'rgba(15, 15, 26, 0.95)', backdropFilter: 'blur(20px)' }}
                      >
                        {/* User info */}
                        <div className="p-4 border-b border-white/5">
                          <p className="font-semibold text-white text-sm">{user?.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5 truncate">{user?.email}</p>
                          {user?.score !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-slate-500">Score:</span>
                              <span className="text-xs font-semibold text-purple-400">{user.score}</span>
                            </div>
                          )}
                        </div>

                        {/* Menu items */}
                        {[
                          { href: '/profile', icon: User, label: 'My Profile' },
                          { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Icon size={16} className="text-slate-400" />
                            {label}
                          </Link>
                        ))}

                        <div className="border-t border-white/5">
                          <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-glow px-4 py-2 text-sm font-semibold rounded-xl text-white"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
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
            className="md:hidden border-t border-white/5 overflow-hidden"
            style={{ background: 'rgba(10, 10, 15, 0.98)', backdropFilter: 'blur(20px)' }}
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive(href)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 w-full"
                >
                  <LogOut size={18} />
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
