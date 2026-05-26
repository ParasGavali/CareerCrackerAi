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
  Zap, Star, User, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

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

    // Filter by company mock scoring logic slightly to make it dynamic
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
    // Standard list has 1st, 2nd, 3rd. We want to render: 2nd, 1st, 3rd on the screen!
    const second = entries.find(e => e.rank === 2);
    const first = entries.find(e => e.rank === 1);
    const third = entries.find(e => e.rank === 3);

    return { first, second, third };
  };

  const { first, second, third } = getPodiumOrder();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <Sidebar activePath="/leaderboard" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <Trophy className="text-yellow-500" />
                  National placement Leaderboard
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Compete with engineering graduates nationwide. Higher accuracy boosts your national placement ranking.
                </p>
              </div>

              {/* Recruiter filter */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer transition-all font-bold"
              >
                <option value="all">Overall Ranking</option>
                <option value="TCS">TCS ninja prep</option>
                <option value="Infosys">Infosys SE prep</option>
                <option value="Wipro">Wipro NLTH</option>
                <option value="Accenture">Accenture ASE</option>
                <option value="Cognizant">Cognizant GenC</option>
                <option value="Capgemini">Capgemini prep</option>
              </select>
            </div>

            {/* My Rank Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-4 border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Trophy size={18} />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black">Your National Rank</span>
                  <h3 className="text-base font-bold text-white leading-tight mt-0.5">#{myRank}</h3>
                </div>
              </div>

              <div className="glass-card p-4 border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Target size={18} />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black">Your Cumulative Score</span>
                  <h3 className="text-base font-bold text-white leading-tight mt-0.5">{myScore} pts</h3>
                </div>
              </div>

              <div className="glass-card p-4 border-yellow-500/10 bg-yellow-500/[0.02] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Zap size={18} className="animate-bounce" />
                </div>
                <div>
                  <span className="text-[9px] text-yellow-500/80 uppercase font-black">Placement League Badge</span>
                  <h3 className="text-base font-bold text-yellow-400 leading-tight mt-0.5">Elite Developer</h3>
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
                <div className="grid grid-cols-3 items-end gap-3 md:gap-6 bg-slate-950/40 border border-white/5 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-center relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

                  {/* 2nd place (Left) */}
                  {second && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-3">
                        <img src={second.avatar} alt={second.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-400 bg-slate-900" />
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-[#0a0a0f]">2</span>
                      </div>
                      <h4 className="text-white text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{second.name}</h4>
                      <p className="text-[9px] text-slate-500 truncate max-w-[80px] md:max-w-[120px] mb-2">{second.college}</p>
                      <div className="h-20 w-16 md:w-24 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-800/40 rounded-t-xl flex items-center justify-center border-t border-slate-500/20">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-slate-400">{second.totalScore} pts</span>
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
                        <img src={first.avatar} alt={first.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-yellow-500 bg-slate-900 shadow-xl" />
                        <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-[#0a0a0f] font-black text-sm w-6 h-6 rounded-full flex items-center justify-center border border-[#0a0a0f]">1</span>
                      </div>
                      <h4 className="text-white text-xs md:text-sm font-black truncate max-w-[80px] md:max-w-[120px]">{first.name}</h4>
                      <p className="text-[9px] text-yellow-500/60 truncate max-w-[80px] md:max-w-[120px] mb-2">{first.college}</p>
                      <div className="h-28 w-20 md:w-28 bg-gradient-to-t from-purple-950 via-purple-900/60 to-purple-800/20 rounded-t-xl flex items-center justify-center border-t border-purple-500/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-purple-300">{first.totalScore} pts</span>
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
                        <img src={third.avatar} alt={third.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-amber-600 bg-slate-900" />
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border border-[#0a0a0f]">3</span>
                      </div>
                      <h4 className="text-white text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-[120px]">{third.name}</h4>
                      <p className="text-[9px] text-slate-500 truncate max-w-[80px] md:max-w-[120px] mb-2">{third.college}</p>
                      <div className="h-16 w-16 md:w-24 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-800/40 rounded-t-xl flex items-center justify-center border-t border-amber-600/20">
                        <span className="text-[10px] md:text-xs font-mono font-bold text-amber-500">{third.totalScore} pts</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Standings Table list */}
                <div className="glass-card border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-950 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="py-4.5 px-6 text-center w-16">Rank</th>
                          <th className="py-4.5 px-6">Student Profile</th>
                          <th className="py-4.5 px-6">Affiliated College</th>
                          <th className="py-4.5 px-6 text-right">Accuracy Ratio</th>
                          <th className="py-4.5 px-6 text-right">Tests</th>
                          <th className="py-4.5 px-6 text-right">Placement Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {entries.map((entry) => {
                          const isCurrentUser = entry.name.toLowerCase() === 'rohan sharma';
                          
                          return (
                            <tr
                              key={entry.userId}
                              className={cn(
                                'hover:bg-white/[0.01] transition-all',
                                isCurrentUser && 'bg-purple-500/[0.03] text-purple-300 font-bold border-y border-purple-500/20'
                              )}
                            >
                              {/* Rank */}
                              <td className="py-4 px-6 text-center font-black">
                                {entry.rank === 1 ? (
                                  <span className="text-yellow-400">🥇</span>
                                ) : entry.rank === 2 ? (
                                  <span className="text-slate-400">🥈</span>
                                ) : entry.rank === 3 ? (
                                  <span className="text-amber-600">🥉</span>
                                ) : (
                                  <span className="font-mono">#{entry.rank}</span>
                                )}
                              </td>

                              {/* Student info */}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full bg-slate-900 border border-white/10" />
                                  <div>
                                    <span className="text-white text-sm font-bold block">{entry.name}</span>
                                    {isCurrentUser && (
                                      <span className="text-[9px] uppercase font-black text-purple-400 flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 size={10} /> CURRENT STUDENT
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* College */}
                              <td className="py-4 px-6 text-slate-400 font-medium capitalize text-xs">
                                <span className="flex items-center gap-1">
                                  <Building2 size={13} className="text-slate-600 shrink-0" />
                                  {entry.college}
                                </span>
                              </td>

                              {/* Accuracy */}
                              <td className="py-4 px-6 text-right font-bold text-slate-300 font-mono">
                                {entry.accuracy}%
                              </td>

                              {/* Tests */}
                              <td className="py-4 px-6 text-right text-slate-500 font-mono font-medium">
                                {entry.testsAttempted}
                              </td>

                              {/* Total Score */}
                              <td className="py-4 px-6 text-right text-purple-400 font-black font-mono">
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
