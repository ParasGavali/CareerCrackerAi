// Main Seeder for CareerCracker AI
// Seeds Users, Questions, Coding Problems, and links Questions to Predefined Mock Tests

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database connection
const { connect } = require('../config/database');

// Models
const User = require('../models/User');
const Question = require('../models/Question');
const CodingProblem = require('../models/CodingProblem');
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const CodingSubmission = require('../models/CodingSubmission');

// Seed Data
const questionsData = require('./questions');
const codingProblemsData = require('./codingProblems');
const mockTestsData = require('./tests');

const seedAll = async () => {
  try {
    console.log('🔄 Connecting to database for seeding...');
    await connect();
    console.log('✅ Connected to MongoDB.');

    // ─── CLEAR EXISTING DATA ─────────────────────────────────────────────────
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await CodingProblem.deleteMany({});
    await Test.deleteMany({});
    await TestAttempt.deleteMany({});
    await CodingSubmission.deleteMany({});
    console.log('✅ Collections cleared.');

    // ─── SEED USERS ──────────────────────────────────────────────────────────
    console.log('👤 Seeding default users...');
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 12);
    const hashedStudentPassword = await bcrypt.hash('Student@123', 12);

    const adminUser = await User.create({
      name: 'CareerCracker Admin',
      email: 'admin@careercracker.ai',
      password: hashedAdminPassword,
      role: 'admin',
      college: 'Global Engineering College',
      department: 'Computer Engineering',
      batch: '2026',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CCA'
    });

    const studentUser = await User.create({
      name: 'Rohan Sharma',
      email: 'student@careercracker.ai',
      password: hashedStudentPassword,
      role: 'student',
      college: 'Global Engineering College',
      department: 'Computer Engineering',
      batch: '2026',
      totalScore: 0,
      testsAttempted: 0,
      rank: 1,
      streakDays: 3,
      lastActive: new Date(),
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RS'
    });

    console.log('✅ Default users seeded:');
    console.log('   Admin:   admin@careercracker.ai / Admin@123');
    console.log('   Student: student@careercracker.ai / Student@123');

    // ─── SEED QUESTIONS ──────────────────────────────────────────────────────
    console.log(`📝 Seeding ${questionsData.length} Aptitude Questions...`);
    const insertedQuestions = await Question.insertMany(
      questionsData.map(q => ({
        ...q,
        createdBy: adminUser._id
      }))
    );
    console.log('✅ Aptitude questions seeded successfully.');

    // ─── SEED CODING PROBLEMS ────────────────────────────────────────────────
    console.log(`💻 Seeding ${codingProblemsData.length} Coding Problems...`);
    const insertedCodingProblems = await CodingProblem.insertMany(codingProblemsData);
    console.log('✅ Coding problems seeded successfully.');

    // ─── SEED TESTS (BLUEPRINTS LINKED TO QUESTIONS) ──────────────────────────
    console.log('🏆 Seeding Mock Tests from blueprints...');

    // Group inserted questions by category for dynamic blueprint allocation
    const quantQuestions = insertedQuestions.filter(q => q.category === 'quantitative');
    const logicalQuestions = insertedQuestions.filter(q => q.category === 'logical');
    const verbalQuestions = insertedQuestions.filter(q => q.category === 'verbal');

    console.log(`   Available Questions: Quant (${quantQuestions.length}), Logical (${logicalQuestions.length}), Verbal (${verbalQuestions.length})`);

    const testsToCreate = [];

    for (const blueprint of mockTestsData) {
      const { blueprint: qBlueprint, ...testMetadata } = blueprint;
      const testQuestions = [];

      // Helper function to pick random elements from array
      const pickRandom = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      // Select Quant questions
      if (qBlueprint.quantitative > 0) {
        const pickedQuant = pickRandom(quantQuestions, qBlueprint.quantitative);
        testQuestions.push(...pickedQuant.map(q => q._id));
      }

      // Select Logical questions
      if (qBlueprint.logical > 0) {
        const pickedLogical = pickRandom(logicalQuestions, qBlueprint.logical);
        testQuestions.push(...pickedLogical.map(q => q._id));
      }

      // Select Verbal questions
      if (qBlueprint.verbal > 0) {
        const pickedVerbal = pickRandom(verbalQuestions, qBlueprint.verbal);
        testQuestions.push(...pickedVerbal.map(q => q._id));
      }

      // Create test document
      testsToCreate.push({
        ...testMetadata,
        questions: testQuestions,
        totalMarks: testQuestions.length * 10, // 10 marks per question
        passingMarks: Math.ceil(testQuestions.length * 10 * 0.5) // 50% passing
      });
    }

    const insertedTests = await Test.insertMany(testsToCreate);
    console.log(`✅ Seeded ${insertedTests.length} linked Mock Tests.`);

    console.log('\n🎉 ALL SEEDING COMPLETED SUCCESSFULLY! 🎉');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    if (mongoose.connection) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedAll();
}

module.exports = seedAll;
