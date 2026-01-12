const nodemailer = require('nodemailer');
const config = require('../config/env');

class EmailService {
  constructor() {
    // Create transporter if SMTP is configured
    if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465,
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASSWORD,
        },
      });
    } else {
      // In development, log emails instead of sending
      console.warn('⚠️  SMTP not configured. Emails will be logged to console.');
      this.transporter = null;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetUrl, firstName) {
    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">Password Reset Request</h2>
            <p>Hello ${firstName},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>This link will expire in 10 minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Generic email sender
   */
  async sendEmail(mailOptions) {
    if (!this.transporter) {
      // Log email in development
      console.log('📧 Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.html || mailOptions.text);
      return { messageId: 'logged-to-console' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();

