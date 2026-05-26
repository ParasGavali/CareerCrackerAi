const express = require('express');
const CodingProblem = require('../models/CodingProblem');
const CodingSubmission = require('../models/CodingSubmission');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { executeCode, runAgainstTestCases } = require('../utils/codeExecutor');

const router = express.Router();

// All coding routes require auth
router.use(protect);

// @route   GET /api/coding/problems
// @desc    List coding problems with filters
// @access  Private
router.get(
  '/problems',
  asyncHandler(async (req, res) => {
    const { difficulty, category, company, page = 1, limit = 20, search } = req.query;

    const filter = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (company) filter.companyTags = company;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const [total, problems] = await Promise.all([
      CodingProblem.countDocuments(filter),
      CodingProblem.find(filter)
        .select(
          'title slug difficulty category companyTags acceptanceRate totalSubmissions hints'
        )
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    // Get user's submission status for each problem
    const problemIds = problems.map((p) => p._id);
    const userSubmissions = await CodingSubmission.find({
      user: req.user._id,
      problem: { $in: problemIds },
      status: 'accepted',
    }).select('problem');

    const solvedSet = new Set(userSubmissions.map((s) => s.problem.toString()));

    const problemsWithStatus = problems.map((p) => ({
      ...p.toJSON(),
      status: solvedSet.has(p._id.toString()) ? 'solved' : 'unsolved',
    }));

    return res.status(200).json({
      success: true,
      message: 'Problems retrieved successfully',
      data: { problems: problemsWithStatus },
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

// @route   GET /api/coding/my-submissions
// @desc    Get current user's submission history
// @access  Private
router.get(
  '/my-submissions',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const total = await CodingSubmission.countDocuments({ user: req.user._id });

    const submissions = await CodingSubmission.find({ user: req.user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-code'); // Don't send code in list view

    return res.status(200).json({
      success: true,
      message: 'Submissions retrieved successfully',
      data: { submissions },
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

// @route   GET /api/coding/my-submissions/:problemSlug
// @desc    Get user's submissions for a specific problem
// @access  Private
router.get(
  '/my-submissions/:problemSlug',
  asyncHandler(async (req, res) => {
    const problem = await CodingProblem.findOne({
      slug: req.params.problemSlug,
      isActive: true,
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const submissions = await CodingSubmission.find({
      user: req.user._id,
      problem: problem._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      message: 'Submissions retrieved successfully',
      data: { submissions },
    });
  })
);

// @route   GET /api/coding/problems/:slug
// @desc    Get single coding problem detail
// @access  Private
router.get(
  '/problems/:slug',
  asyncHandler(async (req, res) => {
    const problem = await CodingProblem.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Filter visible test cases (non-hidden only)
    const problemData = problem.toJSON();
    problemData.testCases = problemData.testCases.filter((tc) => !tc.isHidden);

    // Check if user has solved this problem
    const acceptedSubmission = await CodingSubmission.findOne({
      user: req.user._id,
      problem: problem._id,
      status: 'accepted',
    });

    return res.status(200).json({
      success: true,
      message: 'Problem retrieved successfully',
      data: {
        problem: problemData,
        isSolved: !!acceptedSubmission,
      },
    });
  })
);

// @route   POST /api/coding/run
// @desc    Run code without test cases (custom input)
// @access  Private
router.post(
  '/run',
  asyncHandler(async (req, res) => {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required',
      });
    }

    const validLanguages = ['javascript', 'python', 'c', 'cpp', 'java'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Supported: ${validLanguages.join(', ')}`,
      });
    }

    const result = await executeCode(code, language, input);

    return res.status(200).json({
      success: true,
      message: 'Code executed',
      data: {
        output: result.output,
        error: result.error || null,
        executionTime: result.executionTime,
        status: result.status,
      },
    });
  })
);

// @route   POST /api/coding/submit
// @desc    Submit code against all test cases
// @access  Private
router.post(
  '/submit',
  asyncHandler(async (req, res) => {
    const { code, language, problemSlug } = req.body;

    if (!code || !language || !problemSlug) {
      return res.status(400).json({
        success: false,
        message: 'Code, language, and problemSlug are required',
      });
    }

    const validLanguages = ['javascript', 'python', 'c', 'cpp', 'java'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Supported: ${validLanguages.join(', ')}`,
      });
    }

    const problem = await CodingProblem.findOne({ slug: problemSlug, isActive: true });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Run against all test cases
    const executionResult = await runAgainstTestCases(code, language, problem.testCases);

    // Map status
    const statusMap = {
      accepted: 'accepted',
      'wrong-answer': 'wrong-answer',
      'time-limit-exceeded': 'time-limit-exceeded',
      'compilation-error': 'compilation-error',
      'runtime-error': 'runtime-error',
    };
    const submissionStatus = statusMap[executionResult.status] || 'wrong-answer';

    // Save submission to DB
    const submission = await CodingSubmission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      status: submissionStatus,
      output: executionResult.results[0]?.actualOutput || '',
      expectedOutput: executionResult.results[0]?.expectedOutput || '',
      executionTime: executionResult.results.reduce((sum, r) => sum + (r.executionTime || 0), 0),
      testCasesPassed: executionResult.passed,
      totalTestCases: executionResult.total,
      errorMessage: executionResult.results.find((r) => r.error)?.error || null,
    });

    // Update problem stats
    await CodingProblem.findByIdAndUpdate(problem._id, {
      $inc: {
        totalSubmissions: 1,
        successfulSubmissions: submissionStatus === 'accepted' ? 1 : 0,
      },
    });

    // Recalculate acceptance rate
    const updatedProblem = await CodingProblem.findById(problem._id);
    if (updatedProblem.totalSubmissions > 0) {
      const acceptanceRate = parseFloat(
        ((updatedProblem.successfulSubmissions / updatedProblem.totalSubmissions) * 100).toFixed(2)
      );
      await CodingProblem.findByIdAndUpdate(problem._id, { acceptanceRate });
    }

    return res.status(200).json({
      success: true,
      message: submissionStatus === 'accepted' ? 'All test cases passed! ✅' : 'Some test cases failed',
      data: {
        submission: {
          _id: submission._id,
          status: submissionStatus,
          testCasesPassed: executionResult.passed,
          totalTestCases: executionResult.total,
          results: executionResult.results,
          language,
        },
      },
    });
  })
);

module.exports = router;
