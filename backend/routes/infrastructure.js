// ============================================
// Infrastructure Routes (FR-06, FR-07)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all infrastructure zones (FR-06)
router.get('/zones', (req, res) => {
    try {
        const zones = db.prepare('SELECT * FROM infrastructure_zones ORDER BY name').all();

        // Calculate overall readiness score (FR-07)
        const zonesWithScores = zones.map(zone => {
            const scores = [zone.road, zone.transport, zone.ict, zone.electricity, zone.water, zone.accommodation];
            const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

            let status = 'Needs improvement';
            if (overall >= 75) status = 'Good';
            else if (overall >= 50) status = 'Moderate';

            return { ...zone, overall, status };
        });

        res.json(zonesWithScores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch infrastructure data' });
    }
});

// Get single zone
router.get('/zones/:id', (req, res) => {
    try {
        const zone = db.prepare('SELECT * FROM infrastructure_zones WHERE id = ?').get(req.params.id);
        if (!zone) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        const scores = [zone.road, zone.transport, zone.ict, zone.electricity, zone.water, zone.accommodation];
        const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        res.json({ ...zone, overall });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch zone' });
    }
});

// Get summary statistics
router.get('/summary', (req, res) => {
    try {
        const zones = db.prepare('SELECT road, transport, ict, electricity, water, accommodation FROM infrastructure_zones').all();

        const avg = (arr, key) => Math.round(arr.reduce((a, b) => a + (b[key] || 0), 0) / arr.length);

        const summary = {
            roads: avg(zones, 'road'),
            utilities: Math.round((avg(zones, 'electricity') + avg(zones, 'water')) / 2),
            ict: avg(zones, 'ict'),
            accommodation: avg(zones, 'accommodation')
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

module.exports = router;