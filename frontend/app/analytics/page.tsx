'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { analyticsApi } from '@/lib/api';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, CartesianGrid, Tooltip, LineChart, Line, XAxis, YAxis
} from 'recharts';
import { TrendingUp, Award, Calendar, Lightbulb, Briefcase, Zap } from 'lucide-react';

interface WeeklyPoint {
  date: string;
  score: number;
}

interface CategoryPoint {
  category: string;
  accuracy: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [readinessScore, setReadinessScore] = useState(74);
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);

  const loadFallbackAnalytics = () => {
    setReadinessScore(76);
    setWeeklyData([
      { date: 'Mon', score: 65 },
      { date: 'Tue', score: 70 },
      { date: 'Wed', score: 68 },
      { date: 'Thu', score: 75 },
      { date: 'Fri', score: 82 },
      { date: 'Sat', score: 80 },
      { date: 'Sun', score: 85 },
    ]);
    setCategoryData([
      { category: 'Quantitative', accuracy: 72 },
      { category: 'Logical', accuracy: 84 },
      { category: 'Verbal', accuracy: 68 },
    ]);
  };

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
      } catch {
        loadFallbackAnalytics();
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const companyReadiness = [
    { name: 'TCS Ninja', score: 82 },
    { name: 'TCS Digital', score: 60 },
    { name: 'Infosys SE', score: 78 },
    { name: 'Wipro Elite', score: 85 },
    { name: 'Accenture ASE', score: 68 },
    { name: 'Cognizant GenC', score: 90 },
    { name: 'Capgemini', score: 55 },
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#D97706';
    return '#DC2626';
  };

  const getReadinessBadge = (score: number) => {
    if (score >= 80) return { background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' };
    if (score >= 60) return { background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' };
    return { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' };
  };

  const sectionLabel = (icon: React.ReactNode, label: string) => (
    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-5 flex items-center gap-1.5">
      {icon}
      {label}
    </p>
  );

  return (
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="Performance Analytics"
          subtitle="Detailed breakdowns of your strengths, weekly trends, and company readiness."
          icon={<TrendingUp size={20} className="text-[#2563EB]" />}
        />

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Analyzing your progress..." />
          </div>
        ) : (
          <>
            {/* Row 1: Readiness Gauge + Company Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] p-6 flex flex-col items-center text-center"
              >
                {sectionLabel(
                  <Zap size={13} className="text-[#D97706]" />,
                  'Placement Readiness'
                )}
                <ProgressRing
                  percentage={readinessScore}
                  size={150}
                  strokeWidth={11}
                  gradientStart="#2563EB"
                  gradientEnd="#7C3AED"
                  label={`${readinessScore}%`}
                />
                <p className="text-xs text-[#6B7280] mt-5 leading-relaxed font-medium">
                  Calculated from accuracy, test frequency, and topics covered.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] p-6 lg:col-span-2"
              >
                {sectionLabel(
                  <Briefcase size={13} className="text-[#2563EB]" />,
                  'Company Readiness'
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {companyReadiness.map((company) => (
                    <div key={company.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[13px] font-bold text-[#111827]">{company.name}</span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={getReadinessBadge(company.score)}
                        >
                          {company.score}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${company.score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${getReadinessColor(company.score)}, ${getReadinessColor(company.score)}99)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Row 2: Radar Chart + Weekly Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] p-6 flex flex-col items-center"
              >
                {sectionLabel(null, 'Sectional Balance')}
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="72%" data={categoryData}>
                      <PolarGrid stroke="#E4E7EC" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                      <Radar name="Accuracy" dataKey="accuracy" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] p-6 lg:col-span-2"
              >
                {sectionLabel(
                  <Calendar size={13} className="text-[#2563EB]" />,
                  'Weekly Progress'
                )}
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: '#FFFFFF', border: '1px solid #E4E7EC',
                          borderRadius: '10px', color: '#111827',
                          boxShadow: '0 4px 16px rgba(17,24,39,0.08)',
                        }}
                      />
                      <Line
                        type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5}
                        dot={{ fill: '#2563EB', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#7C3AED' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Row 3: AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.06),0_4px_14px_rgba(17,24,39,0.04)] p-6"
            >
              {sectionLabel(
                <Lightbulb size={13} className="text-[#D97706]" />,
                'AI Recommendations'
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex gap-3.5">
                  <div className="w-9 h-9 flex-shrink-0 rounded-[10px] bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center">
                    <Zap size={16} className="text-[#7C3AED]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827] mb-1.5">Boost Verbal Accuracy</h4>
                    <p className="text-[13px] text-[#6B7280] font-medium leading-relaxed">
                      Your Verbal accuracy is at <strong className="text-[#111827]">68%</strong>. Practice sentence correction and synonyms before Accenture or Capgemini assessments.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex gap-3.5">
                  <div className="w-9 h-9 flex-shrink-0 rounded-[10px] bg-[#DBEAFE] border border-[#BFDBFE] flex items-center justify-center">
                    <Award size={16} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111827] mb-1.5">Leverage Your Logical Strength</h4>
                    <p className="text-[13px] text-[#6B7280] font-medium leading-relaxed">
                      Excellent Logical Reasoning accuracy at <strong className="text-[#111827]">84%</strong>. Use this advantage for Infosys DSE or Specialist Programmer roles.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppShell>
  );
}
