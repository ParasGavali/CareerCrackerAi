'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Zap, Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap,
  ArrowRight, CheckCircle, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
  college: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
  if (score <= 2) return { score, label: 'Weak', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'Fair', color: '#eab308' };
  if (score <= 4) return { score, label: 'Strong', color: '#10b981' };
  return { score, label: 'Very Strong', color: '#06b6d4' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const strength = getPasswordStrength(password);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { authApi } = await import('@/lib/api');
      const { saveTokens } = await import('@/lib/auth');
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        college: data.college,
        department: data.department,
        batch: data.batch,
      });
      saveTokens(response.data.token, response.data.refreshToken);
      await login(data.email, data.password);
      toast.success('Account created! Welcome to CareerCracker AI 🚀');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-2/5 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.1) 100%)' }}
      >
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />

        <div className="relative z-10 flex items-center gap-2 mb-16">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="font-extrabold text-xl gradient-text-purple">CareerCracker AI</span>
        </div>

        <div className="relative z-10 flex-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Join 50,000+
              <br />
              <span className="gradient-text">Future Professionals</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Start your placement preparation journey today with our comprehensive AI-powered platform.
            </p>

            <div className="space-y-3">
              {[
                '✅ Free access to 500+ practice questions',
                '✅ Mock tests for TCS, Infosys, and more',
                '✅ Personalized AI study recommendations',
                '✅ Compete on national leaderboard',
                '✅ Track your progress with detailed analytics',
              ].map(item => (
                <p key={item} className="text-slate-300 text-sm">{item}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Did you know?</p>
              <p className="text-slate-400 text-xs mt-1">
                Students who practice with our platform score 40% higher in placement tests on average.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg py-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-lg gradient-text-purple">CareerCracker AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create Your Account</h1>
            <p className="text-slate-400">Start your placement preparation for free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register('name')}
                    placeholder="Rahul Sharma"
                    className="input-field neon-focus pl-10 text-sm"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register('phone')}
                    placeholder="+91 9876543210"
                    className="input-field neon-focus pl-10 text-sm"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field neon-focus pl-10 text-sm"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">College</label>
                <div className="relative">
                  <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    {...register('college')}
                    placeholder="VIT Vellore"
                    className="input-field neon-focus pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
                <input
                  {...register('department')}
                  placeholder="CSE / ECE / IT"
                  className="input-field neon-focus text-sm"
                />
              </div>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Graduation Year</label>
              <select
                {...register('batch')}
                className="input-field neon-focus text-sm"
              >
                <option value="">Select year</option>
                {['2024', '2025', '2026', '2027', '2028'].map(y => (
                  <option key={y} value={y} style={{ background: '#12121f' }}>{y}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="input-field neon-focus pl-10 pr-10 text-sm"
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}

              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength.score ? strength.color : 'rgba(30,30,58,0.8)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="input-field neon-focus pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-start gap-2">
                <input
                  {...register('terms')}
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 leading-snug">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-glow w-full py-3.5 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-70"
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
