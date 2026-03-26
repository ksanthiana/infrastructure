// ============================================
// Email Service for SIT Burundi
// ============================================

const nodemailer = require('nodemailer');

// Email configuration - should be moved to environment variables in production
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('Email service error:', error);
    } else {
        console.log('Email service ready');
    }
});

/**
 * Send approval notification email to investor
 * @param {string} investorEmail - Investor's email address
 * @param {string} investorName - Investor's name
 * @param {string} inquiryType - Type of inquiry (zone, type)
 * @param {string} message - Original inquiry message
 */
async function sendApprovalEmail(investorEmail, investorName, inquiryType, message) {
    try {
        const mailOptions = {
            from: `"SIT Burundi" <${emailConfig.auth.user}>`,
            to: investorEmail,
            subject: 'Your Investment Inquiry Has Been Approved - SIT Burundi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0B3A6A 0%, #1a1a3a 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">SIT Burundi</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Smart Infrastructure & Tourism</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #0B3A6A; margin-top: 0;">Great News, ${investorName}!</h2>
                        
                        <p style="color: #333; line-height: 1.6;">
                            Your investment inquiry has been <strong>approved</strong> by our admin team. 
                            We're excited about your interest in investing in Burundi's tourism and infrastructure sector.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B3A6A;">
                            <h3 style="color: #0B3A6A; margin-top: 0;">Inquiry Details:</h3>
                            <p style="margin: 5px 0;"><strong>Type:</strong> ${inquiryType || 'General Investment'}</p>
                            <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
                            <p style="margin: 5px 0; color: #666; font-style: italic;">"${message}"</p>
                        </div>
                        
                        <p style="color: #333; line-height: 1.6;">
                            Our team will be in touch with you shortly to discuss the next steps and provide 
                            you with detailed information about the investment opportunities available.
                        </p>
                        
                        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #0B3A6A;">
                                <strong>What's Next?</strong><br>
                                • Review additional investment opportunities on our platform<br>
                                • Prepare any required documentation<br>
                                • Schedule a consultation with our investment team
                            </p>
                        </div>
                        
                        <p style="color: #333; line-height: 1.6;">
                            If you have any questions, please don't hesitate to contact us.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.APP_URL || 'http://localhost:3000'}" 
                               style="background: #D71920; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Visit SIT Burundi Platform
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #0B3A6A; padding: 20px; text-align: center;">
                        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
                            © 2026 SIT Burundi - Smart Infrastructure & Tourism Development Platform<br>
                            Built by Kaze Ange Santhiana (ALU)
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Approval email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send approval email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send rejection notification email to investor
 * @param {string} investorEmail - Investor's email address
 * @param {string} investorName - Investor's name
 * @param {string} inquiryType - Type of inquiry
 * @param {string} message - Original inquiry message
 * @param {string} rejectionReason - Reason for rejection (optional)
 */
async function sendRejectionEmail(investorEmail, investorName, inquiryType, message, rejectionReason = '') {
    try {
        const mailOptions = {
            from: `"SIT Burundi" <${emailConfig.auth.user}>`,
            to: investorEmail,
            subject: 'Update on Your Investment Inquiry - SIT Burundi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0B3A6A 0%, #1a1a3a 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">SIT Burundi</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Smart Infrastructure & Tourism</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #0B3A6A; margin-top: 0;">Thank You for Your Interest, ${investorName}</h2>
                        
                        <p style="color: #333; line-height: 1.6;">
                            We appreciate your interest in investing in Burundi's tourism and infrastructure sector. 
                            After careful review, we regret to inform you that your inquiry could not be approved at this time.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D71920;">
                            <h3 style="color: #0B3A6A; margin-top: 0;">Inquiry Details:</h3>
                            <p style="margin: 5px 0;"><strong>Type:</strong> ${inquiryType || 'General Investment'}</p>
                            <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
                            <p style="margin: 5px 0; color: #666; font-style: italic;">"${message}"</p>
                            ${rejectionReason ? `<p style="margin: 15px 0 5px 0;"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
                        </div>
                        
                        <p style="color: #333; line-height: 1.6;">
                            We encourage you to explore other investment opportunities on our platform or 
                            submit a new inquiry with additional information that might strengthen your proposal.
                        </p>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <p style="margin: 0; color: #856404;">
                                <strong>Suggestions:</strong><br>
                                • Review our investment guidelines<br>
                                • Provide more detailed project proposals<br>
                                • Consider partnering with local businesses<br>
                                • Explore different investment zones
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.APP_URL || 'http://localhost:3000'}" 
                               style="background: #0B3A6A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Explore Investment Opportunities
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #0B3A6A; padding: 20px; text-align: center;">
                        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
                            © 2026 SIT Burundi - Smart Infrastructure & Tourism Development Platform<br>
                            Built by Kaze Ange Santhiana (ALU)
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Rejection email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send rejection email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send pending notification email to investor
 * @param {string} investorEmail - Investor's email address
 * @param {string} investorName - Investor's name
 * @param {string} inquiryType - Type of inquiry
 * @param {string} message - Original inquiry message
 */
async function sendPendingEmail(investorEmail, investorName, inquiryType, message) {
    try {
        const mailOptions = {
            from: `"SIT Burundi" <${emailConfig.auth.user}>`,
            to: investorEmail,
            subject: 'Your Investment Inquiry is Under Review - SIT Burundi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0B3A6A 0%, #1a1a3a 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">SIT Burundi</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Smart Infrastructure & Tourism</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #0B3A6A; margin-top: 0;">Thank You, ${investorName}!</h2>
                        
                        <p style="color: #333; line-height: 1.6;">
                            We have received your investment inquiry and it is currently <strong>under review</strong> 
                            by our admin team. We appreciate your patience.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <h3 style="color: #0B3A6A; margin-top: 0;">Inquiry Details:</h3>
                            <p style="margin: 5px 0;"><strong>Type:</strong> ${inquiryType || 'General Investment'}</p>
                            <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
                            <p style="margin: 5px 0; color: #666; font-style: italic;">"${message}"</p>
                            <p style="margin: 15px 0 5px 0;"><strong>Status:</strong> <span style="color: #ffc107;">Pending Review</span></p>
                        </div>
                        
                        <p style="color: #333; line-height: 1.6;">
                            Our team typically reviews inquiries within 2-3 business days. You will receive 
                            an email notification once your inquiry has been reviewed.
                        </p>
                        
                        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #0B3A6A;">
                                <strong>While You Wait:</strong><br>
                                • Explore our investment opportunities<br>
                                • Review infrastructure readiness by zone<br>
                                • Learn about tourism destinations in Burundi
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.APP_URL || 'http://localhost:3000'}" 
                               style="background: #0B3A6A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Explore SIT Burundi Platform
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #0B3A6A; padding: 20px; text-align: center;">
                        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
                            © 2026 SIT Burundi - Smart Infrastructure & Tourism Development Platform<br>
                            Built by Kaze Ange Santhiana (ALU)
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Pending email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send pending email:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendApprovalEmail,
    sendRejectionEmail,
    sendPendingEmail
};
