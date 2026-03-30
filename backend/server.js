// ============================================
// SIT Burundi - Backend API Server
// Smart Infrastructure & Tourism Platform
// Built with Node.js + Express + PostgreSQL/SQLite
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const { initDatabase } = require('./db/database');

// Import routes
const authRoutes = require('./routes/auth');
const tourismRoutes = require('./routes/tourism');
const infrastructureRoutes = require('./routes/infrastructure');
const investmentRoutes = require('./routes/investment');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
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
    res.json({ 
        status: 'ok', 
        message: 'SIT Burundi API is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString() 
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server with async database initialization
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 SIT Burundi Server running on http://localhost:${PORT}`);
            console.log(`📋 API Documentation available at http://localhost:${PORT}/api`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
