'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import {
  BookOpen, FileText, Code2, Brain, Building2, Trophy,
  ArrowRight, Star, CheckCircle, Users, Target, Award,
  Zap, Clock, ChevronRight, TrendingUp,
} from 'lucide-react';

/* ─────────────────────────── helpers ─────────────────────────── */

function useCountUp(end: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return { count, trigger };
}

/* ─────────────────────────── data ─────────────────────────── */

const companies = [
  { name: 'TCS', color: '#0a6ed1' },
  { name: 'Infosys', color: '#007CC3' },
  { name: 'Wipro', color: '#2196c4' },
  { name: 'HCL', color: '#E64C1F' },
  { name: 'Accenture', color: '#A100FF' },
  { name: 'Cognizant', color: '#0033A0' },
  { name: 'Capgemini', color: '#0070AD' },
];

const features = [
  {
    icon: BookOpen,
    title: 'Aptitude Practice',
    description: 'Master Quantitative Aptitude, Logical Reasoning & Verbal Ability with 10,000+ curated questions spanning every difficulty level.',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    borderHover: '#2563EB',
  },
  {
    icon: FileText,
    title: 'Mock Tests',
    description: 'Simulate real company tests with timed, proctored mock exams. Company-specific test patterns for TCS, Infosys, Wipro and more.',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    borderHover: '#7C3AED',
  },
  {
    icon: Code2,
    title: 'Coding Arena',
    description: 'Practice coding problems in our browser-based IDE supporting C++, Java, Python & JavaScript with instant AI-powered feedback.',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    borderHover: '#059669',
  },
  {
    icon: Brain,
    title: 'AI Analytics',
    description: 'Get personalized insights into your weak areas. AI-driven recommendations help you focus on the topics that impact your score most.',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    borderHover: '#2563EB',
  },
  {
    icon: Building2,
    title: 'Company Prep',
    description: 'Dedicated guides for every major IT company — test patterns, sample questions, and proven interview strategies distilled by toppers.',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    borderHover: '#7C3AED',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete with students across India. Track your rank, celebrate milestones, and stay motivated through gamified learning streaks.',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    borderHover: '#D97706',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create Account',
    description: 'Sign up in 30 seconds. No credit card needed. Get instant access to 500+ free practice questions across all topics.',
    icon: Users,
  },
  {
    number: '2',
    title: 'Practice & Test',
    description: 'Take topic-wise practice sessions, company-specific mock tests, and track your performance with detailed AI analytics.',
    icon: Target,
  },
  {
    number: '3',
    title: 'Land Your Job',
    description: 'Use AI-powered insights to sharpen weak areas, boost your score, and walk into your dream placement interview with confidence.',
    icon: Award,
  },
];

const companyCards = [
  { name: 'Infosys', slug: 'infosys', tag: 'InfyTQ', pattern: 'Quant · Logical · Verbal · PseudoCode', duration: '2h 45min', questions: 37 },
  { name: 'Wipro', slug: 'wipro', tag: 'NLTH', pattern: 'Aptitude · Essay · Coding · Interview', duration: '3h', questions: 55 },
  { name: 'HCL', slug: 'hcl', tag: 'TechBee', pattern: 'Quant · Reasoning · Verbal · Technical', duration: '2h 30min', questions: 41 },
  { name: 'Accenture', slug: 'accenture', tag: 'ASE', pattern: 'Cognitive · Technical · Coding', duration: '3h', questions: 64 },
  { name: 'Cognizant', slug: 'cognizant', tag: 'GenC', pattern: 'Aptitude · Reasoning · Coding', duration: '2h 15min', questions: 48 },
  { name: 'Capgemini', slug: 'capgemini', tag: 'Supernova', pattern: 'Aptitude · Pseudocode · Essay', duration: '2h', questions: 40 },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'VIT Vellore · CSE 2024',
    quote: 'CareerCracker AI took me from 45% to 92% on TCS NQT mock tests in just three weeks. The company-specific question patterns are incredibly accurate.',
    rating: 5,
    badge: 'Placed at TCS',
    avatar: 'PS',
    avatarBg: '#2563EB',
  },
  {
    name: 'Rahul Verma',
    college: 'NIT Trichy · ECE 2024',
    quote: 'The AI analytics pinpointed exactly where I was losing marks. Fixed my weak topics in P&C and cracked Infosys — I couldn\'t have done it without this platform.',
    rating: 5,
    badge: 'Placed at Infosys',
    avatar: 'RV',
    avatarBg: '#7C3AED',
  },
  {
    name: 'Anjali Patel',
    college: 'BITS Pilani · CS 2024',
    quote: 'The mock test experience is identical to the real exam — timer, anti-cheating, question palette, everything. Felt zero anxiety on exam day because I\'d done it 10 times already.',
    rating: 5,
    badge: 'Placed at Accenture',
    avatar: 'AP',
    avatarBg: '#059669',
  },
];

