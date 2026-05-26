const express = require('express');
const TestAttempt = require('../models/TestAttempt');
const User = require('../models/User');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  calculatePlacementReadiness,
  getWeakTopics,
  getStrongTopics,
  calculateAccuracy,
  getRankInLeaderboard,
  calculateWeeklyProgress,
} = require('../utils/analytics');

const router = express.Router();

// All analytics routes require auth
router.use(protect);

// @route   GET /api/analytics/dashboard
// @desc    Full analytics dashboard for current user
// @access  Private
router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const attempts = await TestAttempt.find({ user: userId }).populate('test', 'category company');

    const completedAttempts = attempts.filter((a) => a.status === 'completed');

    const [
      placementReadiness,
      weakTopics,
      strongTopics,
      weeklyProgress,
      rank,
    ] = await Promise.all([
      calculatePlacementReadiness(userId, attempts),
      getWeakTopics(attempts),
      getStrongTopics(attempts),
      calculateWeeklyProgress(userId),
      getRankInLeaderboard(userId),
    ]);

    const accuracy = calculateAccuracy(completedAttempts);

    // Progress by category
    const categoryMap = {};
    for (const attempt of completedAttempts) {
      const cat = attempt.test?.category || 'unknown';
      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          category: cat,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          correctAnswers: 0,
        };
      }
      categoryMap[cat].attempts++;
      categoryMap[cat].totalScore += attempt.percentage;
      categoryMap[cat].totalQuestions += attempt.totalQuestions;
      categoryMap[cat].correctAnswers += attempt.correctAnswers;
    }

    const progressByCategory = Object.values(categoryMap).map((c) => ({
      category: c.category,
      attempts: c.attempts,
      avgScore: parseFloat((c.totalScore / c.attempts).toFixed(2)),
      accuracy: parseFloat(((c.correctAnswers / c.totalQuestions) * 100).toFixed(2)),
    }));

    // Recent attempts (last 5)
    const recentAttempts = await TestAttempt.find({ user: userId, status: 'completed' })
      .populate('test', 'title category company')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('score percentage correctAnswers totalQuestions timeTaken submittedAt test');

    const user = await User.findById(userId);

    return res.status(200).json({
      success: true,
      message: 'Dashboard analytics retrieved',
      data: {
        summary: {
          totalTests: completedAttempts.length,
          accuracy,
          rank,
          totalScore: user.totalScore,
          streakDays: user.streakDays || 0,
        },
        placementReadinessScore: placementReadiness.score,
        placementReadiness,
        weakTopics,
        strongTopics,
        progressByCategory,
        recentAttempts,
        weeklyProgress,
      },
    });
  })
);

// @route   GET /api/analytics/leaderboard
// @desc    Top 50 students by totalScore
// @access  Private
router.get(
  '/leaderboard',
  asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const userCollege = req.query.college;

    const filter = { isActive: true, role: 'student' };
    if (userCollege) filter.college = { $regex: userCollege, $options: 'i' };

    const leaders = await User.find(filter)
      .sort({ totalScore: -1, testsAttempted: -1 })
      .limit(limit)
      .select('name totalScore testsAttempted college streakDays avatar');

    // Build leaderboard with rank and accuracy
    const leaderboard = await Promise.all(
      leaders.map(async (user, idx) => {
        const attempts = await TestAttempt.find({
          user: user._id,
          status: 'completed',
        }).select('correctAnswers totalQuestions');

        const totalCorrect = attempts.reduce((s, a) => s + a.correctAnswers, 0);
        const totalQuestions = attempts.reduce((s, a) => s + a.totalQuestions, 0);
        const accuracy =
          totalQuestions > 0
            ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2))
            : 0;

        return {
          rank: idx + 1,
          user: {
            id: user._id,
            name: user.name,
            avatar: user.avatar,
            college: user.college || 'N/A',
            streakDays: user.streakDays || 0,
          },
          score: user.totalScore,
          testsAttempted: user.testsAttempted,
          accuracy,
          isCurrentUser: user._id.toString() === req.user._id.toString(),
        };
      })
    );

    // Find current user's rank
    const currentUserRank = await getRankInLeaderboard(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: {
        leaderboard,
        currentUserRank,
      },
    });
  })
);

// @route   GET /api/analytics/placement-readiness
// @desc    Detailed readiness breakdown by company
// @access  Private
router.get(
  '/placement-readiness',
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const attempts = await TestAttempt.find({ user: userId }).populate('test', 'category company');

    const readiness = await calculatePlacementReadiness(userId, attempts);

    // Company-specific readiness
    const companies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'HCL'];

    const companyReadiness = await Promise.all(
      companies.map(async (company) => {
        const companyAttempts = attempts.filter(
          (a) => a.test?.company?.toLowerCase() === company.toLowerCase()
        );

        const scores = companyAttempts
          .filter((a) => a.status === 'completed')
          .map((a) => a.percentage);

        const avgScore =
          scores.length > 0
            ? parseFloat((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2))
            : 0;

        return {
          company,
          attemptsCount: companyAttempts.length,
          avgScore,
          readinessScore: Math.min(100, avgScore * 1.2), // slight boost
          isReady: avgScore >= 60,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Placement readiness retrieved',
      data: {
        overall: readiness,
        byCompany: companyReadiness,
      },
    });
  })
);

// @route   GET /api/analytics/category-performance
// @desc    Performance breakdown per category and subcategory
// @access  Private
router.get(
  '/category-performance',
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const attempts = await TestAttempt.find({
      user: userId,
      status: 'completed',
      'answers.0': { $exists: true },
    }).select('answers');

    const categoryStats = {};
    const subcategoryStats = {};

    for (const attempt of attempts) {
      for (const answer of attempt.answers) {
        if (!answer.questionId) continue;

        const question = await Question.findById(answer.questionId).select('category subcategory');
        if (!question) continue;

        const cat = question.category;
        const subcat = question.subcategory || 'General';

        // Category stats
        if (!categoryStats[cat]) {
          categoryStats[cat] = { correct: 0, total: 0 };
        }
        categoryStats[cat].total++;
        if (answer.isCorrect) categoryStats[cat].correct++;

        // Subcategory stats
        const subKey = `${cat}::${subcat}`;
        if (!subcategoryStats[subKey]) {
          subcategoryStats[subKey] = { category: cat, subcategory: subcat, correct: 0, total: 0 };
        }
        subcategoryStats[subKey].total++;
        if (answer.isCorrect) subcategoryStats[subKey].correct++;
      }
    }

    const categoryPerformance = Object.entries(categoryStats).map(([cat, stats]) => ({
      category: cat,
      accuracy: stats.total > 0 ? parseFloat(((stats.correct / stats.total) * 100).toFixed(2)) : 0,
      totalAttempted: stats.total,
      totalCorrect: stats.correct,
    }));

    const subcategoryPerformance = Object.values(subcategoryStats)
      .map((s) => ({
        category: s.category,
        subcategory: s.subcategory,
        accuracy: s.total > 0 ? parseFloat(((s.correct / s.total) * 100).toFixed(2)) : 0,
        totalAttempted: s.total,
        totalCorrect: s.correct,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return res.status(200).json({
      success: true,
      message: 'Category performance retrieved',
      data: {
        categoryPerformance,
        subcategoryPerformance,
      },
    });
  })
);

module.exports = router;
