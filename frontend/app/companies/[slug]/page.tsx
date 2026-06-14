'use client';

import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Building2, ChevronRight, Award, Terminal,
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

const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E4E7EC',
  borderRadius: '16px',
  boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)',
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
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ ...card, padding: '40px', maxWidth: '360px', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: '#DC2626', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Company Not Found</h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '24px' }}>This company profile doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/companies')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Go Back to Companies
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Sidebar />

        <div style={{ flex: 1, marginLeft: '260px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Back button */}
            <button
              onClick={() => router.push('/companies')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', width: 'fit-content', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563EB')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >
              <ArrowLeft size={15} /> Back to Companies
            </button>

            {/* Hero Card */}
            <div style={{ ...card, padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at top right, rgba(37,99,235,0.06), transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: '99px' }}>
                    Placement Strategy Kit
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px' }}>
                    <CheckCircle2 size={13} />
                    Historical Success Rate: {spec.successRate}
                  </div>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{spec.name}</h1>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#7C3AED', marginBottom: '14px', fontStyle: 'italic' }}>{spec.tagline}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, fontWeight: 500 }}>{spec.overview}</p>
              </div>
            </div>

            {/* Two-column grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

              {/* Left: Test Pattern */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ ...card, padding: '28px' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E4E7EC' }}>
                    <BookOpen size={17} style={{ color: '#2563EB' }} />
                    Latest Test Pattern
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B7280', borderBottom: '1px solid #E4E7EC' }}>Section</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B7280', borderBottom: '1px solid #E4E7EC' }}>Questions</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B7280', borderBottom: '1px solid #E4E7EC' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {spec.pattern.map((section, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '13px 14px', fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{section.sectionName}</td>
                          <td style={{ padding: '13px 14px', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB' }}>{section.questions}</td>
                          <td style={{ padding: '13px 14px', textAlign: 'right', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>{section.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={handleLaunchExam}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
                  >
                    Launch Company Mock Exam
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Strategy Tips */}
                <div style={{ ...card, padding: '28px' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E4E7EC' }}>
                    <Star size={17} style={{ color: '#D97706' }} />
                    Preparation Strategy
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {spec.strategies.map((tip, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <span style={{
                          width: '26px', height: '26px', flexShrink: 0, borderRadius: '8px',
                          background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB',
                          fontSize: '0.75rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{idx + 1}</span>
                        <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.65, fontWeight: 500, flex: 1 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Topics + Security notice */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ ...card, padding: '24px' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Terminal size={14} style={{ color: '#2563EB' }} />
                    Key Topics
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {spec.topics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => router.push('/practice')}
                        style={{
                          background: '#F9FAFB', border: '1px solid #E4E7EC', color: '#374151',
                          fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: '8px',
                          cursor: 'pointer', transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.color = '#2563EB'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E4E7EC'; e.currentTarget.style.color = '#374151'; }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <ShieldCheck size={14} />
                    Exam Security Notice
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.65, fontWeight: 500 }}>
                    Exams enforce fullscreen mode. Tab-switching is logged and triggers warnings. Ensure a quiet environment before starting.
                  </p>
                </div>

                <div style={{ ...card, padding: '24px', textAlign: 'center' }}>
                  <Award size={28} style={{ color: '#2563EB', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>{spec.successRate}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500, marginTop: '4px' }}>Historical Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
