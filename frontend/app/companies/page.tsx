'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Clock, Sparkles, Building2, CheckCircle2, FlaskConical, Trophy } from 'lucide-react';

interface CompanyData {
  slug: string;
  name: string;
  tag: string;
  pattern: string;
  duration: string;
}

const companies: CompanyData[] = [
  {
    slug: 'tcs',
    name: 'TCS',
    tag: 'Mixed',
    pattern: 'Numerical + Logic + Verbal',
    duration: '30–60 mins',
  },
  {
    slug: 'infosys',
    name: 'Infosys',
    tag: 'Hard',
    pattern: 'Mathematical + Puzzles',
    duration: '40–60 mins',
  },
  {
    slug: 'accenture',
    name: 'Accenture',
    tag: 'Hard',
    pattern: 'Critical Thinking + English',
    duration: '45 mins',
  },
  {
    slug: 'wipro',
    name: 'Wipro',
    tag: 'Medium',
    pattern: 'Quantitative + Logical Ability',
    duration: '35 mins',
  },
  {
    slug: 'cognizant',
    name: 'Cognizant',
    tag: 'Medium',
    pattern: 'Analytical + Verbal Ability',
    duration: '30 mins',
  },
  {
    slug: 'capgemini',
    name: 'Capgemini',
    tag: 'Mixed',
    pattern: 'Pseudocode + English Skills',
    duration: '30 mins',
  },
  {
    slug: 'hcl',
    name: 'HCL Tech',
    tag: 'Medium',
    pattern: 'Arithmetic + Critical Reasoning',
    duration: '30 mins',
  },
];

const stats = [
  {
    icon: Building2,
    value: '7+',
    label: 'Companies Covered',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: FlaskConical,
    value: '50+',
    label: 'Total Mock Tests',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: Trophy,
    value: '94%',
    label: 'Success Rate',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function CompanyHubPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFF]">
        <Sidebar />

        <main className="flex-1 ml-[260px] overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">

            {/* ── PAGE HEADER ── */}
            <div>
              <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                Company Preparation Hub
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Company-specific mock tests, exam patterns, and preparation strategies — all in one place.
              </p>
            </div>

            {/* ── TCS FEATURED BANNER ── */}
            <div
              onClick={() => router.push('/companies/tcs')}
              className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-white border border-[#BFDBFE] rounded-2xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 group"
              style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(37,99,235,0.08)' }}
            >
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute -top-10 -left-10 w-52 h-52 rounded-full bg-[#2563EB]/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-[#7C3AED]/6 blur-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                {/* Left content */}
                <div className="flex-1 space-y-4">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                      <Sparkles size={10} />
                      Most Popular
                    </span>
                    <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      Ninja &amp; Digital 2026
                    </span>
                  </div>

                  {/* Hero text */}
                  <div>
                    <p className="text-5xl font-black text-[#2563EB] leading-none tracking-tight mb-2">
                      TCS
                    </p>
                    <h3 className="text-xl font-black text-[#111827] leading-snug">
                      National Qualifier Test
                    </h3>
                  </div>

                  <p className="text-sm text-[#6B7280] leading-relaxed max-w-xl">
                    Prepare for Tata Consultancy Services' massive campus drive. Complete blueprint
                    covering Numerical Ability, Logical Reasoning, and Verbal skills — with 3 full
                    mock exams and 15+ aptitude blueprints.
                  </p>

                  {/* Tag pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Numerical Ability', 'Logical Reasoning', 'Verbal Ability', '3 Mock Exams'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-white border border-[#BFDBFE] px-3 py-1 rounded-full"
                      >
                        <CheckCircle2 size={11} className="text-[#2563EB]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex-shrink-0 self-start md:self-center">
                  <button className="btn-primary px-6 py-3 rounded-xl text-sm font-bold tracking-wide shadow-md group-hover:shadow-lg transition-shadow">
                    Prepare Now →
                  </button>
                </div>
              </div>
            </div>

            {/* ── ALL COMPANIES GRID ── */}
            <div>
              <h2 className="text-base font-bold text-[#111827] mb-5 flex items-center gap-2">
                <Building2 size={16} className="text-[#2563EB]" />
                All Companies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {companies.map((company) => (
                  <div
                    key={company.slug}
                    onClick={() => router.push(`/companies/${company.slug}`)}
                    className="group bg-white border border-[#E4E7EC] rounded-2xl p-6 hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)' }}
                  >
                    {/* Company name + tag */}
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-2xl font-black text-[#111827] group-hover:text-[#2563EB] transition-colors leading-tight">
                        {company.name}
                      </p>
                      <span className="badge-violet text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md flex-shrink-0 mt-1">
                        {company.tag}
                      </span>
                    </div>

                    {/* Pattern */}
                    <p className="text-sm text-[#6B7280] mt-1 mb-3 leading-relaxed">
                      {company.pattern}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-[#E4E7EC] pt-4">
                      {/* Duration row */}
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Clock size={13} className="text-[#9CA3AF]" />
                        <span className="font-medium">{company.duration}</span>
                      </div>

                      {/* Prepare link */}
                      <div className="mt-4">
                        <span className="text-[#2563EB] font-semibold text-sm group-hover:underline transition-all">
                          Prepare →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── QUICK STATS ROW ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {stats.map(({ icon: Icon, value, label, color, bg }) => (
                <div
                  key={label}
                  className="bg-white border border-[#E4E7EC] rounded-2xl p-6 text-center"
                  style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: bg }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="text-2xl font-black text-[#111827]">{value}</p>
                  <p className="text-sm text-[#6B7280] mt-1">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
