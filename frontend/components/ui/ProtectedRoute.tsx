'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { ShieldOff } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?next=${window.location.pathname}`);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <LoadingSpinner size="xl" text="Verifying access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-12 text-center max-w-md mx-auto shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]">
          <div className="w-20 h-20 bg-red-50 border border-[#FECACA] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={40} className="text-[#DC2626]" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] mb-2">Access Denied</h1>
          <p className="text-[#6B7280] mb-6">
            You don&apos;t have permission to access this page.
            {requiredRole === 'admin' && ' Admin privileges are required.'}
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
