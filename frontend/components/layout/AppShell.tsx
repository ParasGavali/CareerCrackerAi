'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'app' | 'focus';
  requiredRole?: 'student' | 'admin';
}

export function AppShell({ children, variant = 'app', requiredRole }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  if (variant === 'focus') {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <div className="min-h-screen bg-[#F8FAFF] text-[#111827] antialiased">{children}</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFF] text-[#111827] antialiased">
        {/* Desktop sidebar (static flex child, width synced with state) */}
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(v => !v)} />

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="absolute inset-y-0 left-0"
              >
                <Sidebar mobile collapsed={false} onCloseMobile={() => setMobileOpen(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onOpenMobileMenu={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AppShell;
