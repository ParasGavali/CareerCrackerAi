'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Input';
import { analyticsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';
import {
  Trophy, Target, CheckCircle2,
  Zap, Building2
} from 'lucide-react';

interface MockLeaderboard {
  entries: LeaderboardEntry[];
  myRank: number;
  myScore: number;
}

const generateMockLeaderboard = (companyFilter: string): MockLeaderboard => {
  const myRank = 14;
  const myScore = 780;

  const list: LeaderboardEntry[] = [
    {
      userId: '1',
      name: 'Aarav Mehta',
      college: 'IIT Bombay',
      totalScore: 1250,
      testsAttempted: 35,
      accuracy: 94,
      rank: 1,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AM'
    },
    {
      userId: '2',
      name: 'Sneha Rao',
      college: 'PES University, Bangalore',
      totalScore: 1180,
      testsAttempted: 32,
      accuracy: 92,
      rank: 2,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SR'
    },
    {
      userId: '3',
      name: 'Vikram Aditya',
      college: 'COEP, Pune',
      totalScore: 1120,
      testsAttempted: 29,
      accuracy: 89,
      rank: 3,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VA'
    },
    {
      userId: '4',
      name: 'Anjali Sharma',
      college: 'DTU, Delhi',
      totalScore: 980,
      testsAttempted: 25,
      accuracy: 87,
      rank: 4,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AS'
    },
    {
      userId: '5',
      name: 'Pranav Kulkarni',
      college: 'VIT, Vellore',
      totalScore: 940,
      testsAttempted: 26,
      accuracy: 85,
      rank: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PK'
    },
    {
      userId: '6',
      name: 'Neha Nair',
      college: 'BITS Pilani',
      totalScore: 890,
      testsAttempted: 22,
      accuracy: 88,
      rank: 6,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NN'
    },
    {
      userId: '7',
      name: 'Rohan Sharma',
      college: 'Global Engineering College',
      totalScore: 780,
      testsAttempted: 18,
      accuracy: 82,
      rank: 14,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RS'
    }
  ];

  if (companyFilter !== 'all') {
    return {
      myRank,
      myScore,
      entries: list.map(e => ({
        ...e,
        totalScore: Math.round(e.totalScore * 0.4)
      })).sort((a, b) => b.totalScore - a.totalScore).map((e, i) => ({ ...e, rank: i + 1 }))
    };
  }

  return { myRank, myScore, entries: list };
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number>(12);
  const [myScore, setMyScore] = useState<number>(450);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const params = companyFilter !== 'all' ? { company: companyFilter } : undefined;
        const res = await analyticsApi.getLeaderboard(params);
        const data = res.data.data;
        if (data) {
          setEntries(data.entries || []);
          setMyRank(data.myRank || 12);
          setMyScore(data.myScore || 450);
        }
      } catch (e) {
        console.error('Error fetching leaderboard, using mock data:', e);
        const mock = generateMockLeaderboard(companyFilter);
        setEntries(mock.entries);
        setMyRank(mock.myRank);
        setMyScore(mock.myScore);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [companyFilter]);

  const getPodiumOrder = () => {
    const second = entries.find(e => e.rank === 2);
    const first = entries.find(e => e.rank === 1);
    const third = entries.find(e => e.rank === 3);

    return { first, second, third };
  };

  const { first, second, third } = getPodiumOrder();

  return (
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="National Placement Leaderboard"
          subtitle="Compete with engineering graduates nationwide. Higher accuracy boosts your national placement ranking."
          icon={<Trophy size={20} className="text-[#D97706]" />}
          actions={
            <Select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-52 bg-white shadow-sm"
            >
              <option value="all">Overall Ranking</option>
              <option value="TCS">TCS Ninja Prep</option>
              <option value="Infosys">Infosys SE Prep</option>
              <option value="Wipro">Wipro NLTH</option>
              <option value="Accenture">Accenture ASE</option>
              <option value="Cognizant">Cognizant GenC</option>
              <option value="Capgemini">Capgemini Prep</option>
            </Select>
          }
        />

        {/* My Rank Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Trophy} label="Your National Rank" value={`#${myRank}`} color="amber" size="sm" />
          <StatCard icon={Target} label="Your Cumulative Score" value={myScore} suffix=" pts" color="blue" size="sm" />
          <Card className="p-6 flex items-center gap-3 border-[#FDE68A] bg-[#FFFBEB]/60">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
              <Zap size={18} className="text-[#D97706]" />
            </div>
            <div>
              <span className="text-[10px] text-[#92400E] uppercase font-bold tracking-wide">Placement League Badge</span>
              <h3 className="text-lg font-black text-[#D97706] leading-tight mt-0.5">Elite Developer</h3>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Loading leaderboard standings..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Visual Podium Block */}
            <div className="grid grid-cols-3 items-end gap-3 md:gap-6 bg-white border border-[#E4E7EC] rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-center relative overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#2563EB]/5 rounded-full blur-[80px] pointer-events-none" />

              {second && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3">
                    <Image src={second.avatar ?? 'https://api.dicebear.com/7.x/initials/svg?seed=NA'} alt={second.name} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-300 bg-white shadow-sm" />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">2</span>
                  </div>
                  <h4 className="text-[#111827] text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{second.name}</h4>
                  <p className="text-[9px] text-[#6B7280] font-semibold truncate max-w-[80px] md:max-w-[120px] mb-2">{second.college}</p>
                  <div className="h-20 w-16 md:w-24 bg-gradient-to-t from-[#F3F4F6] via-[#F9FAFB] to-transparent rounded-t-xl flex items-center justify-center border-t border-[#E4E7EC]">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-[#6B7280]">{second.totalScore} pts</span>
                  </div>
                </motion.div>
              )}

              {first && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center scale-110 z-10"
                >
                  <div className="relative mb-3.5">
                    <Image src={first.avatar ?? 'https://api.dicebear.com/7.x/initials/svg?seed=NA'} alt={first.name} width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-400 bg-white shadow-md" />
                    <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-white font-black text-sm w-6 h-6 rounded-full flex items-center justify-center border border-white">1</span>
                  </div>
                  <h4 className="text-[#111827] text-xs md:text-sm font-black truncate max-w-[80px] md:max-w-[120px]">{first.name}</h4>
                  <p className="text-[9px] text-[#2563EB] font-bold truncate max-w-[80px] md:max-w-[120px] mb-2">{first.college}</p>
                  <div className="h-28 w-20 md:w-28 bg-gradient-to-t from-[#2563EB]/20 via-[#2563EB]/10 to-transparent rounded-t-xl flex items-center justify-center border-t border-[#2563EB]/30 shadow-[0_0_20px_rgba(37,99,235,0.06)]">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-[#2563EB]">{first.totalScore} pts</span>
                  </div>
                </motion.div>
              )}

              {third && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3">
                    <Image src={third.avatar ?? 'https://api.dicebear.com/7.x/initials/svg?seed=NA'} alt={third.name} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-amber-600 bg-white shadow-sm" />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">3</span>
                  </div>
                  <h4 className="text-[#111827] text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{third.name}</h4>
                  <p className="text-[9px] text-[#6B7280] font-semibold truncate max-w-[80px] md:max-w-[120px] mb-2">{third.college}</p>
                  <div className="h-16 w-16 md:w-24 bg-gradient-to-t from-[#F3F4F6] via-[#F9FAFB] to-transparent rounded-t-xl flex items-center justify-center border-t border-[#E4E7EC]">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-[#D97706]">{third.totalScore} pts</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 2. Standings Table */}
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-[#E4E7EC] bg-[#F8FAFF] text-[#6B7280] font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th className="py-4 px-6">Student Profile</th>
                      <th className="py-4 px-6">Affiliated College</th>
                      <th className="py-4 px-6 text-right">Accuracy Ratio</th>
                      <th className="py-4 px-6 text-right">Tests</th>
                      <th className="py-4 px-6 text-right">Placement Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[#111827]">
                    {entries.map((entry) => {
                      const isCurrentUser = entry.name.toLowerCase() === 'rohan sharma';

                      return (
                        <tr
                          key={entry.userId}
                          className={cn(
                            'hover:bg-[#F8FAFF] transition-all',
                            isCurrentUser && 'bg-[#EFF6FF] text-[#2563EB] font-bold border-y border-[#BFDBFE] shadow-sm'
                          )}
                        >
                          <td className="py-4 px-6 text-center font-black">
                            {entry.rank === 1 ? (
                              <span className="text-lg">🥇</span>
                            ) : entry.rank === 2 ? (
                              <span className="text-lg">🥈</span>
                            ) : entry.rank === 3 ? (
                              <span className="text-lg">🥉</span>
                            ) : (
                              <span className="font-mono font-bold text-[#6B7280]">#{entry.rank}</span>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Image src={entry.avatar ?? 'https://api.dicebear.com/7.x/initials/svg?seed=NA'} alt={entry.name} width={32} height={32} className="w-8 h-8 rounded-full bg-white border border-[#E4E7EC]" />
                              <div>
                                <span className="text-[#111827] text-sm font-bold block">{entry.name}</span>
                                {isCurrentUser && (
                                  <span className="text-[9px] uppercase font-black text-[#2563EB] flex items-center gap-1 mt-0.5">
                                    <CheckCircle2 size={10} /> CURRENT STUDENT
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-[#6B7280] font-semibold capitalize text-xs">
                            <span className="flex items-center gap-1">
                              <Building2 size={13} className="text-[#9CA3AF] shrink-0" />
                              {entry.college}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right font-bold text-[#6B7280] font-mono">
                            {entry.accuracy}%
                          </td>

                          <td className="py-4 px-6 text-right text-[#6B7280] font-mono font-medium">
                            {entry.testsAttempted}
                          </td>

                          <td className="py-4 px-6 text-right text-[#2563EB] font-black font-mono">
                            {entry.totalScore} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
