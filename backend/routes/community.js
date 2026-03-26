// ============================================
// Community Routes (FR-11, FR-12, FR-13)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get approved services (FR-11)
router.get('/services', (req, res) => {
    try {
        const services = db.prepare('SELECT * FROM services WHERE status = ? ORDER BY created_at DESC').all('Approved');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Register new service (FR-11)
router.post('/services', (req, res) => {
    try {
        const { ownerName, ownerEmail, businessName, category, location, description, contact } = req.body;

        if (!businessName || !category || !location || !contact) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const result = db.prepare(
            'INSERT INTO services (owner_name, owner_email, business_name, category, location, description, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(ownerName || '', ownerEmail || '', businessName, category, location, description || '', contact, 'Pending');

        res.status(201).json({
            message: 'Service submitted for approval',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register service' });
    }
});

// Get all services (admin)
router.get('/services/all', (req, res) => {
    try {
        const services = db.prepare('SELECT * FROM services ORDER BY created_at DESC').all();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Update service status (admin)
router.patch('/services/:id', (req, res) => {
    try {
        const { status } = req.body;
        db.prepare('UPDATE services SET status = ? WHERE id = ?').run(status, req.params.id);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// Get jobs (FR-12)
router.get('/jobs', (req, res) => {
    try {
        const jobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Post job (admin)
router.post('/jobs', (req, res) => {
    try {
        const { title, company, location, type, description, applyContact } = req.body;

        if (!title || !company || !applyContact) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const result = db.prepare(
            'INSERT INTO jobs (title, company, location, type, description, apply_contact) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(title, company, location || '', type || '', description || '', applyContact);

        res.status(201).json({
            message: 'Job posted',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post job' });
    }
});

// Delete job (admin)
router.delete('/jobs/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

// Submit feedback (FR-13)
router.post('/feedback', (req, res) => {
    try {
        const { userName, userEmail, subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ error: 'Subject and message are required' });
        }

        const result = db.prepare(
            'INSERT INTO feedbacks (user_name, user_email, subject, message) VALUES (?, ?, ?, ?)'
        ).run(userName || '', userEmail || '', subject, message);

        res.status(201).json({
            message: 'Feedback submitted',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get all feedback (admin)
router.get('/feedbacks', (req, res) => {
    try {
        const feedbacks = db.prepare('SELECT * FROM feedbacks ORDER BY created_at DESC').all();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// Update feedback status (admin)
router.patch('/feedbacks/:id', (req, res) => {
    try {
        const { status } = req.body;
        db.prepare('UPDATE feedbacks SET status = ? WHERE id = ?').run(status, req.params.id);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update feedback' });
    }
});

module.exports = router;