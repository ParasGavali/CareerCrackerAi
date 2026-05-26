// ==================== USER ====================
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  department?: string;
  batch?: string;
  role: 'student' | 'admin';
  profilePicture?: string;
  score: number;
  totalScore?: number;
  rank?: number;
  testsAttempted: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== QUESTION ====================
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  _id: string;
  questionText: string;
  options: QuestionOption[];
  correctOption?: string;
  explanation?: string;
  category: string;
  shortcutTrick?: string;
  subcategory: string;
  difficulty: 'easy' | 'medium' | 'hard';
  companies: string[];
  tags: string[];
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionWithAnswer extends Question {
  userAnswer?: string;
  isCorrect?: boolean;
  timeTaken?: number;
}

// ==================== TEST ====================
export interface Test {
  _id: string;
  title: string;
  description?: string;
  type?: 'company' | 'topic' | 'quick' | 'full';
  company?: string;
  category?: string;
  questions: Question[] | string[];
  duration: number; // in minutes
  totalMarks: number;
  passingMarks?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  instructions?: string[];
  isActive: boolean;
  attemptCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestAttempt {
  _id: string;
  test: Test | string;
  user: User | string;
  answers: {
    question: string;
    selectedOption: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  score: number;
  percentage: number;
  grade: string;
  timeTaken: number; // in seconds
  tabSwitches: number;
  startedAt: string;
  submittedAt: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  totalQuestions: number;
  createdAt: string;
  rank?: number;
  categoryScores?: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

// ==================== CODING ====================
export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isSample: boolean;
}

export interface CodingProblem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'arrays' | 'strings' | 'dp' | 'math' | 'sorting' | 'graphs' | 'trees' | 'greedy';
  companies?: string[];
  companyTags?: string[];
  tags?: string[];
  starterCode?: {
    language: string;
    code: string;
  }[];
  solutionTemplates?: {
    c?: string;
    cpp?: string;
    java?: string;
    python?: string;
    javascript?: string;
  };
  totalSubmissions?: number;
  acceptedSubmissions?: number;
  acceptanceRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CodingSubmission {
  _id: string;
  problem: CodingProblem | string;
  user: User | string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error' | 'pending';
  executionTime?: number;
  memoryUsed?: number;
  testCasesPassed: number;
  totalTestCases: number;
  output?: string;
  error?: string;
  errorMessage?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CodeRunResult {
  status: string;
  output: string;
  error?: string;
  executionTime?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  testResults?: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }[];
}

// ==================== ANALYTICS ====================
export interface DashboardStats {
  user: User;
  overallScore: number;
  testsAttempted: number;
  questionsAttempted: number;
  accuracy: number;
  rank: number;
  totalUsers: number;
  placementReadiness: number;
  recentAttempts: TestAttempt[];
  weakTopics: {
    topic: string;
    accuracy: number;
    questionsAttempted: number;
  }[];
  categoryPerformance: {
    category: string;
    accuracy: number;
    questionsAttempted: number;
  }[];
  weeklyProgress: {
    date: string;
    score: number;
    testsAttempted: number;
  }[];
  recommendedTests: Test[];
  companyReadiness: {
    company: string;
    readiness: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  user?: {
    _id: string;
    name: string;
    college?: string;
    department?: string;
    batch?: string;
  };
  _id?: string;
  userId?: string;
  avatar?: string;
  name: string;
  college?: string;
  totalScore: number;
  score?: number;
  testsAttempted: number;
  accuracy: number;
  badge?: string;
}

export interface Analytics {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  averageTime: number;
  categoryBreakdown: {
    category: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  topicBreakdown: {
    topic: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  difficultyBreakdown: {
    difficulty: string;
    correct: number;
    total: number;
  }[];
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== ADMIN ====================
export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalTests: number;
  attemptsToday: number;
  activeUsers: number;
  newUsersThisWeek: number;
}

// ==================== AUTH ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  department?: string;
  batch?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
}

// ==================== FORM TYPES ====================
export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  flagged: Set<string>;
  startTime: number;
  questionTimes: Record<string, number>;
}
