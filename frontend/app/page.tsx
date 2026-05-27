'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Zap, BookOpen, FileText, Code2, BarChart3, Building2, Trophy,
  ArrowRight, Star, CheckCircle, Users, Target, Award,
  Brain, Clock, Sparkles, Play, Shield, TrendingUp, ChevronRight
} from 'lucide-react';

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return { count, trigger };
}

function StatCounter({ value, label, suffix = '', icon: Icon, color }: {
  value: number; label: string; suffix?: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { count, trigger } = useCountUp(value);

  useEffect(() => { if (inView) trigger(); }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-[#c3c6d7]/40 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}14` }}>
        <Icon size={26} style={{ color }} />
      </div>
      <div className="text-4xl font-black text-[#191c1e] tabular-nums mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm font-semibold text-[#434655]">{label}</div>
    </div>
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
    color: '#712ae2',
    bg: '#712ae214',
  },
  {
    icon: FileText,
    title: 'Mock Tests',
    description: 'Simulate real company tests with timed, proctored mock exams. Company-specific test patterns for TCS, Infosys, Wipro and more.',
    color: '#004ac6',
    bg: '#004ac614',
  },
  {
    icon: Code2,
    title: 'Coding Arena',
    description: 'Practice coding problems in our browser-based IDE supporting C++, Java, Python, and JavaScript with instant feedback.',
    color: '#059669',
    bg: '#05966914',
  },
  {
    icon: Brain,
    title: 'AI Analytics',
    description: 'Get personalized insights into your weak areas. AI-powered recommendations help you focus on topics that matter most.',
    color: '#712ae2',
    bg: '#712ae214',
  },
  {
    icon: Building2,
    title: 'Company Prep',
    description: 'Dedicated preparation guides for each major IT company with test patterns, sample questions, and proven strategies.',
    color: '#004ac6',
    bg: '#004ac614',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete with students across India. Track your rank, celebrate achievements, and stay motivated with gamified learning.',
    color: '#b45309',
    bg: '#b4530914',
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
  { name: 'TCS', slug: 'tcs', pattern: 'Numerical, Verbal, Logical + Coding', duration: '3h 30min', tag: 'NQT', sections: 4, questions: 82 },
  { name: 'Infosys', slug: 'infosys', pattern: 'Quant, Logical, Verbal + PseudoCode', duration: '2h 45min', tag: 'InfyTQ', sections: 5, questions: 37 },
  { name: 'Wipro', slug: 'wipro', pattern: 'Aptitude + Essay Writing + Interview', duration: '3h', tag: 'NLTH', sections: 5, questions: 55 },
  { name: 'HCL', slug: 'hcl', pattern: 'Quant, Reasoning, Verbal + Technical', duration: '2h 30min', tag: 'TechBee', sections: 4, questions: 41 },
  { name: 'Accenture', slug: 'accenture', pattern: 'Cognitive + Technical + Coding', duration: '3h', tag: 'ASE', sections: 5, questions: 64 },
  { name: 'Cognizant', slug: 'cognizant', pattern: 'Aptitude + Reasoning + Coding', duration: '2h 15min', tag: 'GenC', sections: 4, questions: 48 },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'VIT Vellore, CSE 2024',
    quote: 'CareerCracker AI helped me go from 45% to 92% in TCS NQT mock tests within 3 weeks. The pattern-specific questions are spot on!',
    rating: 5,
    company: 'Placed at TCS',
    avatar: 'PS',
    avatarBg: '#004ac6',
  },
  {
    name: 'Rahul Verma',
    college: 'NIT Trichy, ECE 2024',
    quote: 'The AI analytics told me exactly where I was going wrong. Fixed my weak topics in Permutation & Combination and cracked Infosys!',
    rating: 5,
    company: 'Placed at Infosys',
    avatar: 'RV',
    avatarBg: '#712ae2',
  },
  {
    name: 'Anjali Patel',
    college: 'BITS Pilani, CS 2024',
    quote: 'The mock test experience is identical to the real exam. Timer, anti-cheating, question palette — everything is perfect!',
    rating: 5,
    company: 'Placed at Accenture',
    avatar: 'AP',
    avatarBg: '#059669',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] antialiased overflow-x-hidden min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ==================== HERO ==================== */}
      <main>
        <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #004ac6, transparent)' }} />
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #712ae2, transparent)' }} />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(195,198,215,0.35) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004ac6]/10 border border-[#004ac6]/20 mb-8"
            >
              <Sparkles size={13} className="text-[#004ac6]" />
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-widest">AI-Powered Campus Placement Prep</span>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-[#191c1e] mb-6"
            >
              Crack Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #004ac6 0%, #712ae2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Dream Placement
              </span>
              <br />with AI
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg sm:text-xl text-[#434655] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The ultimate AI-driven platform for engineering students to master aptitude, coding, and mock interviews. Get hired by top tech giants faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
            >
              <Link href="/auth/register">
                <button className="btn-primary text-base px-8 py-3.5 rounded-xl w-full sm:w-auto">
                  Start For Free
                  <ArrowRight size={18} />
                </button>
              </Link>
              <button className="btn-outline text-base px-8 py-3.5 rounded-xl w-full sm:w-auto">
                <Play size={16} className="fill-current" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-[#737686]"
            >
              {[
                { icon: CheckCircle, text: '500+ free questions' },
                { icon: Shield, text: 'No credit card needed' },
                { icon: Users, text: '50,000+ students' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon size={15} className="text-[#004ac6]" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== SOCIAL PROOF / COMPANIES ==================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-[#c3c6d7]/40 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs font-bold text-[#737686] uppercase tracking-widest mb-8">
              Trusted by 50,000+ engineering students preparing for
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {companies.map(c => (
                <motion.span
                  key={c.name}
                  whileHover={{ scale: 1.08 }}
                  className="text-xl font-black transition-all duration-200"
                  style={{ color: c.color }}
                >
                  {c.name}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== STATS ==================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCounter value={50000} label="Students Placed" suffix="+" icon={Users} color="#004ac6" />
              <StatCounter value={10000} label="Practice Questions" suffix="+" icon={BookOpen} color="#712ae2" />
              <StatCounter value={100} label="Top Companies" suffix="+" icon={Building2} color="#059669" />
            </div>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#c3c6d7]/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-widest">Features</span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#191c1e] mt-4 mb-5 leading-tight">
                Everything You Need to{' '}
                <span style={{ background: 'linear-gradient(135deg, #004ac6, #712ae2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Crack Placements
                </span>
              </h2>
              <p className="text-lg text-[#434655] max-w-2xl mx-auto">
                A complete ecosystem for campus placement preparation — from practice to final offer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group p-7 rounded-2xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-white hover:border-[#004ac6]/30 hover:shadow-[0_4px_20px_rgba(0,74,198,0.08)] transition-all duration-300 cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <feature.icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#191c1e] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#434655] leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-widest">How It Works</span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#191c1e] mt-4 mb-5 leading-tight">
                Three Steps to{' '}
                <span style={{ background: 'linear-gradient(135deg, #004ac6, #712ae2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Placement Success
                </span>
              </h2>
              <p className="text-lg text-[#434655]">Simple, structured, and effective</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector lines */}
              <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-[#004ac6]/30 to-[#712ae2]/30" />

              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#c3c6d7]/50 flex items-center justify-center shadow-[0_2px_12px_rgba(0,74,198,0.08)]">
                      <step.icon size={32} className="text-[#004ac6]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#004ac6] text-white rounded-full flex items-center justify-center text-xs font-black">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#191c1e] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#434655] leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== COMPANY PREP ==================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#c3c6d7]/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-widest">Company-Specific Prep</span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#191c1e] mt-4 mb-5 leading-tight">
                Targeted Preparation for{' '}
                <span style={{ background: 'linear-gradient(135deg, #004ac6, #712ae2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Every Company
                </span>
              </h2>
              <p className="text-lg text-[#434655] max-w-2xl mx-auto">
                Tailored preparation for each company's unique test pattern and requirements
              </p>
            </motion.div>

            {/* TCS Featured Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 p-8 rounded-2xl border border-[#004ac6]/25 bg-gradient-to-r from-[#004ac6]/5 via-white to-[#712ae2]/5 shadow-[0_2px_16px_rgba(0,74,198,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #712ae2, transparent)', transform: 'translate(30%, -30%)' }} />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-black text-[#004ac6]">TCS</span>
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/25 rounded-full">
                      ⭐ Most Popular
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#191c1e] mb-2">TCS National Qualifier Test (NQT)</h3>
                  <p className="text-sm text-[#434655] mb-5 max-w-2xl leading-relaxed">
                    India&apos;s largest campus recruitment drive. Numerical Ability, Verbal Ability, Reasoning Ability + Programming Logic &amp; Coding sections.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['3h 30min', '4 Sections', '82 Questions', 'High Competition'].map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#004ac6]/8 border border-[#004ac6]/20 text-[#004ac6] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/companies/tcs" className="shrink-0">
                  <button className="btn-primary px-7 py-3.5 rounded-xl text-sm">
                    Prepare for TCS
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Other companies grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {companyDetails.map((company, i) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={`/companies/${company.slug}`} className="block p-6 rounded-2xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-white hover:border-[#004ac6]/30 hover:shadow-[0_4px_20px_rgba(0,74,198,0.07)] transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-2xl font-black text-[#191c1e] group-hover:text-[#004ac6] transition-colors">{company.name}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#712ae2]/8 border border-[#712ae2]/20 text-[#712ae2] font-bold">
                        {company.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#434655] mb-4 leading-relaxed">{company.pattern}</p>
                    <div className="flex items-center justify-between text-xs text-[#737686]">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {company.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[#004ac6] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Prep <ChevronRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-widest">Success Stories</span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#191c1e] mt-4 mb-5 leading-tight">
                Students Who{' '}
                <span style={{ background: 'linear-gradient(135deg, #004ac6, #712ae2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Cracked It
                </span>
              </h2>
              <p className="text-lg text-[#434655]">Real results from real students</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="p-7 rounded-2xl bg-white border border-[#c3c6d7]/40 shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-[#434655] leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#c3c6d7]/30">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: t.avatarBg }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#191c1e]">{t.name}</p>
                      <p className="text-xs text-[#737686]">{t.college}</p>
                      <p className="text-xs text-[#004ac6] font-bold flex items-center gap-1 mt-0.5">
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

        {/* ==================== CTA BANNER ==================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#c3c6d7]/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
              style={{ background: 'linear-gradient(135deg, #004ac6 0%, #712ae2 100%)' }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-5xl mb-6 inline-block"
                >
                  🚀
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                  Ready to Land Your<br />Dream Offer?
                </h2>
                <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                  Join 50,000+ students already preparing smarter. Start free today — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <button className="px-9 py-4 rounded-xl bg-white text-[#004ac6] font-bold text-base hover:bg-white/90 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center gap-2 w-full sm:w-auto justify-center">
                      <Zap size={18} fill="currentColor" />
                      Start Preparing Now
                    </button>
                  </Link>
                  <Link href="/auth/login">
                    <button className="px-9 py-4 rounded-xl bg-white/10 text-white font-bold text-base border border-white/30 hover:bg-white/20 transition-all duration-200 w-full sm:w-auto">
                      Already have an account?
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/70">
                  {['500+ free questions', 'No credit card', 'Instant access'].map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-white/80" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#191c1e] text-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-[#004ac6] rounded-xl flex items-center justify-center shadow-sm">
                  <Zap size={17} className="text-white" fill="white" />
                </div>
                <span className="font-extrabold text-lg text-white">CareerCracker AI</span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                Empowering engineering students to crack their dream placements through AI-powered preparation.
              </p>
            </div>
            {/* Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
              <div className="space-y-2.5">
                {['Aptitude Practice', 'Mock Tests', 'Coding Arena', 'Company Prep', 'Analytics'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Companies</h4>
              <div className="space-y-2.5">
                {['TCS NQT', 'Infosys', 'Wipro', 'HCL', 'Accenture'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Company</h4>
              <div className="space-y-2.5">
                {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Support'].map(l => (
                  <a key={l} href="#" className="block text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">© 2024 CareerCracker AI. Empowering the next generation of talent.</p>
            <div className="flex items-center gap-1 text-sm text-white/40">
              <TrendingUp size={14} />
              <span>50,000+ students placed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
