// ============================================
// Tourism Routes (FR-03, FR-04, FR-05)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all destinations (FR-03)
router.get('/destinations', (req, res) => {
    try {
        const { search, category } = req.query;

        let query = 'SELECT * FROM destinations WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR province LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY name';

        const destinations = db.prepare(query).all(...params);
        res.json(destinations.map(d => ({
            ...d,
            services: d.services ? d.services.split(',') : []
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch destinations' });
    }
});

// Get single destination (FR-04)
router.get('/destinations/:id', (req, res) => {
    try {
        const destination = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.json({
            ...destination,
            services: destination.services ? destination.services.split(',') : []
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch destination' });
    }
});

// Search and filter destinations (FR-05)
router.get('/search', (req, res) => {
    try {
        const { q, category, region } = req.query;

        let query = 'SELECT * FROM destinations WHERE 1=1';
        const params = [];

        if (q) {
            query += ' AND (name LIKE ? OR description LIKE ? OR province LIKE ?)';
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (region) {
            query += ' AND region = ?';
            params.push(region);
        }

        query += ' ORDER BY name';

        const destinations = db.prepare(query).all(...params);
        res.json(destinations.map(d => ({
            ...d,
            services: d.services ? d.services.split(',') : []
        })));
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;