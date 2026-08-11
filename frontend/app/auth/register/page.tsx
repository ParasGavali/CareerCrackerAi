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
import { buttonVariants } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  Zap, Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap,
  ArrowRight, CheckCircle, BookOpen, Trophy, BarChart3,
} from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  college: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
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
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: '#DC2626' };
  if (score <= 2) return { score, label: 'Weak', color: '#D97706' };
  if (score <= 3) return { score, label: 'Fair', color: '#B45309' };
  if (score <= 4) return { score, label: 'Strong', color: '#059669' };
  return { score, label: 'Very Strong', color: '#0369A1' };
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
      const { accessToken, refreshToken } = response.data.data;
      saveTokens(accessToken, refreshToken);
      await login(data.email, data.password);
      toast.success('Account created! Welcome to CareerCracker AI 🚀');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } } };
      const validationError = error?.response?.data?.errors?.[0]?.message;
      toast.error(validationError || error?.response?.data?.message || 'Registration failed. Please try again.');
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
        className="flex-1 overflow-y-auto flex items-start justify-center p-8 lg:p-16"
        style={{ backgroundColor: '#F8FAFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-md py-8"
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
              <h1 className="text-2xl font-black text-[#111827]">Create your account</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Start your placement preparation for free
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      {...register('name')}
                      placeholder="Rahul Sharma"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      {...register('phone')}
                      placeholder="9876543210"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* College + Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>College</label>
                  <div className="relative">
                    <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      {...register('college')}
                      placeholder="VIT Vellore"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Department</label>
                  <input
                    {...register('department')}
                    placeholder="CSE / ECE / IT"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Batch */}
              <div>
                <label className={labelClass}>Graduation Year</label>
                <select
                  {...register('batch')}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Select year</option>
                  {['2024', '2025', '2026', '2027', '2028'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className={`${inputClass} pl-10 pr-10`}
                    onChange={e => setPassword(e.target.value)}
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
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">{errors.password.message}</p>
                )}

                {/* Password strength */}
                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : '#E4E7EC' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-start gap-2.5">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    id="terms"
                    className="mt-0.5 w-4 h-4 rounded border-[#E4E7EC] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer accent-[#2563EB]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-[#6B7280] font-medium leading-snug cursor-pointer select-none"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1.5 text-xs text-[#DC2626] font-semibold">{errors.terms.message}</p>
                )}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-[#6B7280] font-medium">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors"
              >
                Sign in
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
