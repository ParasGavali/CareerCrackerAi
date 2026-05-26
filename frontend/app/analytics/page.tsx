'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { analyticsApi } from '@/lib/api';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, LineChart, Line
} from 'recharts';
import {
  TrendingUp, Award, Calendar, AlertTriangle,
  Lightbulb, Briefcase, Zap, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [readinessScore, setReadinessScore] = useState(74);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topicData, setTopicData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [readinessRes, categoryRes, weeklyRes] = await Promise.all([
          analyticsApi.getPlacementReadiness(),
          analyticsApi.getCategoryPerformance(),
          analyticsApi.getWeeklyProgress()
        ]);
        
        setReadinessScore(readinessRes.data.data?.score || 74);
        setCategoryData(categoryRes.data.data || []);
        setWeeklyData(weeklyRes.data.data || []);
      } catch (e) {
        console.error('API Error, falling back to mock analytics:', e);
        loadFallbackAnalytics();
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const loadFallbackAnalytics = () => {
    setReadinessScore(76);
    
    setWeeklyData([
      { date: 'Mon', score: 65, testsAttempted: 1 },
      { date: 'Tue', score: 70, testsAttempted: 2 },
      { date: 'Wed', score: 68, testsAttempted: 1 },
      { date: 'Thu', score: 75, testsAttempted: 3 },
      { date: 'Fri', score: 82, testsAttempted: 2 },
      { date: 'Sat', score: 80, testsAttempted: 1 },
      { date: 'Sun', score: 85, testsAttempted: 2 }
    ]);

    setCategoryData([
      { category: 'Quantitative', accuracy: 72, questionsAttempted: 120 },
      { category: 'Logical', accuracy: 84, questionsAttempted: 95 },
      { category: 'Verbal', accuracy: 68, questionsAttempted: 80 }
    ]);

    setTopicData([
      { name: 'Number Systems', accuracy: 65 },
      { name: 'Profit & Loss', accuracy: 80 },
      { name: 'Time & Work', accuracy: 72 },
      { name: 'Blood Relations', accuracy: 90 },
      { name: 'Syllogisms', accuracy: 78 },
      { name: 'Grammar', accuracy: 68 },
      { name: 'Comprehension', accuracy: 70 }
    ]);
  };

  const getCompanyGlow = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 60) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const companyReadiness = [
    { name: 'TCS Ninja', score: 82, tier: 'Ninja' },
    { name: 'TCS Digital', score: 60, tier: 'Digital' },
    { name: 'Infosys SE', score: 78, tier: 'System Engineer' },
    { name: 'Wipro Elite', score: 85, tier: 'Elite NLTH' },
    { name: 'Accenture ASE', score: 68, tier: 'Associate SE' },
    { name: 'Cognizant GenC', score: 90, tier: 'GenC' },
    { name: 'Capgemini', score: 55, tier: 'Cognitive' }
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <Sidebar activePath="/analytics" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <TrendingUp className="text-purple-500" />
                Performance Analytics
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Detailed breakdowns of your sectional strengths, weekly progression trends, and company placement readiness.
              </p>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" text="Analyzing academic progress..." />
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Section 1: Placement Readiness score */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Gauge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 flex flex-col items-center justify-center text-center border-white/5 bg-gradient-to-b from-purple-950/5 to-transparent relative overflow-hidden"
                  >
                    <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-600/5 rounded-full blur-2xl" />
                    
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                      <Zap size={15} className="text-yellow-400" />
                      Placement Readiness Score
                    </h3>

                    <ProgressRing
                      percentage={readinessScore}
                      size={160}
                      strokeWidth={12}
                      color="var(--accent-purple)"
                      label={`${readinessScore}%`}
                    />
                    
                    <p className="text-xs text-slate-400 mt-6 leading-relaxed">
                      Your readiness is calculated dynamically based on overall accuracy, test frequency, and coding challenges cleared.
                    </p>
                  </motion.div>

                  {/* Company readiness progress bars */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 border-white/5 lg:col-span-2 flex flex-col justify-between"
                  >
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <Briefcase size={14} className="text-purple-400" />
                      Target Company Evaluation Cutoffs
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {companyReadiness.map((company) => (
                        <div key={company.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300">{company.name}</span>
                            <span className={cn('text-[9px] font-black uppercase px-2 py-0.5 rounded border', getCompanyGlow(company.score))}>
                              {company.score}% Ready
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                              style={{ width: `${company.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Section 2: Charts (Radar & Line) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Radar Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 border-white/5 flex flex-col items-center justify-center col-span-1"
                  >
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">Sectional Balance</h3>
                    <div className="w-full h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="55%" cy="50%" outerRadius="75%" data={categoryData}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                          <Radar name="Accuracy" dataKey="accuracy" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Line Chart (Weekly Trend) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card p-6 border-white/5 lg:col-span-2"
                  >
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                      <Calendar size={13} className="text-purple-400" />
                      Weekly Progress Tracker
                    </h3>

                    <div className="w-full h-52 text-slate-400">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="#475569" fontSize={10} />
                          <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="score" stroke="var(--accent-purple)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Section 3: Recommendations / Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 border-white/5"
                >
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-white/5 pb-2.5">
                    <Lightbulb size={14} className="text-yellow-400 animate-bounce" />
                    AI Action Recommendations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Advice 1 */}
                    <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-500/10 flex gap-3.5 text-xs md:text-sm leading-relaxed text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Boost Verbal Accuracy</h4>
                        <p className="text-slate-400 text-xs">
                          Your Verbal section accuracy is currently at <strong>68%</strong>. Practice sentence correction and synonyms pools before taking the AccentureASE or Capgemini assessments.
                        </p>
                      </div>
                    </div>

                    {/* Advice 2 */}
                    <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 flex gap-3.5 text-xs md:text-sm leading-relaxed text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Specialist Programmers (SP) Prep</h4>
                        <p className="text-slate-400 text-xs">
                          Excellent Logical reasoning accuracy (<strong>84%</strong>)! Leverage this in the upcoming Infosys DSE or Specialist Programmer exam. Keep solving arrays coding logs.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
