'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Input';
import { codingApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { CodingProblem } from '@/types';
import {
  Code2, CheckCircle2, ChevronRight, Filter,
  Terminal, Award, BookOpen, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const generateFallbackProblems = (): CodingProblem[] => {
  return [
    {
      _id: '1',
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Find indices of the two numbers such that they add up to target.',
      difficulty: 'easy',
      category: 'arrays',
      companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
      constraints: 'O(N) time',
      testCases: [],
      acceptanceRate: 72.5
    },
    {
      _id: '2',
      title: 'Reverse a String',
      slug: 'reverse-a-string',
      description: 'Take a string as input and output the string in reverse.',
      difficulty: 'easy',
      category: 'strings',
      companyTags: ['TCS', 'Wipro', 'HCL', 'Capgemini'],
      constraints: 'O(N) time',
      testCases: [],
      acceptanceRate: 88.1
    },
    {
      _id: '3',
      title: 'Palindrome Number',
      slug: 'palindrome-number',
      description: 'Check if an integer is a palindrome.',
      difficulty: 'easy',
      category: 'math',
      companyTags: ['Wipro', 'HCL', 'Cognizant', 'Capgemini'],
      constraints: 'O(log N) time',
      testCases: [],
      acceptanceRate: 81.3
    },
    {
      _id: '4',
      title: 'Fibonacci Number',
      slug: 'fibonacci-number',
      description: 'Calculate F(n) given n.',
      difficulty: 'easy',
      category: 'math',
      companyTags: ['TCS', 'Infosys', 'Accenture'],
      constraints: 'O(N) time, O(1) space',
      testCases: [],
      acceptanceRate: 85.0
    },
    {
      _id: '5',
      title: 'Fizz Buzz',
      slug: 'fizz-buzz',
      description: 'Output classical Fizz Buzz space-separated sequence up to n.',
      difficulty: 'easy',
      category: 'math',
      companyTags: ['Wipro', 'HCL', 'Capgemini'],
      constraints: 'O(N) time',
      testCases: [],
      acceptanceRate: 92.5
    },
    {
      _id: '6',
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      description: 'Given brackets sequence, check if it is structurally valid.',
      difficulty: 'medium',
      category: 'strings',
      companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
      constraints: 'O(N) time, O(N) space',
      testCases: [],
      acceptanceRate: 64.7
    },
    {
      _id: '7',
      title: 'Find Missing Number',
      slug: 'find-missing-number',
      description: 'Find the unique missing integer in range [0, n].',
      difficulty: 'easy',
      category: 'arrays',
      companyTags: ['Wipro', 'Cognizant', 'HCL', 'TCS'],
      constraints: 'O(N) time, O(1) space',
      testCases: [],
      acceptanceRate: 83.2
    },
    {
      _id: '8',
      title: 'Binary Search',
      slug: 'binary-search',
      description: 'Perform standard O(log N) target lookup inside sorted array.',
      difficulty: 'easy',
      category: 'sorting',
      companyTags: ['Infosys', 'Accenture', 'Cognizant', 'Capgemini'],
      constraints: 'O(log N) time',
      testCases: [],
      acceptanceRate: 85.6
    },
    {
      _id: '9',
      title: 'Climbing Stairs',
      slug: 'climbing-stairs',
      description: 'In how many distinct ways can you climb to the top of n stairs?',
      difficulty: 'medium',
      category: 'dp',
      companyTags: ['TCS', 'Infosys', 'Accenture'],
      constraints: 'O(N) time',
      testCases: [],
      acceptanceRate: 75.1
    },
    {
      _id: '10',
      title: 'Bubble Sort',
      slug: 'bubble-sort',
      description: 'Implement Bubble Sort algorithm.',
      difficulty: 'easy',
      category: 'sorting',
      companyTags: ['Wipro', 'HCL', 'Capgemini'],
      constraints: 'O(N^2) time',
      testCases: [],
      acceptanceRate: 89.2
    },
    {
      _id: '11',
      title: "Maximum Subarray (Kadane's)",
      slug: 'maximum-subarray-kadanes',
      description: 'Find contiguous subarray with largest sum.',
      difficulty: 'medium',
      category: 'arrays',
      companyTags: ['Infosys', 'Cognizant', 'Accenture', 'TCS'],
      constraints: 'O(N) time, O(1) space',
      testCases: [],
      acceptanceRate: 70.3
    },
    {
      _id: '12',
      title: 'Merge Sorted Arrays',
      slug: 'merge-sorted-arrays',
      description: 'Merge two sorted integer arrays into one sorted array.',
      difficulty: 'easy',
      category: 'arrays',
      companyTags: ['Accenture', 'Capgemini', 'Wipro'],
      constraints: 'O(N+M) time',
      testCases: [],
      acceptanceRate: 84.1
    },
    {
      _id: '13',
      title: 'Is Prime',
      slug: 'is-prime',
      description: 'Check if a positive integer n is prime.',
      difficulty: 'easy',
      category: 'math',
      companyTags: ['TCS', 'Capgemini', 'HCL', 'Wipro'],
      constraints: 'O(sqrt(N)) time',
      testCases: [],
      acceptanceRate: 82.5
    },
    {
      _id: '14',
      title: 'Valid Anagram',
      slug: 'valid-anagram',
      description: 'Check if two strings are valid anagrams.',
      difficulty: 'easy',
      category: 'strings',
      companyTags: ['Cognizant', 'Wipro', 'TCS', 'Infosys'],
      constraints: 'O(N) time',
      testCases: [],
      acceptanceRate: 86.4
    },
    {
      _id: '15',
      title: 'Single Number',
      slug: 'single-number',
      description: 'Find the element that appears once where others appear twice.',
      difficulty: 'easy',
      category: 'arrays',
      companyTags: ['TCS', 'Wipro', 'Infosys', 'Accenture'],
      constraints: 'O(N) time, O(1) space',
      testCases: [],
      acceptanceRate: 89.9
    },
    {
      _id: '16',
      title: 'Coin Change',
      slug: 'coin-change',
      description: 'Find fewest number of coins to make up a given amount.',
      difficulty: 'medium',
      category: 'dp',
      companyTags: ['Cognizant', 'Accenture', 'Infosys'],
      constraints: 'O(N*amount) time',
      testCases: [],
      acceptanceRate: 61.2
    },
    {
      _id: '17',
      title: 'Job Sequencing Problem',
      slug: 'job-sequencing-problem',
      description: 'Schedule jobs optimally before deadline to maximize profit.',
      difficulty: 'medium',
      category: 'greedy',
      companyTags: ['Wipro', 'Infosys', 'TCS'],
      constraints: 'O(N log N) time',
      testCases: [],
      acceptanceRate: 59.8
    }
  ];
};

export default function CodingArenaPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await codingApi.getProblems({ limit: 100 });
        setProblems(res.data.data || []);
      } catch (e) {
        console.error('Error fetching coding problems, using fallback:', e);
        setProblems(generateFallbackProblems());
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleLaunchProblem = (slug: string) => {
    toast.success('Loading interactive IDE layout...');
    router.push(`/coding/${slug}`);
  };

  const filteredProblems = problems.filter(problem => {
    if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && problem.category !== categoryFilter) return false;

    if (companyFilter !== 'all') {
      const tags = problem.companyTags || problem.companies || [];
      if (!tags.map((t: string) => t.toLowerCase()).includes(companyFilter.toLowerCase())) return false;
    }

    return true;
  });

  const easyCount = problems.filter(p => p.difficulty === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'hard').length;

  return (
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="Coding Arena"
          subtitle="Solve placements-focused coding assignments using our high-performance sandbox editor."
          icon={<Code2 size={20} className="text-[#2563EB]" />}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Terminal} label="Total Challenges" value={problems.length} color="blue" />
          <StatCard icon={CheckCircle2} label="Easy Level" value={easyCount} color="green" />
          <StatCard icon={Star} label="Medium Level" value={mediumCount} color="amber" />
          <StatCard icon={Award} label="Hard Level" value={hardCount} color="red" />
        </div>

        {/* Filter controls */}
        <Card className="p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2 text-[#6B7280] text-xs font-bold uppercase tracking-wider">
              <Filter size={14} className="text-[#2563EB]" />
              Filter Arena
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-44"
              >
                <option value="all">All Categories</option>
                <option value="arrays">Arrays</option>
                <option value="strings">Strings</option>
                <option value="math">Mathematics</option>
                <option value="dp">Dynamic Programming</option>
                <option value="sorting">Sorting</option>
                <option value="greedy">Greedy</option>
              </Select>

              <Select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-44"
              >
                <option value="all">All Companies</option>
                <option value="TCS">TCS</option>
                <option value="Infosys">Infosys</option>
                <option value="Wipro">Wipro</option>
                <option value="HCL">HCL</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Capgemini">Capgemini</option>
                <option value="Accenture">Accenture</option>
              </Select>

              <div className="flex bg-[#F8FAFF] border border-[#E4E7EC] rounded-xl p-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDifficultyFilter(tab.id as typeof difficultyFilter)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer',
                      difficultyFilter === tab.id
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#6B7280] hover:text-[#2563EB]'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Coding Problem Table */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Loading coding assignments..." />
          </div>
        ) : filteredProblems.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={32} className="text-[#2563EB]" />}
            title="No Coding Problems Found"
            description="Try adjusting your category, company, or difficulty filters."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDifficultyFilter('all');
                  setCategoryFilter('all');
                  setCompanyFilter('all');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] bg-[#F8FAFF] text-[#6B7280] font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Problem</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Target Companies</th>
                    <th className="py-4 px-6 text-right">Acceptance</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[#111827]">
                  {filteredProblems.map((problem) => {
                    const tags = problem.companyTags || problem.companies || [];
                    return (
                      <tr key={problem._id} className="hover:bg-[#F8FAFF] transition-all group">
                        <td className="py-4 px-6 font-semibold">
                          <div>
                            <span className="text-[#111827] group-hover:text-[#2563EB] transition-colors text-sm font-bold block">
                              {problem.title}
                            </span>
                            <span className="text-[#6B7280] text-xs mt-0.5 line-clamp-1 block font-medium">
                              {problem.description.replace(/<[^>]*>/g, '')}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 shrink-0">
                          <DifficultyBadge difficulty={problem.difficulty} />
                        </td>

                        <td className="py-4 px-6 text-[#6B7280] font-semibold capitalize text-xs">
                          {problem.category}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="bg-[#EFF6FF] border border-[#BFDBFE] text-[10px] font-bold text-[#2563EB] px-2 py-0.5 rounded uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="text-[10px] text-[#6B7280] font-bold px-1.5 py-0.5">
                                +{tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right text-[#6B7280] font-bold font-mono">
                          {problem.acceptanceRate ? `${problem.acceptanceRate}%` : 'N/A'}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleLaunchProblem(problem.slug)}
                            className={buttonVariants({
                              variant: 'outline',
                              size: 'sm',
                              className: '!py-2'
                            })}
                          >
                            Code
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
