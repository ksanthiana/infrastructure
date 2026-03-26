// ============================================
// SIT Burundi - Backend API Server
// Smart Infrastructure & Tourism Platform
// Built with Node.js + Express + SQLite
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const { initDatabase } = require('./db/database');
initDatabase();

// Import routes
const authRoutes = require('./routes/auth');
const tourismRoutes = require('./routes/tourism');
const infrastructureRoutes = require('./routes/infrastructure');
const investmentRoutes = require('./routes/investment');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// API Routes (prefixed with /api)
app.use('/api/auth', authRoutes);
app.use('/api/tourism', tourismRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SIT Burundi API is running', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SIT Burundi Server running on http://localhost:${PORT}`);
    console.log(`📋 API Documentation available at http://localhost:${PORT}/api`);
});

module.exports = app;