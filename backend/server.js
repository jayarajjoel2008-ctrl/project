const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const trackRoutes = require('./routes/trackRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'ABTalks Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// API Routes (with and without /api prefix)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/challenges', challengeRoutes);
app.use('/challenges', challengeRoutes);

app.use('/api/tracks', trackRoutes);
app.use('/tracks', trackRoutes);

app.use('/api', submissionRoutes);
app.use('/', submissionRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route Not Found - ${req.originalUrl}` });
});

// Central Error Handler
app.use(errorHandler);

// Start server if not imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 ABTalks Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`========================================`);
  });
}

module.exports = app;