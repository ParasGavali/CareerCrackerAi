const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/questions/categories
// @desc    Get all categories and their subcategories
// @access  Public
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { category: '$category', subcategory: '$subcategory' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          subcategories: {
            $push: { name: '$_id.subcategory', count: '$count' },
          },
          totalCount: { $sum: '$count' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: { categories },
    });
  })
);

// @route   GET /api/questions/random
// @desc    Get N random questions by filters
// @access  Private
router.get(
  '/random',
  protect,
  asyncHandler(async (req, res) => {
    const { category, difficulty, count = 10, subcategory, company } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (subcategory) filter.subcategory = subcategory;
    if (company) filter.companyTags = company;

    const numCount = Math.min(parseInt(count) || 10, 100);

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: numCount } },
      {
        $project: {
          correctAnswer: 0, // hide answer for practice
          explanation: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Random questions retrieved',
      data: { questions, count: questions.length },
    });
  })
);

// @route   GET /api/questions
// @desc    List questions with filters
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {
      category,
      difficulty,
      company,
      subcategory,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (subcategory) filter.subcategory = subcategory;
    if (company) filter.companyTags = company;
    if (search) {
      filter.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const [total, questions] = await Promise.all([
      Question.countDocuments(filter),
      Question.find(filter)
        .select('-correctAnswer -explanation') // Hide answers from list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: { questions },
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

// @route   GET /api/questions/:id
// @desc    Get single question (with answer if admin)
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question || !question.isActive) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Only admins get the correct answer directly
    const data = question.toJSON();
    if (!['admin', 'faculty'].includes(req.user.role)) {
      delete data.correctAnswer;
      delete data.explanation;
    }

    return res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: { question: data },
    });
  })
);

// @route   POST /api/questions
// @desc    Create a new question
// @access  Admin
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('questionText').trim().notEmpty().withMessage('Question text is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options required'),
    body('correctAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('Correct answer must be A, B, C, or D'),
    body('explanation').trim().notEmpty().withMessage('Explanation is required'),
    body('category').isIn(['quantitative', 'logical', 'verbal']).withMessage('Invalid category'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
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

    const question = await Question.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question },
    });
  })
);

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Admin
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: { question },
    });
  })
);

// @route   DELETE /api/questions/:id
// @desc    Soft delete a question
// @access  Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  })
);

module.exports = router;
