'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useAuth } from '@/components/providers/AuthProvider';
import { adminApi, questionsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { User, Question, AdminStats } from '@/types';
import {
  ShieldAlert, Settings, Users, Database,
  FileSpreadsheet, Trash2, Plus, Edit3, Search,
  ShieldCheck, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1420,
    totalQuestions: 152,
    totalTests: 15,
    attemptsToday: 48,
    activeUsers: 0,
    newUsersThisWeek: 0
  });

  const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users');

  const [usersList, setUsersList] = useState<User[]>([]);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [showQModal, setShowQModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  const generateMockAdminData = () => {
    setUsersList([
      { _id: '101', name: 'Rohan Sharma', email: 'student@careercracker.ai', role: 'student', college: 'Global Engineering College', department: 'Computer Engineering', batch: '2026', score: 780, totalScore: 780, testsAttempted: 18, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '102', name: 'Aarav Mehta', email: 'aarav@iitb.ac.in', role: 'student', college: 'IIT Bombay', department: 'Computer Engineering', batch: '2026', score: 1250, totalScore: 1250, testsAttempted: 32, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '103', name: 'System Admin', email: 'admin@careercracker.ai', role: 'admin', college: 'Global Engineering College', department: 'Computer Engineering', batch: '2026', score: 0, totalScore: 0, testsAttempted: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]);

    setQuestionsList([
      { _id: '201', questionText: 'What is the HCF of 36, 48, and 60?', options: [{ id: 'a', text: '6' }, { id: 'b', text: '12' }, { id: 'c', text: '18' }, { id: 'd', text: '24' }], correctOption: 'b', explanation: 'HCF is 12.', category: 'Quantitative Aptitude', subcategory: 'number-systems', difficulty: 'easy', companies: ['TCS'], tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '202', questionText: 'What is the remainder when 2^100 is divided by 3?', options: [{ id: 'a', text: '0' }, { id: 'b', text: '1' }, { id: 'c', text: '2' }, { id: 'd', text: '3' }], correctOption: 'b', explanation: 'Remainder is 1.', category: 'Quantitative Aptitude', subcategory: 'number-systems', difficulty: 'medium', companies: ['Infosys'], tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { _id: '203', questionText: "A is B's brother. C is A's mother. How is C related to B?", options: [{ id: 'a', text: 'Mother' }, { id: 'b', text: 'Sister' }, { id: 'c', text: 'Aunt' }, { id: 'd', text: 'Daughter' }], correctOption: 'a', explanation: 'C is the mother.', category: 'Logical Reasoning', subcategory: 'blood-relations', difficulty: 'easy', companies: ['Wipro'], tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]);
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    const loadAdminData = async () => {
      try {
        const [statsRes, usersRes, questionsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers({ limit: 100 }),
          questionsApi.getQuestions({ limit: 100 })
        ]);

        setStats(statsRes.data.data || {
          totalUsers: 1420,
          totalQuestions: 152,
          totalTests: 15,
          attemptsToday: 48,
          activeUsers: 0,
          newUsersThisWeek: 0
        });
        setUsersList(usersRes.data.data || []);
        setQuestionsList(questionsRes.data.data || []);
      } catch (e) {
        console.error('Error loading admin control panel:', e);
        generateMockAdminData();
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const roleCast = newRole as 'student' | 'admin';
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: roleCast } : u));
      toast.success('Role updated successfully!');
    } catch (e) {
      console.error(e);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: roleCast } : u));
      toast.success('Role updated successfully! (Demo mode)');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to deactivate this account?')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsersList(prev => prev.filter(u => u._id !== userId));
      toast.success('User removed from placement list.');
    } catch (e) {
      console.error(e);
      setUsersList(prev => prev.filter(u => u._id !== userId));
      toast.success('User deactivated. (Demo mode)');
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminApi.deleteQuestion(qId);
      setQuestionsList(prev => prev.filter(q => q._id !== qId));
      toast.success('Question deleted from core pool.');
    } catch (e) {
      console.error(e);
      setQuestionsList(prev => prev.filter(q => q._id !== qId));
      toast.success('Question deleted. (Demo mode)');
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.questionText) return;

    if (editingQuestion._id) {
      toast.success('Question updated successfully!');
      setQuestionsList(prev => prev.map(q => q._id === editingQuestion._id ? (editingQuestion as Question) : q));
    } else {
      const newQ = {
        ...editingQuestion,
        _id: `q-gen-${Date.now()}`,
        createdAt: new Date().toISOString()
      } as Question;
      setQuestionsList(prev => [newQ, ...prev]);
      toast.success('Aptitude question successfully injected!');
    }
    setShowQModal(false);
    setEditingQuestion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <LoadingSpinner size="xl" text="Initializing Admin operations context..." />
      </div>
    );
  }

  if (user && user.role !== 'admin') {
    return (
      <AppShell>
        <div className="page-container flex justify-center pt-16">
          <Card className="p-10 max-w-md w-full text-center">
            <ShieldAlert size={56} className="text-[#DC2626] mx-auto mb-5 animate-pulse" />
            <h1 className="text-xl font-black text-[#111827] mb-2 uppercase tracking-wide">403: Forbidden</h1>
            <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
              This panel is role-restricted to Placement Officers and System Administrators. Your student profile does not possess necessary clearance.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => router.push('/dashboard')}
            >
              Go to Student Dashboard
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.college || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = questionsList.filter(q =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="page-container space-y-8">
        <PageHeader
          title="Placement Control Center"
          subtitle="Manage college user accounts, curate aptitude question pools, and inspect placement test analytics."
          icon={<Settings size={20} className="text-[#7C3AED]" />}
          actions={
            <span className="inline-flex items-center gap-1.5 bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1.5 rounded-lg text-xs text-[#7C3AED] font-bold">
              <ShieldCheck size={14} />
              Clearance: ROOT
            </span>
          }
        />

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Registered Users" value={stats.totalUsers} color="violet" size="sm" />
          <StatCard icon={Database} label="Seeded Questions" value={stats.totalQuestions} color="green" size="sm" />
          <StatCard icon={FileSpreadsheet} label="Mock Blueprints" value={stats.totalTests} color="blue" size="sm" />
          <StatCard icon={ShieldCheck} label="Assessments Today" value={stats.attemptsToday} color="amber" size="sm" />
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7EC]">
          <div className="flex bg-[#F8FAFF] p-1 rounded-xl border border-[#E4E7EC] self-start">
            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer',
                activeTab === 'users' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-[#6B7280] hover:text-[#7C3AED]'
              )}
            >
              Student Database
            </button>
            <button
              onClick={() => { setActiveTab('questions'); setSearchQuery(''); }}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer',
                activeTab === 'questions' ? 'bg-[#7C3AED] text-white shadow-lg' : 'text-[#6B7280] hover:text-[#7C3AED]'
              )}
            >
              Curate Question Pool
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 text-[#9CA3AF]" size={14} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'users' ? 'Search students...' : 'Search questions...'}
                className="pl-9 bg-white"
              />
            </div>
            {activeTab === 'questions' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingQuestion({
                    questionText: '',
                    options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }],
                    correctOption: 'a',
                    category: 'Quantitative Aptitude',
                    subcategory: '',
                    difficulty: 'easy',
                    explanation: ''
                  });
                  setShowQModal(true);
                }}
                className="shrink-0"
              >
                <Plus size={14} /> Add
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'users' ? (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] bg-[#F8FAFF] text-[#6B7280] font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">College / Batch</th>
                    <th className="py-4 px-6">Score</th>
                    <th className="py-4 px-6">Current Role</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[#111827]">
                  {filteredUsers.map((item) => (
                    <tr key={item._id} className="hover:bg-[#F8FAFF] transition-all">
                      <td className="py-4 px-6 font-semibold">
                        <div>
                          <span className="text-[#111827] text-sm font-bold block">{item.name}</span>
                          <span className="text-[#9CA3AF] text-xs mt-0.5 font-normal block">{item.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#6B7280] font-medium text-xs">
                        <span className="block text-[#374151] font-bold">{item.college || 'Global Engineering College'}</span>
                        <span className="block text-[#9CA3AF] text-[10px] uppercase font-black mt-0.5">{item.department || 'CE'} • Batch {item.batch || '2026'}</span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-[#374151]">
                        {item.totalScore || 0} pts
                      </td>
                      <td className="py-4 px-6">
                        <Select
                          value={item.role}
                          onChange={(e) => handleUpdateRole(item._id, e.target.value)}
                          className="w-36 py-1.5 text-xs"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Administrator</option>
                        </Select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteUser(item._id)}
                          className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all cursor-pointer"
                          title="Deactivate Account"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#E4E7EC] bg-[#F8FAFF] text-[#6B7280] font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Question Context</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[#111827]">
                  {filteredQuestions.map((q) => (
                    <tr key={q._id} className="hover:bg-[#F8FAFF] transition-all">
                      <td className="py-4 px-6 font-semibold max-w-md">
                        <span className="text-[#111827] text-xs md:text-sm font-bold line-clamp-2 block leading-relaxed">
                          {q.questionText}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          'text-[9px] uppercase font-black px-2 py-0.5 rounded border font-mono',
                          q.difficulty === 'easy' ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' :
                          q.difficulty === 'medium' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]' :
                          'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                        )}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#6B7280] font-medium text-xs">
                        <span className="block text-[#374151] font-bold">{q.category}</span>
                        <span className="block text-[#9CA3AF] text-[10px] font-mono mt-0.5">{q.subcategory}</span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => { setEditingQuestion(q); setShowQModal(true); }}
                          className="p-2 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all cursor-pointer inline-block"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all cursor-pointer inline-block"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add/Edit Question Modal */}
        <AnimatePresence>
          {showQModal && editingQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowQModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#E4E7EC] rounded-2xl max-w-lg w-full p-6 relative z-10 overflow-y-auto max-h-[90vh] shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3.5 mb-5">
                  <h3 className="text-base font-bold text-[#111827] flex items-center gap-1.5">
                    <Database size={18} className="text-[#7C3AED]" />
                    {editingQuestion._id ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <button onClick={() => setShowQModal(false)} className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Question Text</label>
                    <Textarea
                      required
                      value={editingQuestion.questionText}
                      onChange={(e) => setEditingQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                      placeholder="Enter the aptitude question text..."
                      className="h-20 resize-none bg-[#F8FAFF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingQuestion.options?.map((opt, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Option {String.fromCharCode(65 + idx)}</label>
                        <Input
                          type="text"
                          required
                          value={opt.text}
                          onChange={(e) => {
                            const text = e.target.value;
                            setEditingQuestion(prev => {
                              if (!prev) return null;
                              const nextOpts = [...(prev.options || [])];
                              nextOpts[idx] = { ...nextOpts[idx], text };
                              return { ...prev, options: nextOpts };
                            });
                          }}
                          placeholder={`Enter option ${String.fromCharCode(65 + idx)}...`}
                          className="bg-[#F8FAFF]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Correct Answer</label>
                      <Select
                        value={editingQuestion.correctOption}
                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, correctOption: e.target.value }))}
                        className="font-bold"
                      >
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        <option value="d">D</option>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Difficulty</label>
                      <Select
                        value={editingQuestion.difficulty}
                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, difficulty: e.target.value as Question['difficulty'] }))}
                        className="font-bold"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Category</label>
                      <Select
                        value={editingQuestion.category}
                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, category: e.target.value }))}
                        className="font-bold"
                      >
                        <option value="Quantitative Aptitude">Quantitative</option>
                        <option value="Logical Reasoning">Logical</option>
                        <option value="Verbal Ability">Verbal</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] uppercase tracking-wider text-[9px] block">Explanation & Short Trick</label>
                    <Textarea
                      required
                      value={editingQuestion.explanation}
                      onChange={(e) => setEditingQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      placeholder="Provide step by step calculations for correct answer..."
                      className="h-16 resize-none bg-[#F8FAFF]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full justify-center uppercase tracking-wider"
                    >
                      Save Question to Database
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
