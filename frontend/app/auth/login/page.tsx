'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buttonVariants } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  Zap, Eye, EyeOff, Mail, Lock, ArrowRight,
  CheckCircle, BookOpen, Trophy, BarChart3,
} from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = searchParams.get('next') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! 🎉');
      router.push(nextPath);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full border border-[#E4E7EC] rounded-xl px-4 py-3 bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none text-sm font-medium transition-all';

  const labelClass = 'text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2 block';

  const bullets = [
    { icon: BookOpen, text: '10,000+ curated practice questions' },
    { icon: Trophy, text: 'Company-specific mock tests' },
    { icon: BarChart3, text: 'AI-powered analytics' },
  ];

  const stats = [
    { value: '50K+', label: 'Students' },
    { value: '95%', label: 'Success' },
    { value: '100+', label: 'Companies' },
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ===== LEFT PANEL ===== */}
      <div
        className="hidden lg:flex flex-col w-[45%] relative overflow-hidden"
        style={{ backgroundColor: '#2563EB' }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Glow blob */}
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(64px)' }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              CareerCracker AI
            </span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
            >
              <h2 className="font-black text-4xl text-white leading-tight mb-5">
                Your Success Story<br />Starts Here
              </h2>

              <div className="space-y-4 mb-12">
                {bullets.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="text-center p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
              >
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-white/70 text-xs font-semibold mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div
        className="flex-1 flex items-center justify-center p-8 lg:p-16"
        style={{ backgroundColor: '#F8FAFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-lg text-[#2563EB] tracking-tight">
              CareerCracker AI
            </span>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-2xl p-10 w-full"
            style={{
              border: '1.5px solid #E4E7EC',
              boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)',
            }}
          >
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#111827]">Welcome back</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Sign in to continue your preparation journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelClass} mb-0`}>Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-[#E4E7EC] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer accent-[#2563EB]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-[#6B7280] font-medium cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'w-full' })}
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-[#6B7280] font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {['Free Forever', 'No Credit Card', 'Instant Access'].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-xs text-[#6B7280] font-semibold"
              >
                <CheckCircle size={11} className="text-[#059669]" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="xl" fullScreen text="Loading..." />}>
      <LoginForm />
    </Suspense>
  );
}
