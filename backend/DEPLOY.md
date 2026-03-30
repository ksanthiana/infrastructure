# SIT Burundi Backend - Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (https://render.com)

## Deployment Steps

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy on Render
1. Go to https://render.com and sign in
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to start deployment

### 3. Environment Variables (Auto-configured)
The following environment variables are automatically set by Render:
- `NODE_ENV`: production
- `PORT`: 10000
- `DATABASE_URL`: PostgreSQL connection string (from Render's managed database)
- `JWT_SECRET`: Auto-generated secure value

### 4. Manual Configuration (Alternative)
If you prefer manual setup:

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
   - **Plan**: Free

4. Create a PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Name: `sit-burundi-db`
   - Database: `sitburundi`
   - Plan: Free

5. Link the database to your web service:
   - In your web service settings, add environment variable:
   - Key: `DATABASE_URL`
   - Value: Copy the "External Database URL" from your PostgreSQL service

## Database Migration
The application automatically:
- Creates all required tables on first run
- Seeds initial data (destinations, infrastructure zones, jobs)
- Creates a default admin user

## Default Admin Credentials
- **Email**: admin@sitburundi.com
- **Password**: Admin123!

⚠️ **Important**: Change the admin password after first login in production!

## API Endpoints
Once deployed, your API will be available at:
- Health check: `https://your-app.onrender.com/api/health`
- Auth: `https://your-app.onrender.com/api/auth/*`
- Tourism: `https://your-app.onrender.com/api/tourism/*`
- Infrastructure: `https://your-app.onrender.com/api/infrastructure/*`
- Investment: `https://your-app.onrender.com/api/investment/*`
- Community: `https://your-app.onrender.com/api/community/*`
- Admin: `https://your-app.onrender.com/api/admin/*`

## Troubleshooting

### Build fails
- Ensure `package.json` has all dependencies listed
- Check Node.js version (requires >=18.0.0)

### Database connection issues
- Verify `DATABASE_URL` environment variable is set
- Check that the PostgreSQL service is running

### Application crashes on startup
- Check logs in Render dashboard
- Verify all environment variables are set correctly

## Local Development
For local development with SQLite:
```bash
cd backend
npm install
npm run dev
```

The application will run on `http://localhost:3000` with SQLite database.
