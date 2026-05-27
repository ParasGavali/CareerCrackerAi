'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { analyticsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';
import {
  Trophy, Target, CheckCircle2, Award,
  Zap, Star, Building2
} from 'lucide-react';

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
        generateMockLeaderboard();
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [companyFilter]);

  const generateMockLeaderboard = () => {
    setMyRank(14);
    setMyScore(780);

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
        name: 'Rohan Sharma', // Current User
        college: 'Global Engineering College',
        totalScore: 780,
        testsAttempted: 18,
        accuracy: 82,
        rank: 14,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RS'
      }
    ];

    if (companyFilter !== 'all') {
      setEntries(list.map(e => ({
        ...e,
        totalScore: Math.round(e.totalScore * 0.4)
      })).sort((a,b) => b.totalScore - a.totalScore).map((e, i) => ({ ...e, rank: i + 1 })));
    } else {
      setEntries(list);
    }
  };

  const getPodiumOrder = () => {
    const second = entries.find(e => e.rank === 2);
    const first = entries.find(e => e.rank === 1);
    const third = entries.find(e => e.rank === 3);

    return { first, second, third };
  };

  const { first, second, third } = getPodiumOrder();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-surface text-on-surface font-body-md">
        <Sidebar activePath="/leaderboard" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2.5">
                  <Trophy className="text-amber-500 animate-bounce" />
                  National Placement Leaderboard
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-medium">
                  Compete with engineering graduates nationwide. Higher accuracy boosts your national placement ranking.
                </p>
              </div>

              {/* Recruiter filter */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer transition-all font-bold shadow-sm"
              >
                <option value="all">Overall Ranking</option>
                <option value="TCS">TCS Ninja Prep</option>
                <option value="Infosys">Infosys SE Prep</option>
                <option value="Wipro">Wipro NLTH</option>
                <option value="Accenture">Accenture ASE</option>
                <option value="Cognizant">Cognizant GenC</option>
                <option value="Capgemini">Capgemini Prep</option>
              </select>
            </div>

            {/* My Rank Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Trophy size={18} />
                </div>
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wide">Your National Rank</span>
                  <h3 className="text-base font-black text-on-surface leading-tight mt-0.5">#{myRank}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Target size={18} />
                </div>
                <div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wide">Your Cumulative Score</span>
                  <h3 className="text-base font-black text-on-surface leading-tight mt-0.5">{myScore} pts</h3>
                </div>
              </div>

              <div className="bg-amber-500/[0.03] p-4 border border-amber-500/20 rounded-xl ambient-shadow flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Zap size={18} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] text-amber-700 uppercase font-bold tracking-wide">Placement League Badge</span>
                  <h3 className="text-base font-black text-amber-600 leading-tight mt-0.5">Elite Developer</h3>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" text="Loading leaderboard standings..." />
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* 1. Visual Podium Block */}
                <div className="grid grid-cols-3 items-end gap-3 md:gap-6 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-center relative overflow-hidden ambient-shadow">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                  {/* 2nd place (Left) */}
                  {second && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <img src={second.avatar} alt={second.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-300 bg-surface shadow-sm" />
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-surface-container-lowest">2</span>
                      </div>
                      <h4 className="text-on-surface text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{second.name}</h4>
                      <p className="text-[9px] text-on-surface-variant font-semibold truncate max-w-[80px] md:max-w-[120px] mb-2">{second.college}</p>
                      <div className="h-20 w-16 md:w-24 bg-gradient-to-t from-surface-container/60 via-surface-container/30 to-transparent rounded-t-xl flex items-center justify-center border-t border-outline-variant/30">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-on-surface-variant">{second.totalScore} pts</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st place (Center) */}
                  {first && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center scale-110 z-10"
                    >
                      <div className="relative mb-3.5">
                        <img src={first.avatar} alt={first.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-400 bg-surface shadow-md" />
                        <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-on-primary font-black text-sm w-6 h-6 rounded-full flex items-center justify-center border border-surface-container-lowest">1</span>
                      </div>
                      <h4 className="text-on-surface text-xs md:text-sm font-black truncate max-w-[80px] md:max-w-[120px]">{first.name}</h4>
                      <p className="text-[9px] text-primary font-bold truncate max-w-[80px] md:max-w-[120px] mb-2">{first.college}</p>
                      <div className="h-28 w-20 md:w-28 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent rounded-t-xl flex items-center justify-center border-t border-primary/30 shadow-[0_0_20px_rgba(0,74,198,0.06)]">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-primary">{first.totalScore} pts</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd place (Right) */}
                  {third && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <img src={third.avatar} alt={third.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-amber-600 bg-surface shadow-sm" />
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-surface-container-lowest">3</span>
                      </div>
                      <h4 className="text-on-surface text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{third.name}</h4>
                      <p className="text-[9px] text-on-surface-variant font-semibold truncate max-w-[80px] md:max-w-[120px] mb-2">{third.college}</p>
                      <div className="h-16 w-16 md:w-24 bg-gradient-to-t from-surface-container/60 via-surface-container/30 to-transparent rounded-t-xl flex items-center justify-center border-t border-outline-variant/30">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-amber-700">{third.totalScore} pts</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Standings Table list */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden ambient-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant/30 bg-surface-container text-on-surface-variant font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="py-4.5 px-6 text-center w-16">Rank</th>
                          <th className="py-4.5 px-6">Student Profile</th>
                          <th className="py-4.5 px-6">Affiliated College</th>
                          <th className="py-4.5 px-6 text-right">Accuracy Ratio</th>
                          <th className="py-4.5 px-6 text-right">Tests</th>
                          <th className="py-4.5 px-6 text-right">Placement Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                        {entries.map((entry) => {
                          const isCurrentUser = entry.name.toLowerCase() === 'rohan sharma';
                          
                          return (
                            <tr
                              key={entry.userId}
                              className={cn(
                                'hover:bg-surface-container-low/50 transition-all',
                                isCurrentUser && 'bg-primary/5 text-primary font-bold border-y border-primary/20 shadow-sm'
                              )}
                            >
                              {/* Rank */}
                              <td className="py-4 px-6 text-center font-black">
                                {entry.rank === 1 ? (
                                  <span className="text-lg">🥇</span>
                                ) : entry.rank === 2 ? (
                                  <span className="text-lg">🥈</span>
                                ) : entry.rank === 3 ? (
                                  <span className="text-lg">🥉</span>
                                ) : (
                                  <span className="font-mono font-bold text-on-surface-variant">#{entry.rank}</span>
                                )}
                              </td>

                              {/* Student info */}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full bg-surface border border-outline-variant/30" />
                                  <div>
                                    <span className="text-on-surface text-sm font-bold block">{entry.name}</span>
                                    {isCurrentUser && (
                                      <span className="text-[9px] uppercase font-black text-primary flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 size={10} /> CURRENT STUDENT
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* College */}
                              <td className="py-4 px-6 text-on-surface-variant font-semibold capitalize text-xs">
                                <span className="flex items-center gap-1">
                                  <Building2 size={13} className="text-outline shrink-0" />
                                  {entry.college}
                                </span>
                              </td>

                              {/* Accuracy */}
                              <td className="py-4 px-6 text-right font-bold text-on-surface-variant font-mono">
                                {entry.accuracy}%
                              </td>

                              {/* Tests */}
                              <td className="py-4 px-6 text-right text-on-surface-variant font-mono font-medium">
                                {entry.testsAttempted}
                              </td>

                              {/* Total Score */}
                              <td className="py-4 px-6 text-right text-primary font-black font-mono">
                                {entry.totalScore} pts
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
