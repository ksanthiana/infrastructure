# Smart Infrastructure & Tourism Development Platform for Burundi

## Overview
The **Smart Infrastructure and Tourism Development Platform** is a web-based innovation designed to bridge the gap between tourism promotion, infrastructure monitoring, investment preparedness, and community engagement in Burundi. It provides interactive maps, destination profiles, infrastructure readiness dashboards, investment listings, and local job portals.

**Live Demo:** https://ksanthiana.github.io/infrastructure/index.html
**SRS Document:** [Link to Google Doc SRS]
**Video Walkthrough:** [Link to Video]

## Problem Statement
Burundi possesses immense tourism potential, from the shores of Lake Tanganyika to the peaks of Mount Heha. However, this potential is hindered by:
1. Fragmented information about tourist destinations.
2. Unclear infrastructure readiness (roads, electricity, ICT) around these sites.
3. Lack of visibility for investors looking for viable hospitality or transport opportunities.
4. Limited digital presence for local communities and SMEs to offer their services (guides, crafts, transport).

**Why is it a problem?** This disconnect slows economic growth, leaves communities out of the tourism value chain, and discourages foreign and domestic investment due to a lack of clear data on accessibility and readiness.

## Proposed Solution
This platform offers an integrated, role-based digital ecosystem that connects all stakeholders:
- **Tourists** can explore destinations, plan safe routes based on community landmarks, and view verified services.
- **Investors** can evaluate infrastructure readiness dashboards by zone and discover curated investment opportunities.
- **Community Members & SMEs** can register their local services and apply to tourism-related job postings.
- **Planners (Admins)** gain oversight to track investor inquiries, approve local services, monitor community feedback, and generate readiness reports.

---

## Technical Architecture
- **Frontend Layer:** HTML5, CSS3 (Vanilla), JavaScript (ES6+), Leaflet.js for interactive mapping.
- **Data Layer:** LocalStorage (simulate a lightweight MVP database for roles, sessions, and entity management).
- **Deployment:** GitHub Pages (or preferred static hosting).

---

## Local Setup Instructions

Follow these exact steps to run the platform locally on your machine:

### Prerequisites
- A modern web browser (Google Chrome, Mozilla Firefox, or Microsoft Edge).
- Optional: A local development server like the "Live Server" extension for VS Code.

### Step 1: Clone the Repository
Open your terminal or command prompt and run:
\`\`\`bash
git clone https://github.com/ksanthiana/infrastructure.git
cd infrastructure
\`\`\`
*(If you downloaded the ZIP file instead, extract it and open the extracted folder).*

### Step 2: Open the Project
There is no complex build step or heavy framework required. You can choose one of the following methods to view the app:

**Method A: Direct File Execution (Simplest)**
1. Navigate to the project folder.
2. Double-click the `index.html` file to open it in your default web browser.

**Method B: Using VS Code (Recommended for Developers)**
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension from the VS Code Marketplace.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The application will automatically open in your web browser at `http://127.0.0.1:5500`.

### Step 3: Testing the Application Roles (RBAC)
When testing the platform, use the built-in authentication system.
1. Navigate to the **Login** or **Sign up** page from the navigation bar.
2. Create dummy accounts choosing different roles from the dropdown (`Tourist`, `Investor`, `Community`, or `Admin`).
3. Depending on your logged-in role, different features will unlock:
   - **Admin:** Can access the Admin Panel, approve services, view feedback, and add new tourism destinations.
   - **Investor:** Can send inquiries for specific investment opportunities.
   - **Community:** Can register local services to the platform.
   - **Tourist:** Can view destinations, use the Safe Browse map, and submit infrastructure feedback.

---

## Contact & Credits
Developed by **Kaze Ange Santhiana** for the African Leadership University (ALU) Software Prototype Final Project. 
