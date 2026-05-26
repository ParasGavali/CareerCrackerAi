const express = require('express');
const { body, validationResult } = require('express-validator');
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/tests
// @desc    List all tests with optional filters
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { category, company, difficulty, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit) || 20, 50);
    const skip = (pageNum - 1) * limitNum;

    const [total, tests] = await Promise.all([
      Test.countDocuments(filter),
      Test.find(filter)
        .select('-questions') // Don't send question list in list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    // Augment with user's attempt info
    const testsWithAttempts = await Promise.all(
      tests.map(async (test) => {
        const attempt = await TestAttempt.findOne({
          user: req.user._id,
          test: test._id,
          status: 'completed',
        })
          .sort({ createdAt: -1 })
          .select('score percentage createdAt');

        return {
          ...test.toJSON(),
          userAttempt: attempt || null,
          questionCount: 0, // populated separately
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Tests retrieved successfully',
      data: { tests: testsWithAttempts },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  })
);

// @route   GET /api/tests/attempts/my
// @desc    Get current user's all attempts
// @access  Private
router.get(
  '/attempts/my',
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const total = await TestAttempt.countDocuments({ user: req.user._id });

    const attempts = await TestAttempt.find({ user: req.user._id })
      .populate('test', 'title category company duration difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-answers'); // Don't send all answers in list

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

// @route   GET /api/tests/attempts/:attemptId
// @desc    Get single attempt result with answer breakdown
// @access  Private
router.get(
  '/attempts/:attemptId',
  protect,
  asyncHandler(async (req, res) => {
    const attempt = await TestAttempt.findById(req.params.attemptId)
      .populate('test', 'title category company duration difficulty totalMarks passingMarks')
      .populate({
        path: 'answers.questionId',
        model: 'Question',
        select: 'questionText options correctAnswer explanation category subcategory difficulty',
      });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Ensure the attempt belongs to the current user
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({
      success: true,
      message: 'Attempt retrieved successfully',
      data: { attempt },
    });
  })
);

// @route   GET /api/tests/:id
// @desc    Get single test with questions
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const test = await Test.findById(req.params.id).populate({
      path: 'questions',
      match: { isActive: true },
      select: 'questionText options category subcategory difficulty timeLimit companyTags',
      // correctAnswer hidden by default
    });

    if (!test || !test.isActive) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Check if user has a completed attempt - if yes, reveal answers
    const completedAttempt = await TestAttempt.findOne({
      user: req.user._id,
      test: test._id,
      status: 'completed',
    });

    let questions = test.questions.map((q) => q.toJSON());

    // Only reveal answers after completion or for admin/faculty
    if (completedAttempt || ['admin', 'faculty'].includes(req.user.role)) {
      const fullQuestions = await Question.find({
        _id: { $in: test.questions.map((q) => q._id) },
        isActive: true,
      });
      questions = fullQuestions.map((q) => q.toJSON());
    }

    return res.status(200).json({
      success: true,
      message: 'Test retrieved successfully',
      data: {
        test: {
          ...test.toJSON(),
          questions,
        },
        hasAttempted: !!completedAttempt,
        lastAttempt: completedAttempt
          ? {
              score: completedAttempt.score,
              percentage: completedAttempt.percentage,
              correctAnswers: completedAttempt.correctAnswers,
            }
          : null,
      },
    });
  })
);

// @route   POST /api/tests/create
// @desc    Create a new test
// @access  Admin
router.post(
  '/create',
  protect,
  authorize('admin', 'faculty'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
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

    const { title, description, category, company, duration, questions, difficulty, tags } = req.body;

    const test = await Test.create({
      title,
      description,
      category,
      company,
      duration,
      questions,
      totalMarks: questions.length,
      passingMarks: Math.ceil(questions.length * 0.4),
      difficulty,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: { test },
    });
  })
);

