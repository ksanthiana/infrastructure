// ============================================
// Database Configuration
// Using better-sqlite3 for SQLite database
// ============================================

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'sitburundi.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDatabase() {
    // Users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Tourist',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Destinations table
    db.exec(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      province TEXT NOT NULL,
      category TEXT NOT NULL,
      label TEXT,
      description TEXT,
      image TEXT,
      landmark_directions TEXT,
      verified_by TEXT,
      services TEXT,
      zone_id TEXT,
      lat REAL,
      lng REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Infrastructure zones table
    db.exec(`
    CREATE TABLE IF NOT EXISTS infrastructure_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      road INTEGER DEFAULT 0,
      transport INTEGER DEFAULT 0,
      ict INTEGER DEFAULT 0,
      electricity INTEGER DEFAULT 0,
      water INTEGER DEFAULT 0,
      accommodation INTEGER DEFAULT 0,
      key_gap TEXT,
      recommendation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Investment opportunities table
    db.exec(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      sector TEXT,
      location TEXT,
      zone_id TEXT,
      budget TEXT,
      expected_impact TEXT,
      roi TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Investor inquiries table
    db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      investor_name TEXT NOT NULL,
      investor_email TEXT NOT NULL,
      zone TEXT,
      type TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Community services table
    db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_name TEXT NOT NULL,
      owner_email TEXT,
      business_name TEXT NOT NULL,
      category TEXT,
      location TEXT,
      description TEXT,
      contact TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Jobs table
    db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      type TEXT,
      description TEXT,
      apply_contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Feedback table
    db.exec(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      user_email TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Seed default admin user
    const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@sitburundi.com');
    if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('Admin123!', 10);
        db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
            'Platform Admin',
            'admin@sitburundi.com',
            hashedPassword,
            'Admin'
        );
        console.log('✓ Default admin user created');
    }

    // Seed destinations if empty
    const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get();
    if (destCount.count === 0) {
        seedDestinations(db);
        console.log('✓ Seed destinations added');
    }

    // Seed infrastructure zones if empty
    const zoneCount = db.prepare('SELECT COUNT(*) as count FROM infrastructure_zones').get();
    if (zoneCount.count === 0) {
        seedInfrastructureZones(db);
        console.log('✓ Seed infrastructure zones added');
    }

    // Seed jobs if empty
    const jobCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
    if (jobCount.count === 0) {
        seedJobs(db);
        console.log('✓ Seed jobs added');
    }

    console.log('✓ Database initialized successfully');
}

function seedDestinations(db) {
    const destinations = [
        {
            name: 'Lake Tanganyika',
            region: 'West',
            province: 'Bujumbura',
            category: 'lake',
            label: 'Lake',
            description: "Burundi's most iconic lakeside destination with beaches, sunsets, and restaurants.",
            image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
            landmark_directions: 'Located along the Chaussée d\'Uvira, follow the main road towards the port.',
            verified_by: 'Bujumbura Local Guide Hub',
            services: 'Hotels,Restaurants,Boat tours,Local transport',
            zone_id: 'bujumbura',
            lat: -3.3822,
            lng: 29.3644
        },
        {
            name: 'Kibira National Park',
            region: 'North-West',
            province: 'Kayanza',
            category: 'park',
            label: 'Park',
            description: 'A biodiversity hotspot for hiking and primates. Access is via community-verified routes.',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
            landmark_directions: 'Ascend from Kayanza city center, follow the signs for the tea factory.',
            verified_by: 'Kibira Eco-Validators',
            services: 'Guided hikes,Camping,Eco-lodges',
            zone_id: 'kibira',
            lat: -2.9333,
            lng: 29.5
        },
        {
            name: 'Gishora Drum Sanctuary',
            region: 'Central',
            province: 'Gitega',
            category: 'culture',
            label: 'Culture',
            description: "The heart of Burundi's drumming tradition, safely accessible through the cultural corridor.",
            image: 'https://images.unsplash.com/photo-1520975958225-3f61d0a1c1a3?auto=format&fit=crop&w=1200&q=80',
            landmark_directions: '7km from Gitega market, situated on the hill overlooking the royal plains.',
            verified_by: 'Gitega Community Council',
            services: 'Cultural tours,Craft markets,Guesthouses',
            zone_id: 'gitega',
            lat: -3.428,
            lng: 29.93
        },
        {
            name: 'Rusizi National Park',
            region: 'West',
            province: 'Bujumbura Rural',
            category: 'park',
            label: 'Nature',
            description: 'Experience the delta where the Rusizi River meets Lake Tanganyika.',
            image: 'https://images.unsplash.com/photo-1516422317950-ad91171b2049?auto=format&fit=crop&w=1200&q=80',
            landmark_directions: '15km north of Bujumbura city center. Follow the RN4 highway towards the border.',
            verified_by: 'Bujumbura Delta Rangers',
            services: 'Boat safaris,Birdwatching,Guided walks',
            zone_id: 'bujumbura',
            lat: -3.32,
            lng: 29.27
        },
        {
            name: 'Source of the Nile (Rutovu)',
            region: 'South',
            province: 'Bururi',
            category: 'culture',
            label: 'Landmark',
            description: 'Visit the southern-most source of the world\'s longest river.',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            landmark_directions: 'Located in Rutovu. Look for the pyramid monument atop the hill near the village center.',
            verified_by: 'Rutovu Heritage Trust',
            services: 'Local guides,Photography,Souvenirs',
            zone_id: 'rutovu',
            lat: -3.91,
            lng: 29.85
        }
    ];

    const stmt = db.prepare(`
    INSERT INTO destinations (name, region, province, category, label, description, image, landmark_directions, verified_by, services, zone_id, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    for (const d of destinations) {
        stmt.run(d.name, d.region, d.province, d.category, d.label, d.description, d.image, d.landmark_directions, d.verified_by, d.services, d.zone_id, d.lat, d.lng);
    }
}

function seedInfrastructureZones(db) {
    const zones = [
        { name: 'Bujumbura Lakeshore', road: 85, transport: 88, ict: 90, electricity: 80, water: 84, accommodation: 92, key_gap: 'Waste management', recommendation: 'Improve cleanliness and visitor facilities.' },
        { name: 'Gitega Cultural Corridor', road: 74, transport: 68, ict: 66, electricity: 70, water: 73, accommodation: 61, key_gap: 'Accommodation capacity', recommendation: 'Support eco-lodges and event-ready stays.' },
        { name: 'Kibira Eco-Tourism Zone', road: 52, transport: 41, ict: 35, electricity: 42, water: 60, accommodation: 36, key_gap: 'Road access', recommendation: 'Upgrade feeder roads and utilities.' },
        { name: 'Rutovu Landmark Zone', road: 58, transport: 49, ict: 42, electricity: 51, water: 60, accommodation: 40, key_gap: 'Transport and ICT', recommendation: 'Expand shuttle routes and signage.' }
    ];

    const stmt = db.prepare(`
    INSERT INTO infrastructure_zones (name, road, transport, ict, electricity, water, accommodation, key_gap, recommendation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    for (const z of zones) {
        stmt.run(z.name, z.road, z.transport, z.ict, z.electricity, z.water, z.accommodation, z.key_gap, z.recommendation);
    }
}

function seedJobs(db) {
    const jobs = [
        { title: 'Senior Eco-Guide', company: 'Kibira Discovery', location: 'Kayanza', type: 'Full-time', description: 'Lead forest treks and educate visitors on biodiversity.', apply_contact: 'jobs@kibiradiscovery.bi' },
        { title: 'Tourist Shuttle Driver', company: 'SIT Logistics', location: 'Bujumbura', type: 'Contract', description: 'Provide safe transport between destinations.', apply_contact: 'drive@sit-logistics.bi' },
        { title: 'Hospitality Manager', company: 'Lakeside Lodge', location: 'Lake Tanganyika', type: 'Full-time', description: 'Manage guest services and ensure high standards.', apply_contact: 'careers@lakesidelodge.bi' }
    ];

    const stmt = db.prepare(`
    INSERT INTO jobs (title, company, location, type, description, apply_contact)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    for (const j of jobs) {
        stmt.run(j.title, j.company, j.location, j.type, j.description, j.apply_contact);
    }
}

module.exports = { db, initDatabase };