// ============================================
// Admin Routes (FR-08, FR-14)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const jwt = require('jsonwebtoken');

// Middleware to check admin role
function requireAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'sit-burundi-secret-key-2026', (err, user) => {
        if (err || user.role !== 'Admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.user = user;
        next();
    });
}

// Dashboard statistics
router.get('/stats', requireAdmin, (req, res) => {
    try {
        const inquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get();
        const pendingServices = db.prepare('SELECT COUNT(*) as count FROM services WHERE status = ?').get('Pending');
        const jobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
        const feedbacks = db.prepare('SELECT COUNT(*) as count FROM feedbacks').get();
        const users = db.prepare('SELECT COUNT(*) as count FROM users').get();

        res.json({
            inquiries: inquiries.count,
            pendingServices: pendingServices.count,
            jobs: jobs.count,
            feedbacks: feedbacks.count,
            users: users.count
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Add destination (FR-08)
router.post('/destinations', requireAdmin, (req, res) => {
    try {
        const { name, region, province, category, description, image, landmarkDirections, verifiedBy, services, zoneId, lat, lng } = req.body;

        if (!name || !region || !province || !category) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const result = db.prepare(`
      INSERT INTO destinations (name, region, province, category, label, description, image, landmark_directions, verified_by, services, zone_id, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            name, region, province, category, category.charAt(0).toUpperCase() + category.slice(1),
            description || '', image || '', landmarkDirections || '', verifiedBy || 'Admin',
            (services || []).join(','), zoneId || '', lat || 0, lng || 0
        );

        res.status(201).json({
            message: 'Destination added',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add destination' });
    }
});

// Update destination (FR-08)
router.put('/destinations/:id', requireAdmin, (req, res) => {
    try {
        const { name, region, province, category, description } = req.body;

        db.prepare(`
      UPDATE destinations SET name = ?, region = ?, province = ?, category = ?, description = ?
      WHERE id = ?
    `).run(name, region, province, category, description, req.params.id);

        res.json({ message: 'Destination updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update destination' });
    }
});

// Update infrastructure zone (FR-08)
router.put('/zones/:id', requireAdmin, (req, res) => {
    try {
        const { name, road, transport, ict, electricity, water, accommodation, keyGap, recommendation } = req.body;

        db.prepare(`
      UPDATE infrastructure_zones 
      SET name = ?, road = ?, transport = ?, ict = ?, electricity = ?, water = ?, accommodation = ?, key_gap = ?, recommendation = ?
      WHERE id = ?
    `).run(name, road, transport, ict, electricity, water, accommodation, keyGap, recommendation, req.params.id);

        res.json({ message: 'Zone updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update zone' });
    }
});

// Generate report (FR-14)
router.get('/report/:type', requireAdmin, (req, res) => {
    try {
        const { type } = req.params;
        let data = {};

        switch (type) {
            case 'infrastructure':
                data.zones = db.prepare('SELECT * FROM infrastructure_zones').all();
                data.summary = {
                    total: data.zones.length,
                    avgRoad: Math.round(data.zones.reduce((a, z) => a + z.road, 0) / data.zones.length),
                    avgICT: Math.round(data.zones.reduce((a, z) => a + z.ict, 0) / data.zones.length)
                };
                break;
            case 'investments':
                data.inquiries = db.prepare('SELECT * FROM inquiries').all();
                break;
            case 'community':
                data.services = db.prepare('SELECT * FROM services').all();
                data.jobs = db.prepare('SELECT * FROM jobs').all();
                break;
            default:
                return res.status(400).json({ error: 'Invalid report type' });
        }

        // Generate text report
        let report = `SIT Burundi - ${type.toUpperCase()} Report\n`;
        report += `Generated: ${new Date().toISOString()}\n`;
        report += `${'='.repeat(50)}\n\n`;
        report += JSON.stringify(data, null, 2);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=report-${type}-${Date.now()}.txt`);
        res.send(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

module.exports = router;