// @route   POST /api/tests/:id/start
// @desc    Start a new test attempt
// @access  Private
router.post(
  '/:id/start',
  protect,
  asyncHandler(async (req, res) => {
    const test = await Test.findById(req.params.id).populate({
      path: 'questions',
      match: { isActive: true },
      select: 'questionText options category subcategory difficulty timeLimit',
    });

    if (!test || !test.isActive) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Check for existing in-progress attempt
    const existingAttempt = await TestAttempt.findOne({
      user: req.user._id,
      test: test._id,
      status: 'in-progress',
    });

    if (existingAttempt) {
      return res.status(200).json({
        success: true,
        message: 'Resuming existing attempt',
        data: {
          attemptId: existingAttempt._id,
          test: {
            ...test.toJSON(),
            questions: test.questions,
          },
          startedAt: existingAttempt.startedAt,
          timeElapsed: Math.floor((Date.now() - existingAttempt.startedAt.getTime()) / 1000),
        },
      });
    }

    // Create new attempt
    const attempt = await TestAttempt.create({
      user: req.user._id,
      test: test._id,
      totalQuestions: test.questions.length,
      startedAt: new Date(),
    });

    // Increment attempt count
    await Test.findByIdAndUpdate(test._id, { $inc: { attemptCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Test started successfully',
      data: {
        attemptId: attempt._id,
        test: {
          _id: test._id,
          title: test.title,
          duration: test.duration,
          totalMarks: test.totalMarks,
          passingMarks: test.passingMarks,
          questions: test.questions, // No correct answers
        },
        startedAt: attempt.startedAt,
      },
    });
  })
);

// @route   POST /api/tests/:id/submit
// @desc    Submit test attempt and calculate score
// @access  Private
router.post(
  '/:id/submit',
  protect,
  asyncHandler(async (req, res) => {
    const { attemptId, answers, timeTaken } = req.body;

    if (!attemptId) {
      return res.status(400).json({ success: false, message: 'Attempt ID is required' });
    }

    // Find the attempt
    const attempt = await TestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Attempt already submitted' });
    }

    // Get the test with questions and correct answers
    const test = await Test.findById(req.params.id).populate({
      path: 'questions',
      select: 'correctAnswer category subcategory',
    });

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Calculate scores
    const correctAnswerMap = {};
    test.questions.forEach((q) => {
      correctAnswerMap[q._id.toString()] = q.correctAnswer;
    });

    let correctCount = 0;
    let wrongCount = 0;

    const processedAnswers = test.questions.map((question) => {
      const qId = question._id.toString();
      const userAnswer = answers ? answers.find((a) => a.questionId === qId) : null;
      const selectedOption = userAnswer ? userAnswer.selectedOption : null;
      const isCorrect = selectedOption === correctAnswerMap[qId];

      if (selectedOption) {
        if (isCorrect) correctCount++;
        else wrongCount++;
      }

      return {
        questionId: question._id,
        selectedOption: selectedOption || null,
        isCorrect,
        timeTaken: userAnswer ? userAnswer.timeTaken || 0 : 0,
      };
    });

    const totalQuestions = test.questions.length;
    const unanswered = totalQuestions - correctCount - wrongCount;
    const score = correctCount; // 1 mark per correct
    const percentage = parseFloat(((correctCount / totalQuestions) * 100).toFixed(2));
    const totalTimeTaken = timeTaken || Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.totalQuestions = totalQuestions;
    attempt.correctAnswers = correctCount;
    attempt.wrongAnswers = wrongCount;
    attempt.unanswered = unanswered;
    attempt.percentage = percentage;
    attempt.timeTaken = totalTimeTaken;
    attempt.status = 'completed';
    attempt.submittedAt = new Date();

    await attempt.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        testsAttempted: 1,
        totalScore: score,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        attempt: {
          _id: attempt._id,
          score,
          totalQuestions,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          unanswered,
          percentage,
          timeTaken: totalTimeTaken,
          status: 'completed',
          passed: score >= test.passingMarks,
          passingMarks: test.passingMarks,
        },
      },
    });
  })
);

// @route   POST /api/tests/:id/tab-switch
// @desc    Log a tab switch event for a test
// @access  Private
router.post(
  '/:id/tab-switch',
  protect,
  asyncHandler(async (req, res) => {
    const { attemptId } = req.body;

    if (!attemptId) {
      return res.status(400).json({ success: false, message: 'Attempt ID is required' });
    }

    const attempt = await TestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Attempt is not in progress' });
    }

    attempt.tabSwitches = (attempt.tabSwitches || 0) + 1;
    await attempt.save();

    return res.status(200).json({
      success: true,
      message: 'Tab switch logged',
      data: { tabSwitches: attempt.tabSwitches },
    });
  })
);

module.exports = router;
