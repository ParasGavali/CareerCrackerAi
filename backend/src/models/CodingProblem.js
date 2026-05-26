const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const solutionTemplateSchema = new mongoose.Schema(
  {
    c: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
  },
  { _id: false }
);

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Difficulty is required'],
    },
    category: {
      type: String,
      enum: ['arrays', 'strings', 'dp', 'math', 'sorting', 'graphs', 'trees', 'greedy'],
      required: [true, 'Category is required'],
    },
    companyTags: {
      type: [String],
      default: [],
    },
    constraints: {
      type: String,
    },
    inputFormat: {
      type: String,
    },
    outputFormat: {
      type: String,
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    testCases: {
      type: [testCaseSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v && v.length >= 1;
        },
        message: 'At least 1 test case is required',
      },
    },
    solutionTemplates: {
      type: solutionTemplateSchema,
      default: () => ({}),
    },
    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    successfulSubmissions: {
      type: Number,
      default: 0,
    },
    hints: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
codingProblemSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

codingProblemSchema.index({ category: 1 });
codingProblemSchema.index({ difficulty: 1 });
codingProblemSchema.index({ companyTags: 1 });
codingProblemSchema.index({ isActive: 1 });

codingProblemSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);

module.exports = CodingProblem;
