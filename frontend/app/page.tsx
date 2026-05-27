'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Zap, BookOpen, FileText, Code2, BarChart3, Building2, Trophy,
  ArrowRight, Star, CheckCircle, Users, Target, Award, ChevronRight,
  Brain, Clock, Sparkles, Play
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
      <div className="text-4xl md:text-5xl font-black text-primary mb-2 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-on-surface-variant text-sm font-semibold">{label}</div>
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
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
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
      className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/50 ambient-shadow flex flex-col items-center text-center group hover:border-primary/50 transition-colors cursor-default"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        style={{ background: `${color}10` }}
      >
        <Icon size={28} style={{ color }} />
      </div>

      <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{description}</p>
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
    color: '#712ae2',
  },
  {
    icon: FileText,
    title: 'Mock Tests',
    description: 'Simulate real company tests with timed, proctored mock exams. Company-specific test patterns for TCS, Infosys, Wipro and more.',
    color: '#004ac6',
  },
  {
    icon: Code2,
    title: 'Coding Arena',
    description: 'Practice coding problems in our browser-based IDE supporting C++, Java, Python, and JavaScript with instant feedback.',
    color: '#004ac6',
  },
  {
    icon: Brain,
    title: 'AI Analytics',
    description: 'Get personalized insights into your weak areas. AI-powered recommendations help you focus on topics that matter most.',
    color: '#712ae2',
  },
  {
    icon: Building2,
    title: 'Company Prep',
    description: 'Dedicated preparation guides for each major IT company with test patterns, sample questions, and proven strategies.',
    color: '#712ae2',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete with students across India. Track your rank, celebrate achievements, and stay motivated with gamified learning.',
    color: '#004ac6',
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
    color: 'from-primary to-secondary',
  },
  {
    name: 'Rahul Verma',
    college: 'NIT Trichy, ECE 2024',
    quote: 'The AI analytics told me exactly where I was going wrong. Fixed my weak topics in Permutation & Combination and cracked Infosys!',
    rating: 5,
    company: 'Placed at Infosys',
    avatar: 'RV',
    color: 'from-secondary to-primary',
  },
  {
    name: 'Anjali Patel',
    college: 'BITS Pilani, CS 2024',
    quote: 'The mock test experience is identical to the real exam. Timer, anti-cheating, question palette — everything is perfect!',
    rating: 5,
    company: 'Placed at Accenture',
    avatar: 'AP',
    color: 'from-primary to-primary-container',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface antialiased font-body-md overflow-x-hidden min-h-screen">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <main className="pt-[100px]">
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center flex flex-col items-center justify-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-md"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">AI-Powered Preparation</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display-lg text-display-lg max-w-4xl mx-auto mb-md leading-tight text-on-surface"
          >
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Crack Your Placement
            </span>{' '}
            With AI
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg leading-relaxed"
          >
            The ultimate AI-driven platform for engineering students to master aptitude, coding, and mock interviews. Get hired by top tech giants faster.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-sm justify-center items-center w-full sm:w-auto mb-xl"
          >
            <Link href="/auth/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-label-md text-label-md bg-primary text-on-primary px-8 py-4 rounded-lg hover:bg-secondary transition-colors duration-300 ambient-shadow flex items-center justify-center gap-xs cursor-pointer">
                Start For Free
                <ArrowRight size={20} />
              </button>
            </Link>
            <button className="w-full sm:w-auto font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface px-8 py-4 rounded-lg hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-xs cursor-pointer">
              Watch Demo
              <Play size={20} className="fill-current" />
            </button>
          </motion.div>
        </section>

        {/* ==================== SOCIAL PROOF ==================== */}
        <section className="py-lg border-y border-outline-variant/30 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-md">
              Trusted by 50,000+ Engineering Students to crack
            </p>
            <div className="flex flex-wrap justify-center items-center gap-lg md:gap-xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {companies.map(c => (
                <span key={c.name} className="font-headline-md text-headline-md font-bold text-on-surface">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== STATS ==================== */}
        <section className="py-xl max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/50 ambient-shadow text-center flex flex-col items-center group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs">50,000+</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Students Placed</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/50 ambient-shadow text-center flex flex-col items-center group hover:border-secondary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                <BookOpen size={32} className="text-secondary" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs">10,000+</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Practice Questions</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/50 ambient-shadow text-center flex flex-col items-center group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                <Building2 size={32} className="text-primary" />
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs">100+</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Top Companies</p>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low/30 border-t border-outline-variant/20">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Features</span>
              <h2 className="font-display-lg text-headline-lg text-on-surface mt-3 mb-4">
                Everything You Need to{' '}
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  Crack Placements
                </span>
              </h2>
              <p className="font-body-lg text-body-md text-on-surface-variant max-w-2xl mx-auto">
                A complete ecosystem for campus placement preparation — from practice to final offer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-y border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Process</span>
              <h2 className="font-display-lg text-headline-lg text-on-surface mt-3 mb-4">
                How It <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Works</span>
              </h2>
              <p className="font-body-lg text-body-md text-on-surface-variant">Three simple steps to placement success</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg relative">
              {/* Connecting line */}
              <div
                className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-outline-variant/40"
              />

              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="text-center flex flex-col items-center"
                >
                  <div className="relative inline-flex mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 74, 198, 0.1), rgba(113, 42, 226, 0.05))',
                        border: '1px solid rgba(0, 74, 198, 0.2)',
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <step.icon size={28} className="text-primary" />
                    </motion.div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface mb-3">{step.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== COMPANY PREP ==================== */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Company Prep</span>
              <h2 className="font-display-lg text-headline-lg text-on-surface mt-3 mb-4">
                Company-Specific{' '}
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  Preparation
                </span>
              </h2>
              <p className="font-body-lg text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Tailored preparation for each company&apos;s unique test pattern and requirements
              </p>
            </motion.div>

            {/* TCS Featured Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-surface-container-lowest p-6 md:p-8 mb-6 border border-primary/20 rounded-xl ambient-shadow relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-black text-primary">TCS</span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full">
                      ⭐ Most Popular
                    </span>
                  </div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">TCS National Qualifier Test (NQT)</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4 max-w-3xl leading-relaxed">
                    India&apos;s largest campus recruitment drive. Numerical Ability, Verbal Ability, Reasoning Ability + Programming Logic & Coding sections.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['3h 30min', '4 Sections', '82 Questions', 'High Competition'].map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/companies/tcs" className="shrink-0 self-stretch md:self-auto flex items-center">
                  <button className="w-full font-label-md text-label-md bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300 ambient-shadow flex items-center justify-center gap-xs cursor-pointer">
                    Prepare for TCS
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Other companies grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {companyDetails.slice(1).map((company, i) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 ambient-shadow hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                >
                  <Link href={`/companies/${company.name.toLowerCase()}`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors">{company.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-semibold">
                        {company.tag}
                      </span>
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant mb-4 leading-relaxed">{company.pattern}</p>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
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
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-y border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Success Stories</span>
              <h2 className="font-display-lg text-headline-lg text-on-surface mt-3 mb-4">
                Students Who{' '}
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  Cracked It
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -4 }}
                  className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 ambient-shadow"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-headline-md text-sm font-semibold text-on-surface">{t.name}</p>
                      <p className="font-body-md text-xs text-on-surface-variant">{t.college}</p>
                      <p className="font-label-sm text-xs text-primary font-bold flex items-center gap-1 mt-0.5">
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
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl p-12 text-center bg-surface-container border border-outline-variant ambient-shadow"
            >
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-6xl mb-6 inline-block"
                >
                  🚀
                </motion.div>
                <h2 className="font-display-lg text-headline-lg text-on-surface mb-4">
                  Ready to Crack Your{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    Dream Placement?
                  </span>
                </h2>
                <p className="font-body-lg text-body-md text-on-surface-variant mb-8 max-w-xl mx-auto">
                  Join 50,000+ students already preparing smarter. Start free today — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-sm justify-center w-full sm:w-auto">
                  <Link href="/auth/register" className="w-full sm:w-auto">
                    <button className="w-full font-label-md text-label-md bg-primary text-on-primary px-10 py-4 rounded-lg hover:bg-secondary transition-colors duration-300 ambient-shadow flex items-center justify-center gap-xs cursor-pointer">
                      <Zap size={20} fill="currentColor" />
                      Start Preparing Now
                    </button>
                  </Link>
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <button className="w-full font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface px-10 py-4 rounded-lg hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-xs cursor-pointer">
                      Already have an account?
                    </button>
                  </Link>
                </div>
                <p className="mt-6 text-on-surface-variant font-label-sm text-sm">
                  <CheckCircle size={14} className="inline mr-1 text-primary" />
                  500+ free questions &nbsp;·&nbsp;
                  <CheckCircle size={14} className="inline mr-1 text-primary" />
                  No credit card &nbsp;·&nbsp;
                  <CheckCircle size={14} className="inline mr-1 text-primary" />
                  Instant access
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-surface-container-low border-t border-outline-variant w-full mt-xl">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-lg max-w-[1280px] mx-auto gap-md">
          <div className="font-display-lg text-headline-md font-bold text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            CareerCracker AI
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">About Us</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Privacy Policy</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Terms of Service</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">AI Methodology</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Contact Support</a>
          </div>
          <div className="font-body-md text-body-md text-on-surface-variant text-center md:text-right">
            © 2024 CareerCracker AI. Empowering the next generation of talent.
          </div>
        </div>
      </footer>
    </div>
  );
}
