const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['quantitative', 'logical', 'verbal', 'mixed', 'company-specific', 'coding'],
      default: 'mixed',
    },
    company: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 1,
    },
    totalMarks: {
      type: Number,
      default: function () {
        return this.questions ? this.questions.length : 0;
      },
    },
    passingMarks: {
      type: Number,
      default: function () {
        return Math.ceil((this.totalMarks || 0) * 0.4);
      },
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

testSchema.index({ category: 1 });
testSchema.index({ company: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ isActive: 1 });

testSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
