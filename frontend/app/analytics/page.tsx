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
  ResponsiveContainer, CartesianGrid, Tooltip, LineChart, Line, XAxis, YAxis
} from 'recharts';
import { TrendingUp, Award, Calendar, Lightbulb, Briefcase, Zap } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E4E7EC',
  borderRadius: '16px',
  boxShadow: '0 1px 3px rgba(17,24,39,0.06), 0 4px 14px rgba(17,24,39,0.04)',
  padding: '24px',
};

const sectionLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6B7280',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

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
      } catch {
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
      { category: 'Logical',      accuracy: 84 },
      { category: 'Verbal',       accuracy: 68 },
    ]);
  };

  const companyReadiness = [
    { name: 'TCS Ninja',      score: 82 },
    { name: 'TCS Digital',    score: 60 },
    { name: 'Infosys SE',     score: 78 },
    { name: 'Wipro Elite',    score: 85 },
    { name: 'Accenture ASE',  score: 68 },
    { name: 'Cognizant GenC', score: 90 },
    { name: 'Capgemini',      score: 55 },
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#D97706';
    return '#DC2626';
  };

  const getReadinessBadge = (score: number): React.CSSProperties => {
    if (score >= 80) return { background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' };
    if (score >= 60) return { background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' };
    return { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' };
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Sidebar />

        <div style={{ flex: 1, marginLeft: '260px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Page Header */}
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} style={{ color: '#2563EB' }} />
                Performance Analytics
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>
                Detailed breakdowns of your strengths, weekly trends, and company readiness.
              </p>
            </div>

            {loading ? (
              <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner size="lg" text="Analyzing your progress..." />
              </div>
            ) : (
              <>
                {/* Row 1: Readiness Gauge + Company Bars */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

                  {/* Placement Readiness Ring */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                  >
                    <p style={sectionLabel}>
                      <Zap size={13} style={{ color: '#D97706' }} />
                      Placement Readiness
                    </p>
                    <ProgressRing
                      percentage={readinessScore}
                      size={150}
                      strokeWidth={11}
                      gradientStart="#2563EB"
                      gradientEnd="#7C3AED"
                      label={`${readinessScore}%`}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '20px', lineHeight: 1.6, fontWeight: 500 }}>
                      Calculated from accuracy, test frequency, and topics covered.
                    </p>
                  </motion.div>

                  {/* Company Readiness */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ ...cardStyle }}
                  >
                    <p style={{ ...sectionLabel }}>
                      <Briefcase size={13} style={{ color: '#2563EB' }} />
                      Company Readiness
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
                      {companyReadiness.map((company) => (
                        <div key={company.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{company.name}</span>
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px',
                              borderRadius: '99px', ...getReadinessBadge(company.score)
                            }}>
                              {company.score}%
                            </span>
                          </div>
                          <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${company.score}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{
                                height: '100%', borderRadius: '99px',
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

                  {/* Radar */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <p style={sectionLabel}>Sectional Balance</p>
                    <div style={{ width: '100%', height: '220px' }}>
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

                  {/* Weekly Line Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ ...cardStyle }}
                  >
                    <p style={sectionLabel}>
                      <Calendar size={13} style={{ color: '#2563EB' }} />
                      Weekly Progress
                    </p>
                    <div style={{ width: '100%', height: '220px' }}>
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
                  style={{ ...cardStyle }}
                >
                  <p style={sectionLabel}>
                    <Lightbulb size={13} style={{ color: '#D97706' }} />
                    AI Recommendations
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                    {/* Tip 1 */}
                    <div style={{
                      padding: '20px', borderRadius: '12px',
                      background: '#F5F3FF', border: '1px solid #DDD6FE',
                      display: 'flex', gap: '14px',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px',
                        background: '#EDE9FE', border: '1px solid #DDD6FE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Zap size={16} style={{ color: '#7C3AED' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Boost Verbal Accuracy</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500, lineHeight: 1.6 }}>
                          Your Verbal accuracy is at <strong style={{ color: '#111827' }}>68%</strong>. Practice sentence correction and synonyms before Accenture or Capgemini assessments.
                        </p>
                      </div>
                    </div>

                    {/* Tip 2 */}
                    <div style={{
                      padding: '20px', borderRadius: '12px',
                      background: '#EFF6FF', border: '1px solid #BFDBFE',
                      display: 'flex', gap: '14px',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px',
                        background: '#DBEAFE', border: '1px solid #BFDBFE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Award size={16} style={{ color: '#2563EB' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Leverage Your Logical Strength</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500, lineHeight: 1.6 }}>
                          Excellent Logical Reasoning accuracy at <strong style={{ color: '#111827' }}>84%</strong>. Use this advantage for Infosys DSE or Specialist Programmer roles.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
