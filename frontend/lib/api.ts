import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth';
import type {
  User, Question, Test, TestAttempt, CodingProblem, CodingSubmission,
  CodeRunResult, DashboardStats, LeaderboardEntry, AdminStats,
  AuthResponse, PaginatedResponse, ApiResponse
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==================== AXIOS INSTANCE ====================
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data.data;
        saveTokens(newToken, newRefreshToken);
        onRefreshed(newToken);
        isRefreshing = false;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        clearTokens();
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: {
    name: string; email: string; password: string;
    phone?: string; college?: string; department?: string; batch?: string;
  }) => api.post<AuthResponse>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// ==================== QUESTIONS APIs ====================
export const questionsApi = {
  getQuestions: (params?: {
    category?: string; subcategory?: string; difficulty?: string;
    company?: string; page?: number; limit?: number;
  }) => api.get<PaginatedResponse<Question>>('/questions', { params }),

  getRandomQuestions: (params: {
    category?: string; difficulty?: string; count?: number; company?: string;
  }) => api.get<ApiResponse<Question[]>>('/questions/random', { params }),

  getQuestion: (id: string) =>
    api.get<ApiResponse<Question>>(`/questions/${id}`),

  getCategories: () =>
    api.get<ApiResponse<{ category: string; count: number; subcategories: string[] }[]>>('/questions/categories'),

  getSubcategories: (category: string) =>
    api.get<ApiResponse<{ subcategory: string; count: number }[]>>(`/questions/subcategories/${category}`),
};

// ==================== TESTS APIs ====================
export const testsApi = {
  getTests: (params?: {
    type?: string; company?: string; difficulty?: string; page?: number; limit?: number;
  }) => api.get<PaginatedResponse<Test>>('/tests', { params }),

  getTest: (id: string) =>
    api.get<ApiResponse<Test>>(`/tests/${id}`),

  startTest: (id: string) =>
    api.post<ApiResponse<{ attemptId: string; questions: Question[]; duration: number }>>(`/tests/${id}/start`),

  submitTest: (attemptId: string, answers: Record<string, string>, timeTaken: number, tabSwitches: number) =>
    api.post<ApiResponse<TestAttempt>>(`/tests/attempts/${attemptId}/submit`, {
      answers, timeTaken, tabSwitches
    }),

  getMyAttempts: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<TestAttempt>>('/tests/attempts/my', { params }),

  getAttempt: (attemptId: string) =>
    api.get<ApiResponse<TestAttempt>>(`/tests/attempts/${attemptId}`),

  logTabSwitch: (attemptId: string) =>
    api.post(`/tests/attempts/${attemptId}/tab-switch`),
};

// ==================== CODING APIs ====================
export const codingApi = {
  getProblems: (params?: {
    difficulty?: string; category?: string; company?: string;
    status?: string; page?: number; limit?: number;
  }) => api.get<PaginatedResponse<CodingProblem>>('/coding', { params }),

  getProblem: (slug: string) =>
    api.get<ApiResponse<CodingProblem>>(`/coding/${slug}`),

  runCode: (problemId: string, code: string, language: string, customInput?: string) =>
    api.post<ApiResponse<CodeRunResult>>('/coding/run', {
      problemId, code, language, customInput
    }),

  submitCode: (problemId: string, code: string, language: string) =>
    api.post<ApiResponse<CodingSubmission>>('/coding/submit', {
      problemId, code, language
    }),

  getMySubmissions: (problemId?: string) =>
    api.get<ApiResponse<CodingSubmission[]>>('/coding/submissions/my', {
      params: { problemId }
    }),

  getSubmission: (id: string) =>
    api.get<ApiResponse<CodingSubmission>>(`/coding/submissions/${id}`),
};

// ==================== ANALYTICS APIs ====================
export const analyticsApi = {
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),

  getLeaderboard: (params?: {
    company?: string; page?: number; limit?: number;
  }) => api.get<ApiResponse<{ entries: LeaderboardEntry[]; myRank: number; myScore: number }>>('/analytics/leaderboard', { params }),

  getPlacementReadiness: () =>
    api.get<ApiResponse<{ score: number; breakdown: Record<string, number> }>>('/analytics/placement-readiness'),

  getCategoryPerformance: () =>
    api.get<ApiResponse<{ category: string; accuracy: number; questionsAttempted: number }[]>>('/analytics/category-performance'),

  getWeeklyProgress: () =>
    api.get<ApiResponse<{ date: string; score: number; testsAttempted: number }[]>>('/analytics/weekly-progress'),
};

// ==================== ADMIN APIs ====================
export const adminApi = {
  getStats: () =>
    api.get<ApiResponse<AdminStats>>('/admin/stats'),

  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params }),

  updateUserRole: (userId: string, role: string) =>
    api.put<ApiResponse<User>>(`/admin/users/${userId}/role`, { role }),

  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`),

  getQuestionsAdmin: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get<PaginatedResponse<Question>>('/admin/questions', { params }),

  createQuestion: (data: Partial<Question>) =>
    api.post<ApiResponse<Question>>('/admin/questions', data),

  updateQuestion: (id: string, data: Partial<Question>) =>
    api.put<ApiResponse<Question>>(`/admin/questions/${id}`, data),

  deleteQuestion: (id: string) =>
    api.delete(`/admin/questions/${id}`),
};

export default api;
