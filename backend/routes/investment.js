// ============================================
// Investment Routes (FR-09, FR-10)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all investment opportunities (FR-09)
router.get('/opportunities', (req, res) => {
    try {
        const opportunities = db.prepare('SELECT * FROM investments ORDER BY title').all();
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch investments' });
    }
});

// Submit investor inquiry (FR-10)
router.post('/inquiry', (req, res) => {
    try {
        const { investorName, investorEmail, zone, type, message } = req.body;

        if (!investorName || !investorEmail || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const result = db.prepare(
            'INSERT INTO inquiries (investor_name, investor_email, zone, type, message) VALUES (?, ?, ?, ?, ?)'
        ).run(investorName, investorEmail, zone || '', type || '', message);

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// Get all inquiries (admin only)
router.get('/inquiries', (req, res) => {
    try {
        const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// Update inquiry status (admin)
router.patch('/inquiries/:id', (req, res) => {
    try {
        const { status } = req.body;
        db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

module.exports = router;