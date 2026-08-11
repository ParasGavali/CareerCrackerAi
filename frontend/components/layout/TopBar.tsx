'use client';

import Link from 'next/link';
import { Bell, Menu, Zap } from 'lucide-react';
import { UserMenu } from '@/components/layout/UserMenu';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  return (
    <header className="h-16 shrink-0 bg-white border-b border-[#E4E7EC] flex items-center gap-3 px-4 sm:px-6">
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150 cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile brand */}
      <Link href="/dashboard" className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
          <Zap size={15} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-sm text-[#111827] tracking-tight">
          CareerCracker <span className="text-[#2563EB]">AI</span>
        </span>
      </Link>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors duration-150 cursor-pointer"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full border-2 border-white" />
      </button>

      <UserMenu />
    </header>
  );
}

export default TopBar;
