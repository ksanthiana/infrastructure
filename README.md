# Smart Infrastructure & Tourism Development Platform for Burundi

## Overview
The **Smart Infrastructure and Tourism Development Platform** is a full-stack web application designed to bridge the gap between tourism promotion, infrastructure monitoring, investment preparedness, and community engagement in Burundi.

## Architecture

This is a **full-stack application** with:
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express API
- **Database**: SQLite (better-sqlite3)

## Live Demo
**Frontend:** https://ksanthiana.github.io/infrastructure/index.html

## Running Locally

### Frontend Only (Current Demo)
Simply open `index.html` in your browser - uses LocalStorage for demo data.

### Full Stack (With Backend)
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start server
npm start
```

Server runs at: http://localhost:3000

## Features

| Module | Features |
|--------|----------|
| **Tourism** | Interactive map, destination listings, search/filter |
| **Infrastructure** | Readiness dashboards, zone scores, recommendations |
| **Investment** | Opportunity listings, inquiry submission |
| **Community** | Service registration, job listings, feedback |
| **Admin** | Content management, reports, user moderation |

## User Roles

| Role | Access |
|------|--------|
| Tourist | Browse destinations, submit feedback |
| Investor | View opportunities, send inquiries |
| Community | Register services, view jobs |
| Admin | Full access to all features |

## Default Admin Account
- Email: admin@sitburundi.com
- Password: Admin123!

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Tourism
- `GET /api/tourism/destinations` - All destinations
- `GET /api/tourism/destinations/:id` - Single destination

### Infrastructure
- `GET /api/infrastructure/zones` - Zone readiness scores
- `GET /api/infrastructure/summary` - Summary stats

### Investment
- `GET /api/investment/opportunities` - Investment listings
- `POST /api/investment/inquiry` - Submit inquiry

### Community
- `GET /api/community/services` - Approved services
- `POST /api/community/services` - Register service
- `GET /api/community/jobs` - Job listings
- `POST /api/community/feedback` - Submit feedback

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/admin/destinations` - Add destination
- `GET /api/admin/report/:type` - Generate report

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript, Leaflet.js |
| Backend | Node.js, Express, JWT |
| Database | SQLite (better-sqlite3) |
| Authentication | bcrypt + JWT tokens |

## License
© 2026 SIT Burundi - Built by Kaze Ange Santhiana (ALU)
