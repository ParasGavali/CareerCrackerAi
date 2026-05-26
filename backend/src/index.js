require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { connect } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const testRoutes = require('./routes/tests');
const codingRoutes = require('./routes/coding');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Utility Middleware ───────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowed = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000'
    ];
    
    const isVercel = origin.endsWith('.vercel.app');
    const isCustomFrontend = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;
    
    if (allowed.indexOf(origin) !== -1 || isVercel || isCustomFrontend) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerCracker AI Backend is running ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CareerCracker AI API',
    version: '1.0.0',
    docs: '/api',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerCracker AI API v1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      questions: '/api/questions',
      tests: '/api/tests',
      coding: '/api/coding',
      analytics: '/api/analytics',
      admin: '/api/admin',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connect();

    app.listen(PORT, () => {
      console.log('\n🚀 CareerCracker AI Backend Started');
      console.log('═══════════════════════════════════════════');
      console.log(`📡 Server:       http://localhost:${PORT}`);
      console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started at:   ${new Date().toLocaleString()}`);
      console.log('═══════════════════════════════════════════');
      console.log('📚 Available Routes:');
      console.log(`   GET  http://localhost:${PORT}/health`);
      console.log(`   POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
      console.log(`   POST http://localhost:${PORT}/api/auth/refresh`);
      console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
      console.log(`   GET  http://localhost:${PORT}/api/users/profile`);
      console.log(`   PUT  http://localhost:${PORT}/api/users/profile`);
      console.log(`   GET  http://localhost:${PORT}/api/users/stats`);
      console.log(`   GET  http://localhost:${PORT}/api/users/history`);
      console.log(`   GET  http://localhost:${PORT}/api/questions`);
      console.log(`   GET  http://localhost:${PORT}/api/questions/random`);
      console.log(`   GET  http://localhost:${PORT}/api/questions/categories`);
      console.log(`   GET  http://localhost:${PORT}/api/tests`);
      console.log(`   POST http://localhost:${PORT}/api/tests/:id/start`);
      console.log(`   POST http://localhost:${PORT}/api/tests/:id/submit`);
      console.log(`   GET  http://localhost:${PORT}/api/coding/problems`);
      console.log(`   POST http://localhost:${PORT}/api/coding/run`);
      console.log(`   POST http://localhost:${PORT}/api/coding/submit`);
      console.log(`   GET  http://localhost:${PORT}/api/analytics/dashboard`);
      console.log(`   GET  http://localhost:${PORT}/api/analytics/leaderboard`);
      console.log(`   GET  http://localhost:${PORT}/api/admin/stats`);
      console.log('═══════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
