'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Zap, BookOpen, FileText, Code2, BarChart3, Building2, Trophy,
  ArrowRight, Star, CheckCircle, Users, Target, Award, ChevronRight,
  Brain, Shield, Clock, TrendingUp, Sparkles, Play
} from 'lucide-react';

// ==================== COUNT-UP HOOK ====================
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const inViewRef = useRef(false);

  const animate = (startTime: number) => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setCount(Math.round(start + (end - start) * eased));
    if (progress < 1) requestAnimationFrame(() => animate(startTime));
  };

  const trigger = () => {
    if (!inViewRef.current) {
      inViewRef.current = true;
      animate(Date.now());
    }
  };

  return { count, trigger };
}

// ==================== STAT COUNTER ====================
function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { count, trigger } = useCountUp(value);

  useEffect(() => {
    if (inView) trigger();
  }, [inView, trigger]);

  return (
    <div ref={ref} className="text-center px-6 py-4">
      <div className="text-4xl md:text-5xl font-black gradient-text mb-2 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </div>
  );
}

// ==================== FEATURE CARD ====================
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card-hover p-6 relative group cursor-default"
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: color }}
      />

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}20`, border: `1px solid ${color}30` }}
      >
        <Icon size={24} className="text-white" style={{ color }} />
      </div>

      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ==================== COMPANY BADGE ====================
function CompanyBadge({ name, color }: { name: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="px-5 py-2.5 rounded-full border text-sm font-semibold tracking-wide cursor-default"
      style={{
        background: `${color}15`,
        borderColor: `${color}30`,
        color: color,
      }}
    >
      {name}
    </motion.div>
  );
}

const companies = [
  { name: 'TCS', color: '#0a6ed1' },
  { name: 'Infosys', color: '#007CC3' },
  { name: 'Wipro', color: '#39A7E1' },
  { name: 'HCL', color: '#E64C1F' },
  { name: 'Accenture', color: '#A100FF' },
  { name: 'Cognizant', color: '#0033A0' },
  { name: 'Capgemini', color: '#0070AD' },
];

const features = [
  {
    icon: BookOpen,
    title: 'Aptitude Practice',
    description: 'Master Quantitative Aptitude, Logical Reasoning, and Verbal Ability with 10,000+ curated questions across all difficulty levels.',
    color: '#7c3aed',
  },
  {
    icon: FileText,
    title: 'Mock Tests',
    description: 'Simulate real company tests with timed, proctored mock exams. Company-specific test patterns for TCS, Infosys, Wipro and more.',
    color: '#2563eb',
  },
  {
    icon: Code2,
    title: 'Coding Arena',
    description: 'Practice coding problems in our browser-based IDE supporting C++, Java, Python, and JavaScript with instant feedback.',
    color: '#06b6d4',
  },
  {
    icon: Brain,
    title: 'AI Analytics',
    description: 'Get personalized insights into your weak areas. AI-powered recommendations help you focus on topics that matter most.',
    color: '#10b981',
  },
  {
    icon: Building2,
    title: 'Company Prep',
    description: 'Dedicated preparation guides for each major IT company with test patterns, sample questions, and proven strategies.',
    color: '#f59e0b',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete with students across India. Track your rank, celebrate achievements, and stay motivated with gamified learning.',
    color: '#ec4899',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Free Account',
    description: 'Sign up in 30 seconds. No credit card needed. Get instant access to 500+ free practice questions.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Practice & Test',
    description: 'Take topic-wise practice, company-specific mock tests, and track your performance with detailed analytics.',
    icon: Target,
  },
  {
    number: '03',
    title: 'Crack Placement',
    description: 'Use AI-powered insights to focus on weak areas, improve your score, and land your dream job.',
    icon: Award,
  },
];

const companyDetails = [
  { name: 'TCS', pattern: 'Numerical, Verbal, Logical + Coding', duration: '3h 30min', tag: 'NQT Based' },
  { name: 'Infosys', pattern: 'Quant, Logical, Verbal + PseudoCode', duration: '2h 45min', tag: 'InfyTQ' },
  { name: 'Wipro', pattern: 'Aptitude + Essay Writing + Interview', duration: '3h', tag: 'NLTH' },
  { name: 'HCL', pattern: 'Quant, Reasoning, Verbal + Technical', duration: '2h 30min', tag: 'TechBee' },
  { name: 'Accenture', pattern: 'Cognitive + Technical + Coding', duration: '3h', tag: 'Accenture Assoc.' },
  { name: 'Cognizant', pattern: 'Aptitude + Reasoning + Coding', duration: '2h 15min', tag: 'GenC' },
  { name: 'Capgemini', pattern: 'Pseudo-code + Quant + LR + Essay', duration: '3h 15min', tag: 'SVAR' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'VIT Vellore, CSE 2024',
    quote: 'CareerCracker AI helped me go from 45% to 92% in TCS NQT mock tests within 3 weeks. The pattern-specific questions are spot on!',
    rating: 5,
    company: 'Placed at TCS',
    avatar: 'PS',
    color: 'from-purple-500 to-blue-500',
  },
  {
    name: 'Rahul Verma',
    college: 'NIT Trichy, ECE 2024',
    quote: 'The AI analytics told me exactly where I was going wrong. Fixed my weak topics in Permutation & Combination and cracked Infosys!',
    rating: 5,
    company: 'Placed at Infosys',
    avatar: 'RV',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Anjali Patel',
    college: 'BITS Pilani, CS 2024',
    quote: 'The mock test experience is identical to the real exam. Timer, anti-cheating, question palette — everything is perfect!',
    rating: 5,
    company: 'Placed at Accenture',
    avatar: 'AP',
    color: 'from-emerald-500 to-teal-500',
  },
];

// ==================== MAIN COMPONENT ====================
export default function LandingPage() {
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background effects */}
        <div className="absolute inset-0 hero-gradient" />
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-16 w-16 h-16 rounded-2xl opacity-20 border border-purple-500/50 hidden lg:block"
          style={{ background: 'rgba(124, 58, 237, 0.1)' }}
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-20 w-10 h-10 rounded-xl opacity-30 border border-blue-500/50 hidden lg:block"
          style={{ background: 'rgba(37, 99, 235, 0.1)' }}
        />
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 left-24 w-8 h-8 rounded-lg opacity-25 border border-cyan-500/50 hidden lg:block"
          style={{ background: 'rgba(6, 182, 212, 0.1)' }}
        />
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-1/4 right-32 w-14 h-14 rounded-2xl opacity-20 border border-emerald-500/50 hidden lg:block"
          style={{ background: 'rgba(16, 185, 129, 0.1)' }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8"
          >
            <Sparkles size={14} className="text-yellow-400" />
            Trusted by 50,000+ Engineering Students
            <ChevronRight size={14} />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          >
            <span className="text-white">Crack Your</span>
            <br />
            <motion.span
              className="gradient-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399, #a78bfa)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Placement
            </motion.span>
            <br />
            <span className="text-white">With AI</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The #1 AI-powered aptitude preparation platform. Master TCS NQT, Infosys, Wipro, and
            Accenture tests with 10,000+ practice questions, realistic mock tests, and personalized analytics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/auth/register">
              <motion.button
                className="btn-glow flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={20} fill="white" />
                Start For Free
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <motion.button
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={16} className="text-purple-400" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Companies row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-slate-500 text-sm mb-4 font-medium">Prepare for top companies</p>
            <div className="flex flex-wrap justify-center gap-3">
              {companies.map(company => (
                <CompanyBadge key={company.name} {...company} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="py-8 border-y border-white/5" style={{ background: 'rgba(15, 15, 26, 0.8)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-white/5">
            <StatCounter value={50000} label="Students Enrolled" suffix="+" />
            <StatCounter value={10000} label="Practice Questions" suffix="+" />
            <StatCounter value={100} label="Companies Covered" suffix="+" />
            <StatCounter value={95} label="Success Rate" suffix="%" />
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
              Everything You Need to
              <br />
              <span className="gradient-text">Crack Placements</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete ecosystem for campus placement preparation — from practice to final offer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 px-4" style={{ background: 'rgba(15, 15, 26, 0.5)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400 text-lg">Three simple steps to placement success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5"
              style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))' }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="relative inline-flex">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))',
                      border: '1px solid rgba(124,58,237,0.4)',
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <step.icon size={28} className="text-purple-400" />
                  </motion.div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xs font-black text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== COMPANY PREP ==================== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Company Prep</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
              Company-Specific
              <br />
              <span className="gradient-text">Preparation</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tailored preparation for each company&apos;s unique test pattern and requirements
            </p>
          </motion.div>

          {/* TCS Featured Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 mb-6 border border-blue-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, #0a6ed1, transparent)' }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black" style={{ color: '#0a6ed1' }}>TCS</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full">
                    ⭐ Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">TCS National Qualifier Test (NQT)</h3>
                <p className="text-slate-400 text-sm mb-4">
                  India&apos;s largest campus recruitment drive. Numerical Ability, Verbal Ability, Reasoning Ability + Programming Logic & Coding sections.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['3h 30min', '4 Sections', '82 Questions', 'High Competition'].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/companies/tcs">
                <motion.button
                  className="btn-glow px-6 py-3 rounded-xl text-white font-semibold whitespace-nowrap flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Prepare for TCS
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Other companies grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyDetails.slice(1).map((company, i) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card-hover p-5 cursor-pointer"
              >
                <Link href={`/companies/${company.name.toLowerCase()}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl font-black text-white">{company.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      {company.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">{company.pattern}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{company.duration}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 px-4" style={{ background: 'rgba(15, 15, 26, 0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
              Students Who{' '}
              <span className="gradient-text">Cracked It</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.college}</p>
                    <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <CheckCircle size={10} />
                      {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(37,99,235,0.2) 50%, rgba(6,182,212,0.15) 100%)',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
            />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl mb-6 inline-block"
              >
                🚀
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to Crack Your
                <br />
                <span className="gradient-text">Dream Placement?</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ students already preparing smarter. Start free today — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <motion.button
                    className="btn-glow px-10 py-4 text-base font-bold rounded-2xl text-white flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap size={20} fill="white" />
                    Start Preparing Now
                  </motion.button>
                </Link>
                <Link href="/auth/login">
                  <button className="px-10 py-4 text-base font-semibold rounded-2xl text-slate-300 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                    Already have an account?
                  </button>
                </Link>
              </div>
              <p className="mt-6 text-slate-500 text-sm">
                <CheckCircle size={14} className="inline mr-1 text-emerald-400" />
                500+ free questions &nbsp;·&nbsp;
                <CheckCircle size={14} className="inline mr-1 text-emerald-400" />
                No credit card &nbsp;·&nbsp;
                <CheckCircle size={14} className="inline mr-1 text-emerald-400" />
                Instant access
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/5 py-12 px-4" style={{ background: 'rgba(10, 10, 15, 0.9)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap size={18} className="text-white" fill="white" />
                </div>
                <span className="font-extrabold text-lg gradient-text-purple">CareerCracker AI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                The ultimate AI-powered aptitude preparation platform for engineering students targeting top IT companies.
              </p>
              <div className="mt-4 flex gap-3">
                {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                  <button key={s} className="text-xs text-slate-500 hover:text-purple-400 transition-colors">{s}</button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Practice', href: '/practice' },
                  { label: 'Mock Tests', href: '/mock-tests' },
                  { label: 'Coding Arena', href: '/coding' },
                  { label: 'Leaderboard', href: '/leaderboard' },
                  { label: 'Analytics', href: '/analytics' },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Companies</h4>
              <ul className="space-y-2">
                {companies.map(c => (
                  <li key={c.name}>
                    <Link
                      href={`/companies/${c.name.toLowerCase()}`}
                      className="text-slate-400 hover:text-purple-400 text-sm transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 CareerCracker AI · careercracker.ai · All rights reserved
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
                <button key={link} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
