const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const TestAttempt = require('../models/TestAttempt');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user },
    });
  })
);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2-100 characters'),
    body('phone')
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage('Phone must be 10 digits'),
    body('college').optional().trim(),
    body('batch').optional().trim(),
    body('department').optional().trim(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const allowedFields = ['name', 'phone', 'college', 'batch', 'department'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If name is updated, refresh avatar
    if (updates.name) {
      const initials = updates.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      updates.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        initials
      )}&background=6366f1&color=fff&size=200&bold=true`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  })
);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Aggregate stats from test attempts
    const attempts = await TestAttempt.find({
      user: req.user._id,
      status: 'completed',
    });

    const totalTests = attempts.length;
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2)) : 0;

    const avgScore =
      totalTests > 0
        ? parseFloat((attempts.reduce((sum, a) => sum + a.percentage, 0) / totalTests).toFixed(2))
        : 0;

    // Category breakdown
    const categoryStats = {};
    for (const attempt of attempts) {
      const populated = await attempt.populate('test');
      const cat = populated.test?.category || 'unknown';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, correct: 0, attempts: 0 };
      }
      categoryStats[cat].total += attempt.totalQuestions;
      categoryStats[cat].correct += attempt.correctAnswers;
      categoryStats[cat].attempts += 1;
    }

    // Get rank
    const usersAbove = await User.countDocuments({
      totalScore: { $gt: user.totalScore },
      isActive: true,
    });
    const rank = usersAbove + 1;

    return res.status(200).json({
      success: true,
      message: 'Stats retrieved successfully',
      data: {
        stats: {
          testsAttempted: totalTests,
          totalScore: user.totalScore,
          accuracy,
          avgScore,
          rank,
          streakDays: user.streakDays || 0,
          totalCorrect,
          totalQuestions,
          categoryStats,
          lastActive: user.lastActive,
        },
      },
    });
  })
);

// @route   GET /api/users/history
// @desc    Get paginated test attempt history
// @access  Private
router.get(
  '/history',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const total = await TestAttempt.countDocuments(filter);

    const attempts = await TestAttempt.find(filter)
      .populate('test', 'title category company duration difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: 'History retrieved successfully',
      data: { attempts },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  })
);

module.exports = router;
