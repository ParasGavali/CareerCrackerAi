const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: [true, 'Problem is required'],
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
    },
    language: {
      type: String,
      enum: ['c', 'cpp', 'java', 'python', 'javascript'],
      required: [true, 'Language is required'],
    },
    status: {
      type: String,
      enum: [
        'accepted',
        'wrong-answer',
        'time-limit-exceeded',
        'compilation-error',
        'runtime-error',
        'pending',
      ],
      default: 'pending',
    },
    output: {
      type: String,
    },
    expectedOutput: {
      type: String,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

codingSubmissionSchema.index({ user: 1, problem: 1, createdAt: -1 });
codingSubmissionSchema.index({ user: 1, status: 1 });
codingSubmissionSchema.index({ problem: 1 });

codingSubmissionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const CodingSubmission = mongoose.model('CodingSubmission', codingSubmissionSchema);

module.exports = CodingSubmission;
