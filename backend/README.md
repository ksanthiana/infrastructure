# SIT Burundi Backend

## Overview
This is the backend API for the Smart Infrastructure & Tourism Development Platform for Burundi. It provides a RESTful API with SQLite database.

## Prerequisites
- Node.js (v14 or higher)
- npm

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
npm start
```

The server will run on http://localhost:3000

## Default Admin Account
- Email: admin@sitburundi.com
- Password: Admin123!

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Tourism
- GET /api/tourism/destinations - Get all destinations
- GET /api/tourism/destinations/:id - Get single destination
- GET /api/tourism/search - Search destinations

### Infrastructure
- GET /api/infrastructure/zones - Get all zones with scores
- GET /api/infrastructure/zones/:id - Get single zone
- GET /api/infrastructure/summary - Get summary statistics

### Investment
- GET /api/investment/opportunities - Get investment opportunities
- POST /api/investment/inquiry - Submit investor inquiry
- GET /api/investment/inquiries - Get all inquiries (admin)

### Community
- GET /api/community/services - Get approved services
- POST /api/community/services - Register new service
- GET /api/community/jobs - Get jobs
- POST /api/community/jobs - Post job (admin)
- POST /api/community/feedback - Submit feedback

### Admin
- GET /api/admin/stats - Dashboard statistics
- POST /api/admin/destinations - Add destination
- PUT /api/admin/destinations/:id - Update destination
- GET /api/admin/report/:type - Generate report

## Database
The application uses SQLite and will automatically create `sitburundi.db` with seed data on first run.

## Project Structure
```
backend/
├── package.json
├── server.js          # Main entry point
├── db/
│   └── database.js    # Database setup & seeding
└── routes/
    ├── auth.js        # Authentication routes
    ├── tourism.js     # Tourism routes
    ├── infrastructure.js  # Infrastructure routes
    ├── investment.js  # Investment routes
    ├── community.js   # Community routes
    └── admin.js       # Admin routes