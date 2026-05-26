'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import {
  Building2, Sparkles, ChevronRight, Award,
  Terminal, ShieldCheck, Briefcase, Zap
} from 'lucide-react';

interface CompanyCard {
  slug: string;
  name: string;
  tagline: string;
  difficulty: 'Medium' | 'Hard' | 'Mixed';
  duration: string;
  sections: number;
  highlightText: string;
  glowColor: string;
  borderColor: string;
  bgGlow: string;
}

export default function CompanyHubPage() {
  const router = useRouter();

  const companies: CompanyCard[] = [
    {
      slug: 'tcs',
      name: 'TCS',
      tagline: 'Ninja & Digital Recruitment Paths',
      difficulty: 'Mixed',
      duration: '30-60 mins',
      sections: 3,
      highlightText: 'Numerical + Logic + Verbal',
      glowColor: 'from-[#2563eb] to-[#06b6d4]',
      borderColor: 'group-hover:border-blue-500/30',
      bgGlow: 'bg-blue-600/5'
    },
    {
      slug: 'infosys',
      name: 'Infosys',
      tagline: 'System Engineer & Specialist Programmer',
      difficulty: 'Hard',
      duration: '40-60 mins',
      sections: 3,
      highlightText: 'Mathematical + Puzzles',
      glowColor: 'from-[#06b6d4] to-[#10b981]',
      borderColor: 'group-hover:border-cyan-500/30',
      bgGlow: 'bg-cyan-600/5'
    },
    {
      slug: 'accenture',
      name: 'Accenture',
      tagline: 'Associate Software Engineer Assessment',
      difficulty: 'Hard',
      duration: '45 mins',
      sections: 3,
      highlightText: 'Critical Thinking + English',
      glowColor: 'from-[#7c3aed] to-[#2563eb]',
      borderColor: 'group-hover:border-purple-500/30',
      bgGlow: 'bg-purple-600/5'
    },
    {
      slug: 'wipro',
      name: 'Wipro',
      tagline: 'Elite National Level Talent Hunt (NLTH)',
      difficulty: 'Medium',
      duration: '35 mins',
      sections: 3,
      highlightText: 'Quantitative + Logical Ability',
      glowColor: 'from-[#a78bfa] to-[#60a5fa]',
      borderColor: 'group-hover:border-violet-500/30',
      bgGlow: 'bg-indigo-600/5'
    },
    {
      slug: 'cognizant',
      name: 'Cognizant',
      tagline: 'GenC & GenC Pro Cognitive assessment',
      difficulty: 'Medium',
      duration: '30 mins',
      sections: 3,
      highlightText: 'Analytical + Verbal Ability',
      glowColor: 'from-[#10b981] to-[#06b6d4]',
      borderColor: 'group-hover:border-emerald-500/30',
      bgGlow: 'bg-emerald-600/5'
    },
    {
      slug: 'capgemini',
      name: 'Capgemini',
      tagline: 'Game-based & Pseudocode Assessment',
      difficulty: 'Mixed',
      duration: '30 mins',
      sections: 3,
      highlightText: 'Pseudocode + English skills',
      glowColor: 'from-[#f59e0b] to-[#ef4444]',
      borderColor: 'group-hover:border-amber-500/30',
      bgGlow: 'bg-amber-600/5'
    },
    {
      slug: 'hcl',
      name: 'HCL Tech',
      tagline: 'Graduate Hiring Program Assessment',
      difficulty: 'Medium',
      duration: '30 mins',
      sections: 3,
      highlightText: 'Arithmetic + Critical Reasoning',
      glowColor: 'from-[#ef4444] to-[#7c3aed]',
      borderColor: 'group-hover:border-red-500/30',
      bgGlow: 'bg-red-600/5'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <Sidebar activePath="/companies" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <Briefcase className="text-purple-500" />
                Company Placement Hub
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Access curated company-specific assessment strategies, historical test patterns, and customized mock tests.
              </p>
            </div>

            {/* TCS NQT Featured Hero banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => router.push('/companies/tcs')}
              className="glass-card p-6 md:p-8 border-purple-500/20 bg-gradient-to-r from-purple-900/10 via-[#0a0a0f] to-blue-900/10 mb-8 relative overflow-hidden group cursor-pointer hover:border-purple-500/40 transition-all"
            >
              {/* Glow spots */}
              <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-purple-600/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Sparkles size={11} /> FEATURED ASSESSMENT
                    </span>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Ninja & Digital 2026
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                    TCS National Qualifier Test (NQT) Prep Kit
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl">
                    Prepare for the massive campus recruitment drive of Tata Consultancy Services. Complete blueprint breakdown including Numerical Ability (Aptitude), Reasoning puzzles, and Advanced Coding templates.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1"><Terminal size={13} /> 15 Aptitude blueprints</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={13} /> 3 Complete Mock Exams</span>
                  </div>
                </div>

                <button className="self-start md:self-auto btn-glow text-white font-extrabold text-xs tracking-wider uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all">
                  Launch Kit
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Title section */}
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-purple-500" />
              Target Recruitment Portals
            </h2>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company, index) => (
                <motion.div
                  key={company.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => router.push(`/companies/${company.slug}`)}
                  className={cn(
                    'glass-card p-6 border-white/5 cursor-pointer relative overflow-hidden group hover:bg-slate-900/10 hover:border-purple-500/20 transition-all'
                  )}
                >
                  {/* Hover background color glow */}
                  <div className={cn('absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-gradient-to-br', company.glowColor)} />

                  {/* Logo Text Styled Premium */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black tracking-tight text-white text-base">
                      {company.name}
                    </div>
                    <span className="text-[9px] font-black uppercase bg-white/5 border border-white/10 text-slate-500 px-2 py-0.5 rounded">
                      Diff: {company.difficulty}
                    </span>
                  </div>

                  {/* Tagline */}
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors mb-1.5 leading-tight">
                    {company.name} Placement prep
                  </h4>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-6">
                    {company.tagline}
                  </p>

                  {/* Info pills */}
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>Pattern Style:</span>
                      <span className="text-slate-300 font-bold">{company.highlightText}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>Exam Timing:</span>
                      <span className="text-slate-300 font-bold">{company.duration}</span>
                    </div>
                  </div>

                  {/* Hover Arrow indicator */}
                  <div className="mt-5 flex items-center justify-end text-[10px] uppercase tracking-wider font-extrabold text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Start Prep
                    <ChevronRight size={12} className="ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
