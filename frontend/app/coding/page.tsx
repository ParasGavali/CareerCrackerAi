'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { codingApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { CodingProblem } from '@/types';
import {
  Code2, CheckCircle2, ChevronRight, Filter,
  Terminal, Award, BookOpen, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

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
        title: 'Maximum Subarray (Kadane\'s)',
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

  const handleLaunchProblem = (slug: string) => {
    toast.success('Loading interactive IDE layout...');
    router.push(`/coding/${slug}`);
  };

  // Filter list
  const filteredProblems = problems.filter(problem => {
    if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && problem.category !== categoryFilter) return false;
    
    if (companyFilter !== 'all') {
      const tags = problem.companyTags || (problem as any).companies || [];
      if (!tags.map((t: string) => t.toLowerCase()).includes(companyFilter.toLowerCase())) return false;
    }
    
    return true;
  });

  // Calculate difficulty counts
  const easyCount = problems.filter(p => p.difficulty === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'hard').length;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-surface text-on-surface font-body-md">
        <Sidebar activePath="/coding" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2.5">
                <Code2 className="text-primary animate-pulse" />
                Coding Arena
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-medium">
                Solve placements-focused coding assignments using our high-performance sandbox editor.
              </p>
            </div>

            {/* Quick Stats Banner Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Terminal size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide">Total Challenges</span>
                  <h3 className="text-lg font-black text-on-surface leading-tight mt-0.5">{problems.length}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide">Easy Level</span>
                  <h3 className="text-lg font-black text-emerald-600 leading-tight mt-0.5">{easyCount}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                  <Star size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide">Medium Level</span>
                  <h3 className="text-lg font-black text-amber-600 leading-tight mt-0.5">{mediumCount}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide">Hard Level</span>
                  <h3 className="text-lg font-black text-red-600 leading-tight mt-0.5">{hardCount}</h3>
                </div>
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-surface-container-lowest p-5 border border-outline-variant/30 rounded-xl ambient-shadow flex flex-wrap gap-4 items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                <Filter size={14} className="text-primary" />
                Filter Arena
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Category selector */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-xl px-3.5 py-2 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="arrays">Arrays</option>
                  <option value="strings">Strings</option>
                  <option value="math">Mathematics</option>
                  <option value="dp">Dynamic Programming</option>
                  <option value="sorting">Sorting</option>
                  <option value="greedy">Greedy</option>
                </select>

                {/* Company filter */}
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-xl px-3.5 py-2 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
                >
                  <option value="all">All Companies</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                  <option value="Wipro">Wipro</option>
                  <option value="HCL">HCL</option>
                  <option value="Cognizant">Cognizant</option>
                  <option value="Capgemini">Capgemini</option>
                  <option value="Accenture">Accenture</option>
                </select>

                {/* Difficulty tabs */}
                <div className="flex bg-surface-container border border-outline-variant/30 rounded-xl p-0.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'easy', label: 'Easy' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'hard', label: 'Hard' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDifficultyFilter(tab.id as any)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer',
                        difficultyFilter === tab.id
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface-variant hover:text-primary'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coding Problem Grid/Table */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" text="Loading coding assignments..." />
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-xl mx-auto ambient-shadow">
                <BookOpen size={44} className="text-outline mx-auto mb-3" />
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1">No Coding Problems Found</h4>
                <p className="font-body-md text-xs text-on-surface-variant font-medium">Try adjusting your category, company, or difficulty filters.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden ambient-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-container text-on-surface-variant font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="py-4.5 px-6">Problem</th>
                        <th className="py-4.5 px-6">Difficulty</th>
                        <th className="py-4.5 px-6">Category</th>
                        <th className="py-4.5 px-6">Target Companies</th>
                        <th className="py-4.5 px-6 text-right">Acceptance</th>
                        <th className="py-4.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                      {filteredProblems.map((problem) => {
                        const tags = problem.companyTags || (problem as any).companies || [];
                        return (
                          <tr key={problem._id} className="hover:bg-surface-container-low/50 transition-all group">
                            {/* Problem Name & Description */}
                            <td className="py-4 px-6 font-semibold">
                              <div>
                                <span className="text-on-surface group-hover:text-primary transition-colors text-sm font-bold block">
                                  {problem.title}
                                </span>
                                <span className="text-on-surface-variant text-xs mt-0.5 line-clamp-1 block font-medium">
                                  {problem.description.replace(/<[^>]*>/g, '')}
                                </span>
                              </div>
                            </td>

                            {/* Difficulty */}
                            <td className="py-4 px-6 shrink-0">
                              <DifficultyBadge difficulty={problem.difficulty} />
                            </td>

                            {/* Category */}
                            <td className="py-4 px-6 text-on-surface-variant font-semibold capitalize text-xs">
                              {problem.category}
                            </td>

                            {/* Company Tags */}
                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1">
                                {tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary px-2 py-0.5 rounded uppercase"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {tags.length > 3 && (
                                  <span className="text-[9px] text-on-surface-variant font-bold px-1.5 py-0.5">
                                    +{tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Acceptance Rate */}
                            <td className="py-4 px-6 text-right text-on-surface-variant font-bold font-mono">
                              {problem.acceptanceRate ? `${problem.acceptanceRate}%` : 'N/A'}
                            </td>

                            {/* Launch Action */}
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleLaunchProblem(problem.slug)}
                                className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
