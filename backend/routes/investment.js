// ============================================
// Investment Routes (FR-09, FR-10)
// ============================================

const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { sendApprovalEmail, sendRejectionEmail, sendPendingEmail } = require('../emailService');

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
router.patch('/inquiries/:id', async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const inquiryId = req.params.id;

        // Get inquiry details before updating
        const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inquiryId);

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        // Update status
        db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, inquiryId);

        // Send email notification based on status
        let emailResult = { success: false };

        if (status === 'Approved') {
            emailResult = await sendApprovalEmail(
                inquiry.investor_email,
                inquiry.investor_name,
                inquiry.type,
                inquiry.message
            );
        } else if (status === 'Rejected') {
            emailResult = await sendRejectionEmail(
                inquiry.investor_email,
                inquiry.investor_name,
                inquiry.type,
                inquiry.message,
                rejectionReason
            );
        } else if (status === 'Pending') {
            emailResult = await sendPendingEmail(
                inquiry.investor_email,
                inquiry.investor_name,
                inquiry.type,
                inquiry.message
            );
        }

        res.json({
            message: 'Status updated',
            emailSent: emailResult.success,
            emailMessageId: emailResult.messageId
        });
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

module.exports = router;