/* ─────────────────────────── stat card ─────────────────────────── */

function StatCard({
  value, suffix = '', label,
}: { value: number; suffix?: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { count, trigger } = useCountUp(value);
  useEffect(() => { if (inView) trigger(); }, [inView, trigger]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-2">
      <div className="text-5xl font-black text-[#111827] tabular-nums mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-base font-medium text-[#6B7280]">{label}</div>
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function LandingPage() {
  return (
    <div
      className="bg-[#F8FAFF] text-[#111827] antialiased overflow-x-hidden min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-52 -right-52 w-[720px] h-[720px] rounded-full opacity-[0.055]"
            style={{ background: 'radial-gradient(circle, #2563EB, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-52 -left-52 w-[720px] h-[720px] rounded-full opacity-[0.055]"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.025]"
            style={{ background: 'radial-gradient(circle, #2563EB, transparent 60%)' }}
          />
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            AI-Powered · 50,000+ Students · Free to Start
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.07] tracking-tight text-[#111827] mb-6"
          >
            Crack Your Placement{' '}
            <br className="hidden sm:block" />
            Interview{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with AI
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="text-lg text-[#6B7280] max-w-2xl mx-auto mt-6 mb-10 leading-relaxed"
          >
            The ultimate AI-driven platform for engineering students to master aptitude, coding,
            and mock tests. Practice smarter, track your growth, and get hired by top tech giants.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6"
          >
            <Link href="/auth/register">
              <Button size="lg">
                Start Free Today
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              See How It Works
              <ChevronRight size={16} />
            </Button>
          </motion.div>

          {/* trust strip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-sm text-[#9CA3AF] tracking-wide"
          >
            ✓ No credit card &nbsp;·&nbsp; ✓ 500+ free questions &nbsp;·&nbsp; ✓ Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════ COMPANIES STRIP ══════════════════════ */}
      <section className="py-14 border-y border-[#E4E7EC] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-[#9CA3AF] text-center mb-8 font-semibold">
            Used by students preparing for
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {companies.map((c, i) => (
              <motion.span
                key={c.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-xl font-black cursor-default select-none transition-transform"
                style={{ color: c.color }}
              >
                {c.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="py-20 bg-[#F8FAFF]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E4E7EC]">
            <StatCard value={50000} suffix="+" label="Students Placed" />
            <StatCard value={10000} suffix="+" label="Practice Questions" />
            <StatCard value={100} suffix="+" label="Companies Covered" />
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="py-24 bg-white border-y border-[#E4E7EC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full mb-5">
              Platform Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight mb-5">
              Everything You Need to{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Crack Placements
              </span>
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              A complete ecosystem for campus placement preparation — from daily practice to your final offer letter.
            </p>
          </motion.div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                className="group bg-white border border-[#E4E7EC] rounded-2xl p-8 cursor-default transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)]"
                style={{ transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${f.borderHover}4D`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E4E7EC')}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: f.iconBg }}
                >
                  <f.icon size={22} style={{ color: f.iconColor }} />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="py-24 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full mb-5">
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight mb-5">
              Three Steps to{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Placement Success
              </span>
            </h2>
            <p className="text-lg text-[#6B7280]">Simple, structured, and proven to work.</p>
          </motion.div>

          {/* steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+20px)] right-[calc(33%+20px)] h-px bg-gradient-to-r from-[#2563EB]/30 via-[#7C3AED]/30 to-[#2563EB]/30" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-7">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E4E7EC] shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex items-center justify-center">
                    <step.icon size={30} className="text-[#2563EB]" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ COMPANY PREP ══════════════════════ */}
      <section className="py-24 bg-white border-y border-[#E4E7EC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold text-[#7C3AED] uppercase tracking-widest bg-[#F5F3FF] border border-[#DDD6FE] px-4 py-1.5 rounded-full mb-5">
              Company-Specific Prep
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight mb-5">
              Targeted Preparation for{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Every Company
              </span>
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Tailored guides, question banks and mock tests for each company&apos;s unique test pattern and interview process.
            </p>
          </motion.div>

          {/* TCS Featured Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden mb-6 rounded-2xl border border-[#BFDBFE] p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(255,255,255,1) 50%, rgba(124,58,237,0.04) 100%)',
              boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)',
            }}
          >
            {/* decorative circle */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-black text-[#0a6ed1]">TCS</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-full">
                    ⭐ Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-2">TCS National Qualifier Test (NQT)</h3>
                <p className="text-sm text-[#6B7280] mb-5 max-w-2xl leading-relaxed">
                  India&apos;s largest campus recruitment drive. Covers Numerical Ability, Verbal Ability, Reasoning Ability,
                  Programming Logic &amp; Coding — with 82 questions over 3h 30min.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['3h 30min', '4 Sections', '82 Questions', 'High Competition'].map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/companies/tcs" className="shrink-0">
                <Button size="md">
                  Prepare for TCS
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Company grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyCards.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/companies/${c.slug}`}
                  className="group block bg-white border border-[#E4E7EC] rounded-2xl p-6 hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl font-black text-[#111827] group-hover:text-[#2563EB] transition-colors">
                      {c.name}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] font-bold">
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">{c.pattern}</p>
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {c.duration}
                    </span>
                    <span className="flex items-center gap-1 text-[#2563EB] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Start Prep <ChevronRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <section className="py-24 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full mb-5">
              Success Stories
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight mb-5">
              Students Who{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Cracked It
              </span>
            </h2>
            <p className="text-lg text-[#6B7280]">Real results from real students across India.</p>
          </motion.div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-[#E4E7EC] rounded-2xl p-8 flex flex-col shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:border-[#BFDBFE] transition-all duration-300"
              >
                {/* stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-[#D97706] fill-[#D97706]" />
                  ))}
                </div>
                {/* quote */}
                <p className="text-sm text-[#6B7280] leading-relaxed italic flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* author */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#E4E7EC]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: t.avatarBg }}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111827] truncate">{t.name}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{t.college}</p>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full whitespace-nowrap">
                    <CheckCircle size={10} />
                    {t.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      <section className="py-20 bg-[#2563EB] relative overflow-hidden">
        {/* white dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* decorative glow circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-6 inline-block select-none"
            >
              🚀
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
              Join 50,000+ students preparing smarter. Start free today — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth/register">
                <button className="px-9 py-4 rounded-xl bg-white text-[#2563EB] font-bold text-base hover:bg-white/90 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Zap size={18} className="fill-[#2563EB]" />
                  Start Preparing Free
                </button>
              </Link>
            </div>
            <p className="text-sm text-white/55 tracking-wide">
              ✓ No credit card &nbsp;·&nbsp; ✓ Instant access &nbsp;·&nbsp; ✓ 500+ free questions
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
                  <Zap size={17} className="text-white fill-white" />
                </div>
                <span className="font-extrabold text-lg text-white">CareerCracker AI</span>
              </div>
              <p className="text-sm leading-relaxed text-white/45">
                Empowering engineering students to crack their dream placements through AI-powered preparation.
              </p>
            </div>

            {/* platform */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Platform</h4>
              <div className="space-y-3">
                {['Aptitude Practice', 'Mock Tests', 'Coding Arena', 'Company Prep', 'AI Analytics'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/45 hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* companies */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Companies</h4>
              <div className="space-y-3">
                {['TCS NQT', 'Infosys InfyTQ', 'Wipro NLTH', 'HCL TechBee', 'Accenture ASE', 'Cognizant GenC'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/45 hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* company */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Company</h4>
              <div className="space-y-3">
                {['About Us', 'Blog', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/45 hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/35">
              © 2025 CareerCracker AI. Empowering the next generation of engineering talent.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-white/35">
              <TrendingUp size={14} />
              <span>50,000+ students placed and counting</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
