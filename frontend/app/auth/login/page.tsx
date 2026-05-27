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
import toast from 'react-hot-toast';
import {
  Zap, Eye, EyeOff, Mail, Lock, ArrowRight,
  BookOpen, Trophy, BarChart3, CheckCircle
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

  return (
    <div className="min-h-screen flex bg-surface text-on-surface font-body-md">
      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 relative overflow-hidden bg-surface-container border-r border-outline-variant/30">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 74, 198, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 74, 198, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="font-extrabold text-xl text-primary">CareerCracker AI</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl font-black text-on-surface mb-4 leading-tight">
              Your Placement
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-black">Journey Starts Here</span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg mb-10 leading-relaxed">
              Join 50,000+ students preparing for TCS, Infosys, Wipro, and more with AI-powered analytics.
            </p>

            <div className="space-y-4">
              {[
                { icon: BookOpen, text: '10,000+ practice questions across all topics', color: '#004ac6' },
                { icon: Trophy, text: 'Company-specific mock tests with real patterns', color: '#712ae2' },
                { icon: BarChart3, text: 'AI-powered weakness detection & recommendations', color: '#004ac6' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-on-surface-variant text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '50K+', label: 'Students' },
            { value: '95%', label: 'Success Rate' },
            { value: '100+', label: 'Companies' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest ambient-shadow">
              <div className="text-2xl font-black text-primary">{value}</div>
              <div className="text-on-surface-variant text-xs font-semibold mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-xl text-primary">CareerCracker AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-on-surface mb-2">Welcome back 👋</h1>
            <p className="text-on-surface-variant font-semibold">Sign in to continue your preparation journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 pl-10 text-sm text-on-surface focus:outline-none focus:border-primary transition-all shadow-sm font-medium"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-on-surface-variant">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline transition-colors font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-on-surface focus:outline-none focus:border-primary transition-all shadow-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 rounded border-outline-variant/60 bg-surface text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-on-surface-variant font-semibold cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-glow w-full py-3.5 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm"
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
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant font-semibold">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-bold transition-colors">
              Create free account
            </Link>
          </p>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <div className="flex flex-wrap gap-3 justify-center">
              {['Free Forever', 'No Credit Card', '500+ Questions'].map(f => (
                <span key={f} className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
                  <CheckCircle size={10} className="text-emerald-600" />
                  {f}
                </span>
              ))}
            </div>
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
