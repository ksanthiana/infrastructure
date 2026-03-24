# Smart Infrastructure & Tourism Development Platform for Burundi

## Overview
The **Smart Infrastructure and Tourism Development Platform** is a web-based innovation designed to bridge the gap between tourism promotion, infrastructure monitoring, investment preparedness, and community engagement in Burundi.

**Live Demo:** https://ksanthiana.github.io/infrastructure/index.html

## Problem Statement
Burundi possesses immense tourism potential, from the shores of Lake Tanganyika to the peaks of Mount Heha. However, this potential is hindered by:
1. Fragmented information about tourist destinations
2. Unclear infrastructure readiness around sites
3. Lack of visibility for investors
4. Limited digital presence for local communities

## Solution
This platform offers an integrated, role-based digital ecosystem:
- **Tourists** explore destinations and plan safe routes
- **Investors** evaluate infrastructure readiness and find opportunities
- **Community Members** register services and find jobs
- **Admins** manage content and generate reports

## Features
- Interactive tourism map with destination profiles
- Infrastructure readiness dashboards by zone
- Investment opportunity listings with inquiry system
- Community service registration
- Job listings portal
- Role-based access control (RBAC)
- Admin dashboard for content management

## Tech Stack
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js for interactive mapping
- LocalStorage for data persistence
- GitHub Pages deployment

## Quick Start

### Method 1: Live Demo
Visit: https://ksanthiana.github.io/infrastructure/index.html

### Method 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/ksanthiana/infrastructure.git
   cd infrastructure
   ```

2. Open `index.html` in your browser, or use a local server:
   ```bash
   # If using VS Code, install "Live Server" extension
   # Right-click index.html → Open with Live Server
   ```

## Testing Roles

### Admin Account
- Email: admin@sitburundi.com
- Password: Admin123!

### Create New Account
1. Go to Register page
2. Choose role: Tourist, Investor, or Community
3. Login with your credentials

## Project Structure
```
├── index.html          # Home page
├── tourism.html       # Destinations listing
├── infrastructure.html # Readiness dashboard
├── investment.html     # Investment opportunities
├── community.html     # Community & jobs
├── admin.html         # Admin dashboard
├── login.html         # Authentication
├── register.html      # User registration
├── destination.html   # Destination details
├── css/
│   ├── style.css      # Main styles
│   └── variables.css  # CSS variables
└── js/
    ├── app.js         # Main application logic
    ├── data.js        # Data definitions
    ├── auth.js        # Authentication
    ├── storage.js     # LocalStorage wrapper
    └── script.js      # UI utilities
```

## License
© 2026 SIT Burundi - Built by Kaze Ange Santhiana (ALU)
