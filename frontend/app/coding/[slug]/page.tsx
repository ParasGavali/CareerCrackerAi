'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { codingApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { CodingProblem, CodingSubmission } from '@/types';
import {
  Code2, Terminal, CheckCircle2, XCircle, Play,
  Send, RotateCcw, HelpCircle, ChevronLeft, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProblemPlaygroundPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  
  // IDE State
  const [language, setLanguage] = useState<'javascript' | 'python' | 'c' | 'cpp' | 'java'>('javascript');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'submissions'>('description');
  const [expandedHintIndex, setExpandedHintIndex] = useState<number | null>(null);

  // Stdin & Stdout sandbox states
  const [customInput, setCustomInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalResult, setTerminalResult] = useState<{
    status: string;
    output: string;
    error: string | null;
    executionTime?: number;
    passed?: number;
    total?: number;
    testCasesPassed?: number;
    totalTestCases?: number;
  } | null>(null);

  const [pastSubmissions, setPastSubmissions] = useState<CodingSubmission[]>([]);

  // 1. Initialise problem
  useEffect(() => {
    const initProblem = async () => {
      try {
        const res = await codingApi.getProblem(slug);
        const data = res.data.data;
        if (data) {
          setProblem(data);
          const temps = data.solutionTemplates || {};
          setCode(temps.javascript || '// Write code here');
          fetchSubmissions(data._id);
        }
      } catch (err) {
        console.error('Error fetching problem details, loading offline sandbox:', err);
        const fallback = generateFallbackProblem(slug);
        if (fallback) {
          setProblem(fallback);
          setCode(fallback.solutionTemplates?.javascript || '// Write code here');
        } else {
          toast.error('Problem not found');
          router.push('/coding');
        }
      } finally {
        setLoading(false);
      }
    };
    initProblem();
  }, [slug]);

  const fetchSubmissions = async (problemId: string) => {
    try {
      const res = await codingApi.getMySubmissions(problemId);
      setPastSubmissions(res.data.data || []);
    } catch (e) {
      console.error('Error loading submissions:', e);
    }
  };

  const generateFallbackProblem = (pSlug: string): CodingProblem | null => {
    const list = [
      {
        _id: '1',
        title: 'Two Sum',
        slug: 'two-sum',
        description: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p><p>You can return the answer in any order, but for standard output, print the two indices separated by a space, sorted in ascending order (e.g., <code>0 1</code>).</p>',
        difficulty: 'easy' as const,
        category: 'arrays',
        companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        inputFormat: 'First line contains the target.\nSecond line contains size of array, N.\nThird line contains N space-separated integers.',
        outputFormat: 'Print the two indices separated by a space (sorted in ascending order).',
        examples: [
          { input: '9\n4\n2 7 11 15', output: '0 1', explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.' }
        ],
        testCases: [
          { input: '9\n4\n2 7 11 15', expectedOutput: '0 1', isHidden: false }
        ],
        solutionTemplates: {
          javascript: `// Two Sum in JavaScript\n// Use readline() to read stdin\nconst target = parseInt(readline().trim());\nconst n = parseInt(readline().trim());\nconst nums = readline().trim().split(' ').map(Number);\n\nfunction solve(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconsole.log(solve(nums, target).join(' '));`,
          python: `# Two Sum in Python\nimport sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    target = int(lines[0].strip())\n    n = int(lines[1].strip())\n    nums = list(map(int, lines[2].strip().split()))\n    \n    mapping = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in mapping:\n            print(f"{mapping[diff]} {i}")\n            return\n        mapping[num] = i\n\nif __name__ == '__main__':\n    solve()`,
          cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std; \n\nint main() {\n    int target, n;\n    if (!(cin >> target >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    \n    unordered_map<int, int> m;\n    for (int i = 0; i < n; i++) {\n        int diff = target - nums[i];\n        if (m.find(diff) != m.end()) {\n            cout << m[diff] << " " << i << endl;\n            return 0;\n        }\n        m[nums[i]] = i;\n    }\n    return 0;\n}`,
          c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int target, n;\n    if (scanf("%d %d", &target, &n) == EOF) return 0;\n    int* nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                free(nums);\n                return 0;\n            }\n        }\n    }\n    free(nums);\n    return 0;\n}`,
          java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int target = sc.nextInt();\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                System.out.println(map.get(diff) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}`
        },
        hints: ['Use a hash map to search complement in O(1) time.', 'Complement is: target - nums[i]'],
        acceptanceRate: 72.5
      }
    ];
    return (list.find(item => item.slug === pSlug) || list[0]) as any as CodingProblem;
  };

  const handleLanguageChange = (lang: typeof language) => {
    setLanguage(lang);
    if (problem) {
      const temps = problem.solutionTemplates || {};
      setCode(temps[lang] || `// Solution in ${lang}`);
    }
  };

  const handleResetCode = () => {
    if (problem) {
      const temps = problem.solutionTemplates || {};
      setCode(temps[language] || '');
      toast.success('Code reset to default template');
    }
  };

  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setTerminalResult(null);
    toast.loading('Compiling and running code sandbox...', { id: 'run-toast' });

    try {
      const res = await codingApi.runCode(problem._id, code, language, customInput || '9\n4\n2 7 11 15');
      const data = res.data.data;
      
      toast.success('Execution completed!', { id: 'run-toast' });
      setTerminalResult({
        status: data?.status || 'success',
        output: data?.output || '',
        error: data?.error || null,
        executionTime: data?.executionTime
      });
    } catch (err: any) {
      console.error('Error running code sandbox:', err);
      toast.error('Execution Failed, sandbox environment down', { id: 'run-toast' });
      setTerminalResult({
        status: 'runtime-error',
        output: '',
        error: err.response?.data?.message || err.message || 'Execution error.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setTerminalResult(null);
    toast.loading('Running all test cases against secure sandbox...', { id: 'submit-toast' });

    try {
      const res = await codingApi.submitCode(problem._id, code, language);
      const data = res.data.data;

      if (data?.status === 'accepted') {
        toast.success('Accepted! All test cases passed 🎉', { id: 'submit-toast', duration: 4000 });
      } else {
        toast.error(`Submission Failed: ${data?.status || 'Incorrect'}`, { id: 'submit-toast' });
      }

      setTerminalResult({
        status: data?.status || 'wrong-answer',
        output: data?.output || '',
        error: data?.errorMessage || data?.error || null,
        executionTime: data?.executionTime,
        passed: data?.testCasesPassed,
        total: data?.totalTestCases
      });

      fetchSubmissions(problem._id);
    } catch (err: any) {
      console.error('Error submitting code:', err);
      toast.error('Submission Failed.', { id: 'submit-toast' });
      setTerminalResult({
        status: 'runtime-error',
        output: '',
        error: err.response?.data?.message || err.message || 'Sandbox compilation/submission failed.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner size="xl" text="Pre-heating Node child-process container sandbox..." />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="text-center bg-surface-container-lowest p-8 border border-outline-variant rounded-2xl ambient-shadow max-w-sm w-full mx-auto">
          <HelpCircle size={48} className="text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold">Problem Not Found</h2>
          <button onClick={() => router.push('/coding')} className="btn-glow mt-4 px-6 py-2.5 rounded-xl cursor-pointer">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface text-on-surface flex flex-col">
        {/* Full IDE Header bar */}
        <div className="bg-surface-container border-b border-outline-variant/30 px-4 py-3 flex items-center justify-between gap-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/coding')}
              className="text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Code2 className="text-primary" />
              <h2 className="text-sm font-extrabold text-on-surface">{problem.title}</h2>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang dropdown */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as any)}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer transition-all font-bold shadow-sm"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="c">C (GCC)</option>
              <option value="cpp">C++ 17 (G++)</option>
              <option value="java">Java (OpenJDK)</option>
            </select>

            <button
              onClick={handleResetCode}
              className="p-2 rounded-xl bg-surface border border-outline-variant/40 text-on-surface-variant hover:text-primary transition-all cursor-pointer shadow-sm"
              title="Reset Template Code"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Workspace body (Split screen 40/60) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-surface">
          
          {/* Left panel: Problem Description & submissions (40%) */}
          <div className="w-full md:w-[40%] border-r border-outline-variant/30 bg-surface flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30 bg-surface-container shrink-0">
              <button
                onClick={() => setActiveLeftTab('description')}
                className={cn(
                  'px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer',
                  activeLeftTab === 'description'
                    ? 'border-primary text-primary bg-surface font-black'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                )}
              >
                Description
              </button>
              <button
                onClick={() => setActiveLeftTab('submissions')}
                className={cn(
                  'px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer',
                  activeLeftTab === 'submissions'
                    ? 'border-primary text-primary bg-surface font-black'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                )}
              >
                Submissions ({pastSubmissions.length})
              </button>
            </div>

            {/* Description Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-on-surface">
              <AnimatePresence mode="wait">
                {activeLeftTab === 'description' ? (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6 text-sm leading-relaxed text-on-surface-variant font-semibold"
                  >
                    {/* HTML description */}
                    <div
                      className="prose prose-slate max-w-none text-on-surface-variant text-xs md:text-sm"
                      dangerouslySetInnerHTML={{ __html: problem.description }}
                    />

                    {/* Constraints */}
                    {problem.constraints && (
                      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 space-y-2 ambient-shadow">
                        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Constraints:</h4>
                        <pre className="text-xs text-secondary font-mono whitespace-pre-wrap font-bold">{problem.constraints}</pre>
                      </div>
                    )}

                    {/* Formats */}
                    {(problem.inputFormat || problem.outputFormat) && (
                      <div className="grid grid-cols-1 gap-4">
                        {problem.inputFormat && (
                          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 ambient-shadow">
                            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">Input Format:</h4>
                            <p className="text-xs text-on-surface-variant">{problem.inputFormat}</p>
                          </div>
                        )}
                        {problem.outputFormat && (
                          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 ambient-shadow">
                            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">Output Format:</h4>
                            <p className="text-xs text-on-surface-variant">{problem.outputFormat}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Examples */}
                    {problem.examples && problem.examples.map((eg, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Example {idx + 1}:</h4>
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-mono text-xs space-y-2 ambient-shadow text-on-surface-variant">
                          <p><strong className="text-primary font-bold">Input:</strong><br />{eg.input}</p>
                          <p><strong className="text-secondary font-bold">Output:</strong><br />{eg.output}</p>
                          {eg.explanation && <p className="text-on-surface-variant italic mt-1 font-sans"><strong className="text-on-surface not-italic font-bold">Explanation:</strong> {eg.explanation}</p>}
                        </div>
                      </div>
                    ))}

                    {/* Hints (Expandable) */}
                    {problem.hints && problem.hints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Hints:</h4>
                        <div className="space-y-2">
                          {problem.hints.map((hint, hIdx) => {
                            const isExpanded = expandedHintIndex === hIdx;
                            return (
                              <div key={hIdx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden text-xs ambient-shadow">
                                <button
                                  onClick={() => setExpandedHintIndex(isExpanded ? null : hIdx)}
                                  className="w-full text-left px-4 py-3 font-bold text-on-surface-variant hover:text-primary flex items-center justify-between cursor-pointer"
                                >
                                  <span>Hint {hIdx + 1}</span>
                                  <span className="text-[10px] text-primary font-bold uppercase">{isExpanded ? 'Hide' : 'Reveal'}</span>
                                </button>
                                {isExpanded && (
                                  <div className="px-4 pb-3 text-on-surface-variant font-medium leading-relaxed border-t border-outline-variant/30 pt-2 bg-surface">
                                    {hint}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // Submissions Tab Contents
                  <motion.div
                    key="subs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    {pastSubmissions.length === 0 ? (
                      <div className="text-center py-12 text-on-surface-variant font-medium text-xs">
                        No submissions recorded for this challenge yet.
                      </div>
                    ) : (
                      pastSubmissions.map((sub) => (
                        <div
                          key={sub._id}
                          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs font-mono ambient-shadow"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {sub.status === 'accepted' ? (
                                <span className="text-emerald-600 font-black flex items-center gap-0.5">
                                  <CheckCircle2 size={13} /> ACCEPTED
                                </span>
                              ) : (
                                <span className="text-red-600 font-black flex items-center gap-0.5">
                                  <XCircle size={13} /> {sub.status?.toUpperCase() || 'FAILED'}
                                </span>
                              )}
                              <span className="text-[10px] bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded text-primary uppercase font-bold">
                                {sub.language}
                              </span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant font-sans font-semibold">
                              {new Date(sub.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="text-right space-y-1">
                            <p className="text-on-surface font-bold">{sub.testCasesPassed || 0}/{sub.totalTestCases || 1} Passed</p>
                            <p className="text-[10px] text-on-surface-variant font-semibold">{sub.executionTime || 0}ms execution</p>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right panel: Editor & Terminal Console (60%) */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c14]">
            
            {/* Editor Area (70%) */}
            <div className="flex-1 min-h-[40vh] relative">
              <Editor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || '')}
                options={{
                  fontFamily: 'Fira Code, Source Code Pro, monospace',
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  cursorBlinking: 'smooth',
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible'
                  }
                }}
              />
            </div>

            {/* Console Console / Interactive Stdin box (30%) */}
            <div className="h-64 border-t border-outline-variant/30 bg-surface-container flex flex-col overflow-hidden shrink-0">
              {/* Header Tab selectors */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface px-4 shrink-0 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 py-3">
                  <Terminal size={12} className="text-primary" />
                  Terminal Console Sandbox
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="inline-flex items-center gap-1 bg-surface border border-outline-variant/40 hover:bg-surface-container-low text-on-surface-variant px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    <Play size={12} className="text-emerald-600 fill-emerald-600/10" />
                    Run Code
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isRunning || isSubmitting}
                    className="inline-flex items-center gap-1 bg-primary hover:bg-secondary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Send size={12} />
                    {isSubmitting ? 'Submitting...' : 'Submit Code'}
                  </button>
                </div>
              </div>

              {/* Console Body */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30 overflow-hidden">
                {/* Input Textbox (Left) */}
                <div className="flex flex-col p-3 overflow-hidden bg-surface">
                  <label className="text-[9px] font-black uppercase text-on-surface-variant tracking-wider mb-1 block">Custom Standard Input (Stdin)</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter standard input parameters here (e.g. 9\n4\n2 7 11 15)"
                    className="w-full flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-mono text-on-surface resize-none focus:border-primary focus:outline-none shadow-sm"
                  />
                </div>

                {/* Output Console Box (Right) */}
                <div className="flex flex-col p-3 overflow-y-auto bg-surface-container-lowest font-mono text-xs text-on-surface">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant tracking-wider mb-2 block">Standard Output / Sandbox Verdict</span>

                  {isRunning || isSubmitting ? (
                    <div className="flex-1 flex items-center justify-center bg-surface">
                      <LoadingSpinner size="sm" text="Executing code..." />
                    </div>
                  ) : terminalResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                        {terminalResult.status === 'accepted' || terminalResult.status === 'success' ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 size={13} /> {terminalResult.status.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-red-600 font-bold flex items-center gap-1 text-[11px]">
                            <XCircle size={13} /> {terminalResult.status.toUpperCase()}
                          </span>
                        )}
                        {terminalResult.executionTime !== undefined && (
                          <span className="text-[10px] text-on-surface-variant font-semibold">Execution time: {terminalResult.executionTime}ms</span>
                        )}
                      </div>

                      {terminalResult.passed !== undefined && terminalResult.total !== undefined && (
                        <p className="text-[11px] text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-lg inline-block">
                          🎯 Test cases passed: {terminalResult.passed} / {terminalResult.total}
                        </p>
                      )}

                      {/* Error or stdout display */}
                      {terminalResult.error ? (
                        <pre className="text-red-600 whitespace-pre-wrap font-mono text-[11px] bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
                          {terminalResult.error}
                        </pre>
                      ) : (
                        <pre className="text-on-surface whitespace-pre-wrap font-mono text-[11px] bg-surface border border-outline-variant/30 p-3 rounded-lg mt-2 font-semibold">
                          {terminalResult.output || '[No output was produced]'}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant text-[10px] border border-dashed border-outline-variant rounded-xl bg-surface">
                      <Terminal size={22} className="text-outline mb-1" />
                      Compile or Submit to see execution results.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
