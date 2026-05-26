const TestAttempt = require('../models/TestAttempt');
const User = require('../models/User');
const Question = require('../models/Question');

/**
 * Calculate placement readiness score (0-100) and breakdown
 */
const calculatePlacementReadiness = async (userId, attempts) => {
  if (!attempts || attempts.length === 0) {
    return {
      score: 0,
      breakdown: {
        quantitative: 0,
        logical: 0,
        verbal: 0,
        consistency: 0,
        testVolume: 0,
      },
      level: 'Beginner',
      recommendation: 'Start practicing aptitude tests to improve your readiness score.',
    };
  }

  const completedAttempts = attempts.filter((a) => a.status === 'completed');

  if (completedAttempts.length === 0) {
    return {
      score: 0,
      breakdown: { quantitative: 0, logical: 0, verbal: 0, consistency: 0, testVolume: 0 },
      level: 'Beginner',
      recommendation: 'Complete some tests to get your placement readiness score.',
    };
  }

  // Populate test data
  const populatedAttempts = await TestAttempt.find({
    _id: { $in: completedAttempts.map((a) => a._id) },
  }).populate('test', 'category');

  // Category scores
  const categoryScores = { quantitative: [], logical: [], verbal: [] };

  for (const attempt of populatedAttempts) {
    const cat = attempt.test?.category;
    if (cat && categoryScores[cat] !== undefined) {
      categoryScores[cat].push(attempt.percentage);
    } else if (cat === 'mixed' || cat === 'company-specific') {
      // Mixed tests contribute to all categories evenly
      for (const key of Object.keys(categoryScores)) {
        categoryScores[key].push(attempt.percentage * 0.7); // weighted less
      }
    }
  }

  const avg = (arr) => (arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);

  const quantScore = Math.min(100, avg(categoryScores.quantitative));
  const logicScore = Math.min(100, avg(categoryScores.logical));
  const verbalScore = Math.min(100, avg(categoryScores.verbal));

  // Consistency score - based on variance in scores
  const allScores = completedAttempts.map((a) => a.percentage);
  const mean = avg(allScores);
  const variance =
    allScores.length > 1
      ? allScores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / allScores.length
      : 0;
  const stdDev = Math.sqrt(variance);
  const consistencyScore = Math.max(0, 100 - stdDev * 2);

  // Test volume score - more tests = higher readiness (max 100 at 30+ tests)
  const testVolumeScore = Math.min(100, (completedAttempts.length / 30) * 100);

  // Weighted composite
  const totalScore = parseFloat(
    (
      quantScore * 0.3 +
      logicScore * 0.25 +
      verbalScore * 0.2 +
      consistencyScore * 0.15 +
      testVolumeScore * 0.1
    ).toFixed(2)
  );

  let level = 'Beginner';
  let recommendation = '';

  if (totalScore >= 80) {
    level = 'Placement Ready';
    recommendation = 'Excellent! You are well-prepared for campus placements. Focus on company-specific tests.';
  } else if (totalScore >= 60) {
    level = 'Intermediate';
    recommendation = 'Good progress! Strengthen your weak areas and attempt more company mock tests.';
  } else if (totalScore >= 40) {
    level = 'Developing';
    recommendation = 'Keep practicing! Focus on improving your lowest scoring category.';
  } else {
    level = 'Beginner';
    recommendation = 'Start with easy questions and build your foundation step by step.';
  }

  return {
    score: totalScore,
    breakdown: {
      quantitative: parseFloat(quantScore.toFixed(2)),
      logical: parseFloat(logicScore.toFixed(2)),
      verbal: parseFloat(verbalScore.toFixed(2)),
      consistency: parseFloat(consistencyScore.toFixed(2)),
      testVolume: parseFloat(testVolumeScore.toFixed(2)),
    },
    level,
    recommendation,
  };
};

/**
 * Get weak topics based on attempt performance
 */
