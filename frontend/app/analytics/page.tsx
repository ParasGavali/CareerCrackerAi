'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { analyticsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, CartesianGrid, Tooltip, LineChart, Line, XAxis, YAxis
} from 'recharts';
import {
  TrendingUp, Award, Calendar,
  Lightbulb, Briefcase, Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [readinessScore, setReadinessScore] = useState(74);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

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
  };

  const getCompanyGlow = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    return 'bg-red-500/10 text-red-700 border-red-500/20';
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
      <div className="flex min-h-screen bg-surface text-on-surface font-body-md">
        <Sidebar activePath="/analytics" />

        <div className="flex-1 min-h-screen overflow-y-auto pl-0 lg:pl-64">
          <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2.5">
                <TrendingUp className="text-primary animate-pulse" />
                Performance Analytics
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-medium">
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
                    className="bg-surface-container-lowest p-6 flex flex-col items-center justify-center text-center border border-outline-variant/30 rounded-xl ambient-shadow relative overflow-hidden"
                  >
                    <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-6 flex items-center gap-1.5">
                      <Zap size={15} className="text-amber-500 fill-amber-500" />
                      Placement Readiness Score
                    </h3>

                    <ProgressRing
                      percentage={readinessScore}
                      size={160}
                      strokeWidth={12}
                      gradientStart="#004ac6"
                      gradientEnd="#712ae2"
                      label={`${readinessScore}%`}
                    />
                    
                    <p className="font-body-md text-xs text-on-surface-variant mt-6 leading-relaxed font-semibold">
                      Your readiness is calculated dynamically based on overall accuracy, test frequency, and coding challenges cleared.
                    </p>
                  </motion.div>

                  {/* Company readiness progress bars */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface-container-lowest p-6 border border-outline-variant/30 rounded-xl ambient-shadow lg:col-span-2 flex flex-col justify-between"
                  >
                    <h3 className="text-xs font-black text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2.5">
                      <Briefcase size={14} className="text-primary" />
                      Target Company Evaluation Cutoffs
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {companyReadiness.map((company) => (
                        <div key={company.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-on-surface">{company.name}</span>
                            <span className={cn('text-[9px] font-black uppercase px-2 py-0.5 rounded border', getCompanyGlow(company.score))}>
                              {company.score}% Ready
                            </span>
                          </div>
                          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
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
                    className="bg-surface-container-lowest p-6 border border-outline-variant/30 rounded-xl ambient-shadow flex flex-col items-center justify-center col-span-1"
                  >
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6">Sectional Balance</h3>
                    <div className="w-full h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={categoryData}>
                          <PolarGrid stroke="#eceef0" />
                          <PolarAngleAxis dataKey="category" stroke="#434655" fontSize={10} tickLine={false} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#737686" fontSize={9} />
                          <Radar name="Accuracy" dataKey="accuracy" stroke="#004ac6" fill="#004ac6" fillOpacity={0.2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Line Chart (Weekly Trend) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-surface-container-lowest p-6 border border-outline-variant/30 rounded-xl ambient-shadow lg:col-span-2"
                  >
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      Weekly Progress Tracker
                    </h3>

                    <div className="w-full h-52 text-on-surface-variant">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eceef0" />
                          <XAxis dataKey="date" stroke="#737686" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#737686" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              background: '#ffffff',
                              border: '1px solid #c3c6d7',
                              borderRadius: '10px',
                              color: '#191c1e',
                              boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.05)',
                            }}
                          />
                          <Line type="monotone" dataKey="score" stroke="#004ac6" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ fill: '#004ac6' }} />
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
                  className="bg-surface-container-lowest p-6 border border-outline-variant/30 rounded-xl ambient-shadow"
                >
                  <h3 className="text-xs font-black text-on-surface uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-outline-variant/30 pb-2.5">
                    <Lightbulb size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                    AI Action Recommendations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Advice 1 */}
                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/15 flex gap-3.5 text-xs md:text-sm leading-relaxed text-on-surface-variant font-semibold">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center shrink-0">
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-1">Boost Verbal Accuracy</h4>
                        <p className="text-on-surface-variant text-xs font-medium">
                          Your Verbal section accuracy is currently at <strong>68%</strong>. Practice sentence correction and synonyms pools before taking the Accenture ASE or Capgemini assessments.
                        </p>
                      </div>
                    </div>

                    {/* Advice 2 */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 flex gap-3.5 text-xs md:text-sm leading-relaxed text-on-surface-variant font-semibold">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Award size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-1">Specialist Programmers (SP) Prep</h4>
                        <p className="text-on-surface-variant text-xs font-medium">
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
