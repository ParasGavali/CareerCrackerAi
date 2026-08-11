'use client';

import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ChevronRight, Award, Terminal,
  ShieldCheck, BookOpen, Star, AlertCircle,
  ArrowLeft, CheckCircle2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompanySpec {
  name: string;
  tagline: string;
  overview: string;
  pattern: { sectionName: string; questions: number; time: string }[];
  strategies: string[];
  topics: string[];
  mockTestId: string;
  successRate: string;
}

const companyData: Record<string, CompanySpec> = {
  tcs: {
    name: 'TCS (Ninja & Digital)',
    tagline: "India's Largest Campus Placement Assessment",
    overview:
      'TCS hires through the National Qualifier Test (NQT). Performance splits candidates into Ninja (3.3 LPA) and Digital (7 LPA) tracks based on cognitive scores and coding ability.',
    pattern: [
      { sectionName: 'Numerical Ability', questions: 15, time: '30 mins' },
      { sectionName: 'Reasoning Ability', questions: 15, time: '30 mins' },
      { sectionName: 'Verbal Ability', questions: 15, time: '20 mins' },
      { sectionName: 'Coding (2 Problems)', questions: 2, time: '45 mins' },
    ],
    strategies: [
      'Focus on Number Systems, Profit & Loss, and Time & Work — they form 60% of Numerical.',
      'Practice syllogisms, circular seating, and spatial reasoning for the Reasoning section.',
      'Always modularize your code and read from standard inputs.',
      'TCS Digital candidates must practise dynamic programming and greedy algorithms.',
      'Never tab-switch during the exam — TCS browser monitors window focus.',
    ],
    topics: ['Number Systems', 'Profit & Loss', 'Time & Work', 'Syllogism', 'Arrangements', 'DP', 'Greedy'],
    mockTestId: 'tcs-nqt-mock',
    successRate: '92%',
  },
  infosys: {
    name: 'Infosys (SE & SP)',
    tagline: 'System Engineer and Specialist Programmer Paths',
    overview:
      'Infosys tests strong logical puzzle-solving and algorithmic logic. Roles include System Engineer (SE) and high-paying Specialist Programmer (SP) / DSE tracks.',
    pattern: [
      { sectionName: 'Mathematical Ability', questions: 10, time: '25 mins' },
      { sectionName: 'Logical Reasoning (Puzzles)', questions: 10, time: '25 mins' },
      { sectionName: 'Verbal Ability', questions: 10, time: '15 mins' },
      { sectionName: 'Pseudocode Debugging', questions: 5, time: '15 mins' },
      { sectionName: 'Coding (2–3 Problems)', questions: 2, time: '40 mins' },
    ],
    strategies: [
      'Master Permutations, Combinations, and Probability — questions are high difficulty.',
      'Practice complex seating logic and data sufficiency puzzles.',
      'Review structural language features for the Pseudocode section.',
      'Write clean algorithmic code — test cases cover extreme boundary conditions.',
      'If stuck, move on quickly. Sectional time limits are strict.',
    ],
    topics: ['Probability', 'Permutations', 'Complex Puzzles', 'Pseudocode', 'Arrays', 'Strings'],
    mockTestId: 'infosys-se-mock',
    successRate: '88%',
  },
  accenture: {
    name: 'Accenture (ASE & FSE)',
    tagline: 'Cognitive and Technical Placement Assessment',
    overview:
      "Accenture's assessment tests cognitive skills, English communication, abstract reasoning, and programming logic with sequential sectional cutoffs.",
    pattern: [
      { sectionName: 'English Ability', questions: 17, time: '15 mins' },
      { sectionName: 'Critical Reasoning & Problem Solving', questions: 18, time: '20 mins' },
      { sectionName: 'Abstract Reasoning', questions: 15, time: '15 mins' },
      { sectionName: 'Common Apps & MS Office', questions: 12, time: '10 mins' },
      { sectionName: 'Coding (2 Problems)', questions: 2, time: '45 mins' },
    ],
    strategies: [
      'Verbal section requires strong grammar accuracy — prepositions, conjunctions, voices.',
      'Abstract reasoning has geometric rotations and grid completions. Practice pattern visualisation.',
      'Memorize MS-Office shortcuts, OS basics, and security protocols.',
      'Coding problems are moderately easy — clear all 5 compiler test cases.',
      'Exceptional coding performance leads to a rigorous technical review round.',
    ],
    topics: ['English Grammar', 'Abstract Patterns', 'Critical Reasoning', 'MS Office', 'OS', 'Sorting'],
    mockTestId: 'accenture-mock',
    successRate: '89%',
  },
  wipro: {
    name: 'Wipro (Elite NLTH)',
    tagline: 'Elite National Level Talent Hunt Assessment',
    overview:
      'Wipro uses an AMCAT-based cognitive section plus a writing evaluation and coding problems. Speed is the key differentiator across all sections.',
    pattern: [
      { sectionName: 'Quantitative Ability', questions: 16, time: '20 mins' },
      { sectionName: 'Logical Ability', questions: 14, time: '20 mins' },
      { sectionName: 'Verbal Ability', questions: 22, time: '18 mins' },
      { sectionName: 'WriteX (Essay)', questions: 1, time: '20 mins' },
      { sectionName: 'Automata Coding (2 Problems)', questions: 2, time: '45 mins' },
    ],
    strategies: [
      'AMCAT-style questions emphasize speed — memorize calculations and short tricks.',
      'Practice profit/loss, SI/CI, and ratio problems.',
      'For essay writing, maintain perfect grammar, no colloquial words, clear paragraphs.',
      'Coding platform enforces strict standard outputs — no debug prints.',
      'Practice sorting, string manipulations, and matrix updates.',
    ],
    topics: ['Interest Rates', 'Speed & Distance', 'Grammar', 'Essay', 'Matrices', 'Strings'],
    mockTestId: 'wipro-mock',
    successRate: '91%',
  },
  cognizant: {
    name: 'Cognizant (GenC & GenC Pro)',
    tagline: 'Cognitive and Algorithmic Graduate Assessment',
    overview:
      'Cognizant evaluates general cognitive reasoning, structural coding, SQL, and analytical thinking. Strong coding performance leads to a GenC Pro profile upgrade.',
    pattern: [
      { sectionName: 'Quantitative Aptitude', questions: 15, time: '25 mins' },
      { sectionName: 'Logical Reasoning', questions: 15, time: '25 mins' },
      { sectionName: 'Verbal Reasoning', questions: 15, time: '15 mins' },
      { sectionName: 'Coding & DBMS Queries', questions: 3, time: '35 mins' },
    ],
    strategies: [
      'Understand basic SQL — normalization, primary keys, and JOIN queries.',
      'Aptitude focuses heavily on percentages, ratios, and averages.',
      'Practice deductive reasoning, coding-decoding, and family trees.',
      'Review array traversal and binary structure patterns.',
      'Ensure coding submissions have robust boundary validations.',
    ],
    topics: ['Averages', 'SQL Joins', 'Family Trees', 'Data Structures', 'DBMS', 'Algorithms'],
    mockTestId: 'tcs-nqt-mock',
    successRate: '94%',
  },
  capgemini: {
    name: 'Capgemini',
    tagline: 'Game-Based Cognitive Assessment & Pseudocodes',
    overview:
      'Capgemini uses game-based assessments (spatial memory, speed, calculations) followed by pseudocoding tests and communication evaluations.',
    pattern: [
      { sectionName: 'Game-Based Aptitude', questions: 4, time: '20 mins' },
      { sectionName: 'Pseudocode Challenge', questions: 20, time: '25 mins' },
      { sectionName: 'English Communication', questions: 30, time: '30 mins' },
      { sectionName: 'Technical Interview Mock', questions: 1, time: '20 mins' },
    ],
    strategies: [
      'Game assessments test raw speed — practice grid, card flipping, and numerical bubble games.',
      'Dry-run code loops, recursive functions, and bitwise operations.',
      'Review basic data structures (Stacks, Queues, Linked Lists).',
      'Maintain strong spoken grammar for communication tests.',
      'Structure logic on scratch paper before answering pseudocode questions.',
    ],
    topics: ['Spatial Memory', 'Bitwise Ops', 'Stacks & Queues', 'Loops', 'Vocabulary', 'Linked List'],
    mockTestId: 'accenture-mock',
    successRate: '85%',
  },
  hcl: {
    name: 'HCL Tech',
    tagline: 'HCL Graduate Placement Assessment',
    overview:
      'HCL tests standard arithmetic, critical analysis, technical computer concepts, and elementary programming logic. No negative marking.',
    pattern: [
      { sectionName: 'Numerical Ability', questions: 15, time: '20 mins' },
      { sectionName: 'Analytical Reasoning', questions: 15, time: '20 mins' },
      { sectionName: 'Technical Computer Concepts', questions: 10, time: '15 mins' },
      { sectionName: 'Programming Hands-on', questions: 1, time: '25 mins' },
    ],
    strategies: [
      'Strong knowledge of hardware, networking protocols, and operating systems is essential.',
      'Solve HCF, LCM, divisibility rules, and series completion questions.',
      'Practice elementary coding challenges — palindrome, reverse string, prime checkers.',
      'Manage sectional timing carefully. Do not spend too long on single puzzles.',
      'No negative marking — make intelligent guesses if running out of time.',
    ],
    topics: ['HCF & LCM', 'Networking Basics', 'Divisibility', 'Series Completion', 'Simple Coding'],
    mockTestId: 'infosys-se-mock',
    successRate: '95%',
  },
};

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || 'tcs';
  const spec = companyData[slug.toLowerCase()];

  const handleLaunchExam = () => {
    if (spec) {
      toast.success(`Launching ${spec.name} mock test…`);
      router.push('/mock-tests');
    }
  };

  if (!spec) {
    return (
      <AppShell>
        <div className="page-container flex justify-center pt-16">
          <EmptyState
            icon={<AlertCircle size={32} className="text-[#DC2626]" />}
            title="Company Not Found"
            description="This company profile doesn't exist."
            action={
              <Button variant="primary" size="md" onClick={() => router.push('/companies')}>
                Go Back to Companies
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-container space-y-7">
        <button
          onClick={() => router.push('/companies')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#2563EB] transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to Companies
        </button>

        {/* Hero Card */}
        <Card className="p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-52 h-52 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.06),transparent_70%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <Badge variant="blue" size="sm">
                Placement Strategy Kit
              </Badge>
              <span className="inline-flex items-center gap-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold px-3 py-1 rounded-full">
                <CheckCircle2 size={13} />
                Historical Success Rate: {spec.successRate}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#111827] mb-1.5">{spec.name}</h1>
            <p className="text-[15px] font-semibold text-[#7C3AED] italic mb-3.5">{spec.tagline}</p>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium max-w-3xl">{spec.overview}</p>
          </div>
        </Card>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Test Pattern + Strategy */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="p-7">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-5 pb-4 border-b border-[#E4E7EC]">
                <BookOpen size={17} className="text-[#2563EB]" />
                Latest Test Pattern
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#F9FAFB]">
                      <th className="py-2.5 px-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280] border-b border-[#E4E7EC]">Section</th>
                      <th className="py-2.5 px-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280] border-b border-[#E4E7EC]">Questions</th>
                      <th className="py-2.5 px-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#6B7280] border-b border-[#E4E7EC]">
                        <Clock size={11} className="inline mr-1" />
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {spec.pattern.map((section, idx) => (
                      <tr key={idx} className="border-b border-[#F3F4F6] hover:bg-[#F8FAFF] transition-colors">
                        <td className="py-3 px-3.5 text-[13px] font-semibold text-[#111827]">{section.sectionName}</td>
                        <td className="py-3 px-3.5 text-center text-[13px] font-bold text-[#2563EB]">{section.questions}</td>
                        <td className="py-3 px-3.5 text-right text-[13px] text-[#6B7280] font-medium">{section.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="primary" size="md" className="w-full mt-5 justify-center" onClick={handleLaunchExam}>
                Launch Company Mock Exam
                <ChevronRight size={16} />
              </Button>
            </Card>

            {/* Strategy Tips */}
            <Card className="p-7">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-5 pb-4 border-b border-[#E4E7EC]">
                <Star size={17} className="text-[#D97706]" />
                Preparation Strategy
              </h3>
              <div className="flex flex-col gap-3.5">
                {spec.strategies.map((tip, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <span className="w-[26px] h-[26px] flex-shrink-0 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-[13px] text-[#4B5563] leading-relaxed font-medium flex-1">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Topics + Security + Success */}
          <div className="flex flex-col gap-5">
            <Card className="p-6">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 mb-4">
                <Terminal size={14} className="text-[#2563EB]" />
                Key Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {spec.topics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => router.push('/practice')}
                    className="bg-[#F9FAFB] border border-[#E4E7EC] text-[#374151] text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#2563EB]"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5">
              <h4 className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <ShieldCheck size={14} />
                Exam Security Notice
              </h4>
              <p className="text-[13px] text-[#78350F] leading-relaxed font-medium">
                Exams enforce fullscreen mode. Tab-switching is logged and triggers warnings. Ensure a quiet environment before starting.
              </p>
            </div>

            <Card className="p-6 text-center">
              <Award size={28} className="text-[#2563EB] mx-auto mb-2.5" />
              <p className="text-3xl font-black text-[#111827]">{spec.successRate}</p>
              <p className="text-[13px] text-[#6B7280] font-medium mt-1">Historical Success Rate</p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