const getWeakTopics = async (attempts) => {
  if (!attempts || attempts.length === 0) return [];

  // Get all completed attempts and their answer breakdowns
  const completedAttemptIds = attempts
    .filter((a) => a.status === 'completed')
    .map((a) => a._id);

  if (completedAttemptIds.length === 0) return [];

  const detailedAttempts = await TestAttempt.find({
    _id: { $in: completedAttemptIds },
    'answers.0': { $exists: true },
  });

  const subcategoryStats = {};

  for (const attempt of detailedAttempts) {
    for (const answer of attempt.answers) {
      if (!answer.questionId) continue;

      // Populate question
      const question = await Question.findById(answer.questionId).select('subcategory category');
      if (!question) continue;

      const key = question.subcategory || question.category;
      if (!subcategoryStats[key]) {
        subcategoryStats[key] = { correct: 0, total: 0, category: question.category };
      }
      subcategoryStats[key].total++;
      if (answer.isCorrect) subcategoryStats[key].correct++;
    }
  }

  // Find topics with accuracy below 50%
  const weakTopics = Object.entries(subcategoryStats)
    .filter(([, stats]) => stats.total >= 3) // at least 3 attempts
    .map(([topic, stats]) => ({
      topic,
      category: stats.category,
      accuracy: parseFloat(((stats.correct / stats.total) * 100).toFixed(2)),
      totalAttempts: stats.total,
    }))
    .filter((t) => t.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return weakTopics;
};

/**
 * Get strong topics based on attempt performance
 */
const getStrongTopics = async (attempts) => {
  if (!attempts || attempts.length === 0) return [];

  const completedAttemptIds = attempts
    .filter((a) => a.status === 'completed')
    .map((a) => a._id);

  if (completedAttemptIds.length === 0) return [];

  const detailedAttempts = await TestAttempt.find({
    _id: { $in: completedAttemptIds },
    'answers.0': { $exists: true },
  });

  const subcategoryStats = {};

  for (const attempt of detailedAttempts) {
    for (const answer of attempt.answers) {
      if (!answer.questionId) continue;

      const question = await Question.findById(answer.questionId).select('subcategory category');
      if (!question) continue;

      const key = question.subcategory || question.category;
      if (!subcategoryStats[key]) {
        subcategoryStats[key] = { correct: 0, total: 0, category: question.category };
      }
      subcategoryStats[key].total++;
      if (answer.isCorrect) subcategoryStats[key].correct++;
    }
  }

  const strongTopics = Object.entries(subcategoryStats)
    .filter(([, stats]) => stats.total >= 3)
    .map(([topic, stats]) => ({
      topic,
      category: stats.category,
      accuracy: parseFloat(((stats.correct / stats.total) * 100).toFixed(2)),
      totalAttempts: stats.total,
    }))
    .filter((t) => t.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  return strongTopics;
};

/**
 * Calculate overall accuracy from attempts
 */
const calculateAccuracy = (attempts) => {
  if (!attempts || attempts.length === 0) return 0;

  const completed = attempts.filter((a) => a.status === 'completed');
  if (completed.length === 0) return 0;

  const totalCorrect = completed.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
  const totalQuestions = completed.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);

  if (totalQuestions === 0) return 0;

  return parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2));
};

/**
 * Get user rank in leaderboard
 */
const getRankInLeaderboard = async (userId) => {
  const user = await User.findById(userId).select('totalScore');
  if (!user) return null;

  const usersAbove = await User.countDocuments({
    totalScore: { $gt: user.totalScore },
    isActive: true,
  });

  return usersAbove + 1;
};

/**
 * Calculate weekly progress (last 7 days)
 */
const calculateWeeklyProgress = async (userId) => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const attempts = await TestAttempt.find({
    user: userId,
    status: 'completed',
    submittedAt: { $gte: sevenDaysAgo },
  }).select('score percentage correctAnswers submittedAt');

  const progress = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);

    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayAttempts = attempts.filter((a) => {
      const submitted = new Date(a.submittedAt);
      return submitted >= day && submitted < nextDay;
    });

    const dayScore =
      dayAttempts.length > 0
        ? parseFloat(
            (dayAttempts.reduce((s, a) => s + a.percentage, 0) / dayAttempts.length).toFixed(2)
          )
        : 0;

    progress.push({
      date: day.toISOString().split('T')[0],
      day: dayNames[day.getDay()],
      score: dayScore,
      testsAttempted: dayAttempts.length,
    });
  }

  return progress;
};

module.exports = {
  calculatePlacementReadiness,
  getWeakTopics,
  getStrongTopics,
  calculateAccuracy,
  getRankInLeaderboard,
  calculateWeeklyProgress,
};
