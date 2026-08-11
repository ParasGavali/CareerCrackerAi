'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Sparkles, Building2, CheckCircle2, FlaskConical, Trophy, ChevronRight } from 'lucide-react';

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

const tagColorMap: Record<string, BadgeVariant> = {
  Mixed: 'violet',
  Hard: 'red',
  Medium: 'warning',
};

export default function CompanyHubPage() {
  const router = useRouter();

  return (
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="Company Preparation Hub"
          subtitle="Company-specific mock tests, exam patterns, and preparation strategies — all in one place."
          icon={<Building2 size={20} className="text-[#2563EB]" />}
        />

        {/* TCS Featured Banner */}
        <div
          onClick={() => router.push('/companies/tcs')}
          className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-white border border-[#BFDBFE] rounded-2xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(37,99,235,0.08)' }}
        >
          <div className="pointer-events-none absolute -top-10 -left-10 w-52 h-52 rounded-full bg-[#2563EB]/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-[#7C3AED]/6 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="warning" size="sm" dot>
                  <Sparkles size={10} />
                  Most Popular
                </Badge>
                <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  Ninja &amp; Digital 2026
                </span>
              </div>

              <div>
                <p className="text-5xl font-black text-[#2563EB] leading-none tracking-tight mb-2">
                  TCS
                </p>
                <h3 className="text-xl font-black text-[#111827] leading-snug">
                  National Qualifier Test
                </h3>
              </div>

              <p className="text-sm text-[#6B7280] leading-relaxed max-w-xl">
                Prepare for Tata Consultancy Services&apos; massive campus drive. Complete blueprint
                covering Numerical Ability, Logical Reasoning, and Verbal skills — with 3 full
                mock exams and 15+ aptitude blueprints.
              </p>

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

            <div className="flex-shrink-0 self-start md:self-center">
              <Button variant="primary" size="lg" className="rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                Prepare Now
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        </div>

        {/* All Companies Grid */}
        <section>
          <h2 className="text-base font-bold text-[#111827] mb-5 flex items-center gap-2">
            <Building2 size={16} className="text-[#2563EB]" />
            All Companies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((company) => (
              <Card
                key={company.slug}
                hover
                onClick={() => router.push(`/companies/${company.slug}`)}
                className="group p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-2xl font-black text-[#111827] group-hover:text-[#2563EB] transition-colors leading-tight">
                    {company.name}
                  </p>
                  <Badge
                    variant={tagColorMap[company.tag] || 'violet'}
                    size="sm"
                    className="uppercase tracking-wide flex-shrink-0 mt-1"
                  >
                    {company.tag}
                  </Badge>
                </div>

                <p className="text-sm text-[#6B7280] mt-1 mb-3 leading-relaxed">
                  {company.pattern}
                </p>

                <div className="border-t border-[#E4E7EC] pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Clock size={13} className="text-[#9CA3AF]" />
                    <span className="font-medium">{company.duration}</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-[#2563EB] font-semibold text-sm group-hover:underline transition-all">
                      Prepare →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map(({ icon: Icon, value, label, color, bg }) => (
            <Card key={label} className="p-6 text-center">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <p className="text-2xl font-black text-[#111827]">{value}</p>
              <p className="text-sm text-[#6B7280] mt-1">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
