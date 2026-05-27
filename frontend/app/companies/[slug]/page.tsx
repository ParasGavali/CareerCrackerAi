'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Building2, Sparkles, ChevronRight, Award,
  Terminal, ShieldCheck, HelpCircle, CheckCircle2,
  BookOpen, Star, AlertCircle, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompanySpec {
  name: string;
  tagline: string;
  overview: string;
  pattern: {
    sectionName: string;
    questions: number;
    time: string;
  }[];
  strategies: string[];
  topics: string[];
  mockTestId: string;
  successRate: string;
}

const companyData: Record<string, CompanySpec> = {
  tcs: {
    name: 'TCS (Ninja & Digital)',
    tagline: 'India\'s Largest Placement Driver Assessment',
    overview: 'Tata Consultancy Services hires through the National Qualifier Test (NQT). The recruitment is split into Ninja (general, 3.3 LPA) and Digital (advanced, 7 LPA) based on cognitive performance and programming abilities. Advanced coding performance is highly weighted.',
    pattern: [
      { sectionName: 'Numerical Ability (Aptitude)', questions: 15, time: '30 mins' },
      { sectionName: 'Reasoning Ability (Logical)', questions: 15, time: '30 mins' },
      { sectionName: 'Verbal Ability (English)', questions: 15, time: '20 mins' },
      { sectionName: 'Hands-on Coding (2 Problems)', questions: 2, time: '45 mins' }
    ],
    strategies: [
      'Focus heavily on Number Systems, Profit & Loss, and Time & Work as they form 60% of Numerical Ability.',
      'Practice syllogisms, circular seating arrangements, and spatial reasoning for the Reasoning section.',
      'TCS uses a compiler that supports standard languages. Always modularize your code and read from standard inputs.',
      'TCS Digital candidates should practice dynamic programming (DP) and greedy algorithms.',
      'Keep tab-switching at zero during the exam. The TCS browser monitors window focus actively.'
    ],
    topics: ['Number Systems', 'Profit & Loss', 'Time & Work', 'Syllogism', 'Arrangements', 'DP', 'Greedy'],
    mockTestId: 'tcs-nqt-mock',
    successRate: '92%'
  },
  infosys: {
    name: 'Infosys (SE & SP)',
    tagline: 'System Engineer and Specialist Programmer Paths',
    overview: 'Infosys assessments are highly competitive and emphasize strong logical puzzle-solving and algorithmic logic. Hiring includes the standard System Engineer (SE) and high-paying Specialist Programmer (SP) or Digital Specialist Engineer (DSE) roles.',
    pattern: [
      { sectionName: 'Mathematical Ability (Aptitude)', questions: 10, time: '25 mins' },
      { sectionName: 'Logical Reasoning (Puzzles)', questions: 10, time: '25 mins' },
      { sectionName: 'Verbal Ability', questions: 10, time: '15 mins' },
      { sectionName: 'Pseudocode Debugging', questions: 5, time: '15 mins' },
      { sectionName: 'Hands-on Coding (2-3 Problems)', questions: 2, time: '40 mins' }
    ],
    strategies: [
      'Infosys mathematical questions have higher difficulty. Master Permutations, Combinations, and Probability.',
      'Practice complex seating logic and data sufficiency puzzles.',
      'Review structural language features (pointers, static scopes) for the Pseudocode section.',
      'Write clean algorithmic code. Infosys test cases cover extreme boundary conditions.',
      'Take sectional time limits seriously. If you get stuck, move to the next question quickly.'
    ],
    topics: ['Probability', 'Permutations', 'Complex Puzzles', 'Pseudocode', 'Data Sufficiency', 'Arrays', 'Strings'],
    mockTestId: 'infosys-se-mock',
    successRate: '88%'
  },
  accenture: {
    name: 'Accenture (ASE & FSE)',
    tagline: 'Cognitive and Technical Placement Assessment',
    overview: 'Accenture\'s placement assessment is highly structured, testing cognitive skills, English communication, abstract reasoning, and practical programming logic. There are specific sectional cutoffs that must be cleared sequentially.',
    pattern: [
      { sectionName: 'English Ability', questions: 17, time: '15 mins' },
      { sectionName: 'Critical Reasoning & Problem Solving', questions: 18, time: '20 mins' },
      { sectionName: 'Abstract Reasoning', questions: 15, time: '15 mins' },
      { sectionName: 'Common Applications & MS Office', questions: 12, time: '10 mins' },
      { sectionName: 'Hands-on Coding (2 Problems)', questions: 2, time: '45 mins' }
    ],
    strategies: [
      'Accentures verbal section requires extensive grammar accuracy (prepositions, conjunctions, voices).',
      'Abstract reasoning features geometric rotations and grid completions. Practice pattern visualisations.',
      'Memorize basic operating systems, MS-Office shortcuts, and security protocols.',
      'Coding problems are moderately easy. Ensure you clear all 5 compilers test cases.',
      'Prepare for a rigorous technical review if you perform exceptionally in the coding round.'
    ],
    topics: ['English Grammar', 'Abstract Patterns', 'Critical Reasoning', 'MS Office', 'Operating Systems', 'Sorting'],
    mockTestId: 'accenture-mock',
    successRate: '89%'
  },
  wipro: {
    name: 'Wipro (Elite NLTH)',
    tagline: 'Elite National Level Talent Hunt Assessment',
    overview: 'Wipro hires through the Elite National Level Talent Hunt (NLTH). The test comprises an AMCAT-based cognitive section (Quant, Logical, Verbal), a writing evaluation test, and standard coding problems.',
    pattern: [
      { sectionName: 'Quantitative Ability', questions: 16, time: '20 mins' },
      { sectionName: 'Logical Ability', questions: 14, time: '20 mins' },
      { sectionName: 'Verbal Ability', questions: 22, time: '18 mins' },
      { sectionName: 'WriteX (Essay Writing)', questions: 1, time: '20 mins' },
      { sectionName: 'Automata Coding (2 Problems)', questions: 2, time: '45 mins' }
    ],
    strategies: [
      'AMCAT-style questions emphasize Speed. Memorize calculations and short tricks.',
      'Practice profit/loss, simple/compound interest, and ratios.',
      'For Essay writing, maintain perfect grammar, avoid colloquial words, and structure with clear paragraphs.',
      'The coding platform enforces strict standard outputs. Do not print unnecessary debug lines.',
      'Ensure you practice basic sorting, string manipulations, and matrix updates.'
    ],
    topics: ['Interest rates', 'Speed & Distance', 'Grammar', 'Essay Formatting', 'Matrices', 'String manipulation'],
    mockTestId: 'wipro-mock',
    successRate: '91%'
  },
  cognizant: {
    name: 'Cognizant (GenC & GenC Pro)',
    tagline: 'Cognitive and Algorithmic Graduate Assessment',
    overview: 'Cognizant candidates are evaluated on general cognitive reasoning, structural coding, database operations (SQL), and analytical thinking. Success in coding leads to a GenC Pro profile upgrade.',
    pattern: [
      { sectionName: 'Quantitative Aptitude', questions: 15, time: '25 mins' },
      { sectionName: 'Logical Reasoning', questions: 15, time: '25 mins' },
      { sectionName: 'Verbal Reasoning', questions: 15, time: '15 mins' },
      { sectionName: 'Coding & DBMS Queries', questions: 3, time: '35 mins' }
    ],
    strategies: [
      'Understand basic database normalization, primary keys, and JOIN SQL queries.',
      'Aptitude focuses heavily on percentage calculations, ratios, and averages.',
      'Practice deductive reasoning, coding-decoding, and family tree relations.',
      'Review structural patterns for array traversal and binary structures.',
      'Ensure your coding submissions have robust boundary validations.'
    ],
    topics: ['Averages', 'SQL Joins', 'Family Trees', 'Data structures', 'DBMS', 'Algorithms', 'Puzzles'],
    mockTestId: 'tcs-nqt-mock', // default fallback
    successRate: '94%'
  },
  capgemini: {
    name: 'Capgemini',
    tagline: 'Game-Based Cognitive Assessment & Pseudocodes',
    overview: 'Capgemini recruitment utilizes game-based assessments (testing spatial memory, speed, calculations) followed by technical pseudocoding tests and communication evaluations.',
    pattern: [
      { sectionName: 'Game-Based Aptitude Test', questions: 4, time: '20 mins' },
      { sectionName: 'Pseudocode Challenge', questions: 20, time: '25 mins' },
      { sectionName: 'English Communication skills', questions: 30, time: '30 mins' },
      { sectionName: 'Technical Interview Mock', questions: 1, time: '20 mins' }
    ],
    strategies: [
      'Game assessments test raw speed. Play practice grid, card flipping, and numerical bubble games.',
      'Practice dry-running code loops, recursively nested functions, and bitwise operations.',
      'Review basic data structures (Stacks, Queues, Linked Lists) as they form the pseudocode bases.',
      'Maintain strong spoken grammar for the communication rounded tests.',
      'Always structure logic on scratch papers before ticking answers in pseudocode.'
    ],
    topics: ['Spatial Memory', 'Bitwise operations', 'Stacks & Queues', 'Loops dry-run', 'Vocabulary', 'Linked list'],
    mockTestId: 'accenture-mock',
    successRate: '85%'
  },
  hcl: {
    name: 'HCL Tech',
    tagline: 'HCL Graduate Placement Assessment',
    overview: 'HCL Technologies assessments test standard arithmetic ability, critical analysis, technical computer concepts, and elementary programming logic.',
    pattern: [
      { sectionName: 'Numerical Ability', questions: 15, time: '20 mins' },
      { sectionName: 'Analytical Reasoning', questions: 15, time: '20 mins' },
      { sectionName: 'Technical Computer Concepts', questions: 10, time: '15 mins' },
      { sectionName: 'Programming Hands-on', questions: 1, time: '25 mins' }
    ],
    strategies: [
      'Ensure strong knowledge of basic computer hardware, networking protocols, and operating systems.',
      'Solve HCF, LCM, divisibility rules, and series completion questions.',
      'Practice elementary coding challenges (palindrome, reverse string, prime checkers).',
      'Manage sectional timing meticulously. Do not spend too long on single puzzle logs.',
      'HCL assessments have no negative markings; make intelligent guesses if running out of time.'
    ],
    topics: ['HCF & LCM', 'Networking basics', 'Divisibility', 'Series completion', 'Simple coding', 'Logic grids'],
    mockTestId: 'infosys-se-mock',
    successRate: '95%'
  }
};

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || 'tcs';
  const spec = companyData[slug.toLowerCase()];

  const handleLaunchExam = () => {
    if (spec) {
      toast.success(`Launching ${spec.name} Assessment kit...`);
      router.push(`/mock-tests`);
    }
  };

  if (!spec) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-body-md">
          <div className="text-center bg-surface-container-lowest p-8 border border-outline-variant/30 rounded-2xl shadow-sm max-w-sm">
            <AlertCircle size={48} className="text-primary mx-auto mb-4" />
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Company Profile Not Found</h2>
            <button onClick={() => router.push('/companies')} className="btn-glow mt-4 px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary w-full">
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-surface text-on-surface font-body-md">
        <Sidebar activePath="/companies" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
            {/* Back button */}
            <button
              onClick={() => router.push('/companies')}
              className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-6 cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} /> Back to Hub
            </button>

            {/* Profile Hero Card */}
            <div className="glass-card p-6 md:p-8 border border-outline-variant/30 relative overflow-hidden mb-8 ambient-shadow">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-bl-full blur-xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    Placement Strategy Kit
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    <CheckCircle2 size={13} />
                    Historical Success Rate: {spec.successRate}
                  </div>
                </div>

                <h1 className="font-headline-lg text-headline-lg text-on-surface">{spec.name}</h1>
                <p className="text-sm font-semibold text-secondary italic">{spec.tagline}</p>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mt-2">{spec.overview}</p>
              </div>
            </div>

            {/* Grid structure: Left=Pattern table, Right=Strategy & Topics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Pattern Structure (col-span-2) */}
              <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-5 border border-outline-variant/30 ambient-shadow">
                  <h3 className="text-base font-extrabold text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                    <BookOpen size={18} className="text-primary" />
                    Latest Test Pattern Structure
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant uppercase tracking-widest text-[9px] font-bold">
                          <th className="py-3 px-4">Evaluation Section</th>
                          <th className="py-3 px-4 text-center">Questions</th>
                          <th className="py-3 px-4 text-right">Time Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
                        {spec.pattern.map((section, sIdx) => (
                          <tr key={sIdx} className="hover:bg-surface-container-low/50">
                            <td className="py-3.5 px-4 font-semibold text-on-surface">{section.sectionName}</td>
                            <td className="py-3.5 px-4 text-center text-on-surface-variant font-mono">{section.questions}</td>
                            <td className="py-3.5 px-4 text-right text-on-surface-variant font-mono">{section.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Launch Exam CTA */}
                  <div className="mt-6">
                    <button
                      onClick={handleLaunchExam}
                      className="w-full btn-glow py-3 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-primary hover:bg-secondary"
                    >
                      Launch Company Mock Exam
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Tips & Core Topics (col-span-1) */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Core topics */}
                <div className="glass-card p-5 border border-outline-variant/30 ambient-shadow">
                  <h3 className="text-xs font-black text-on-surface uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <Terminal size={14} className="text-primary" />
                    Frequently Asked Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {spec.topics.map(topic => (
                      <span
                        key={topic}
                        className="bg-surface-container-low border border-outline-variant/50 hover:border-primary/30 text-[10px] text-on-surface-variant hover:text-primary font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        onClick={() => router.push('/practice')}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secure monitoring reminder */}
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-3 text-xs leading-relaxed text-amber-800/80">
                  <h4 className="font-extrabold text-amber-700 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Secure Browser Rule
                  </h4>
                  <p>
                    All exams initiated on this platform enforce fullscreen sandboxes. Tab-switching is automatically logged and triggers security warnings. Ensure focused environments before commencing exams.
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation Strategies Section */}
            <div className="glass-card p-6 border border-outline-variant/30 mt-8 ambient-shadow">
              <h3 className="text-base font-extrabold text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <Star size={18} className="text-yellow-500 animate-spin" style={{ animationDuration: '4s' }} />
                Targeted Preparation Strategy
              </h3>

              <div className="space-y-4">
                {spec.strategies.map((tip, idx) => (
                  <div key={idx} className="flex gap-4 items-start text-on-surface-variant text-xs md:text-sm leading-relaxed">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-black text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {idx + 1}
                    </span>
                    <p className="flex-1">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
