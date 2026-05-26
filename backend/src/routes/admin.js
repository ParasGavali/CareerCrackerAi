const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Question = require('../models/Question');
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get platform-wide stats
// @access  Admin
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalStudents,
      totalQuestions,
      totalTests,
      totalAttempts,
      attemptsToday,
      newUsersToday,
      activeUsers,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true, role: 'student' }),
      Question.countDocuments({ isActive: true }),
      Test.countDocuments({ isActive: true }),
      TestAttempt.countDocuments(),
      TestAttempt.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, isActive: true }),
    ]);

    // Average score across all completed attempts
    const scoreAgg = await TestAttempt.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$percentage' },
          avgCorrect: { $avg: '$correctAnswers' },
        },
      },
    ]);

    const avgScore = scoreAgg[0] ? parseFloat(scoreAgg[0].avgScore.toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      message: 'Platform stats retrieved',
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalQuestions,
          totalTests,
          totalAttempts,
          attemptsToday,
          newUsersToday,
          activeUsersThisWeek: activeUsers,
          avgPlatformScore: avgScore,
        },
      },
    });
  })
);

// @route   GET /api/admin/users
// @desc    Get paginated user list
// @access  Admin
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const role = req.query.role;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password -refreshToken'),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: { users },
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

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role
// @access  Admin
router.put(
  '/users/:id/role',
  [body('role').isIn(['student', 'admin', 'faculty', 'placement_officer']).withMessage('Invalid role')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { role } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  })
);

// @route   DELETE /api/admin/users/:id
// @desc    Deactivate a user
// @access  Admin
router.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: { user },
    });
  })
);

// @route   POST /api/admin/questions/bulk
// @desc    Bulk create questions
// @access  Admin
router.post(
  '/questions/bulk',
  asyncHandler(async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required',
      });
    }

    if (questions.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bulk create more than 500 questions at once',
      });
    }

    // Add createdBy to each question
    const questionsToInsert = questions.map((q) => ({
      ...q,
      createdBy: req.user._id,
    }));

    const result = await Question.insertMany(questionsToInsert, { ordered: false });

    return res.status(201).json({
      success: true,
      message: `${result.length} questions created successfully`,
      data: {
        created: result.length,
        total: questions.length,
      },
    });
  })
);

// @route   GET /api/admin/attempts
// @desc    Get all test attempts across platform (paginated)
// @access  Admin
router.get(
  '/attempts',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status) filter.status = status;

    const [total, attempts] = await Promise.all([
      TestAttempt.countDocuments(filter),
      TestAttempt.find(filter)
        .populate('user', 'name email college')
        .populate('test', 'title category company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-answers'),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Attempts retrieved successfully',
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
