import crypto from 'crypto';
import nodemailer from 'nodemailer';

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculate token expiration time (24 hours from now)
 */
export function getTokenExpiration(hours: number = 24): Date {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Email transporter configuration
 * Supports multiple email services (Gmail, SendGrid, AWS SES, etc.)
 */
export function createEmailTransporter() {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  console.log('Email Service:', emailService);
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***REDACTED***' : 'UNDEFINED');
  
  // Gmail Configuration
  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use app-specific password
      },
    });
  }
  
  // SendGrid Configuration
  if (emailService === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }
  
  // AWS SES Configuration
  if (emailService === 'ses') {
    return nodemailer.createTransport({
      host: 'email-smtp.' + (process.env.AWS_REGION || 'us-east-1') + '.amazonaws.com',
      port: 587,
      auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASSWORD,
      },
    });
  }
  
  // Fallback to development/test transporter
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025'),
    secure: false,
    auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    } : undefined,
  });
}

/**
 * Email template for verification
 */
export function getVerificationEmailTemplate(
  userName: string,
  verificationLink: string,
  tokenExpiration: Date
): { subject: string; html: string } {
  const expirationTime = new Date(tokenExpiration).toLocaleString();
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #fbbf24;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0f172a;
          margin: 0;
          font-size: 28px;
        }
        .logo {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
        .content {
          margin: 30px 0;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
          color: #333;
        }
        .greeting strong {
          color: #0f172a;
        }
        .message {
          margin: 20px 0;
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }
        .verification-button {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24, #fde047);
          color: #000;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 25px 0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .verification-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .link-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          word-break: break-all;
        }
        .link-section strong {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
        }
        .link-section code {
          color: #666;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }
        .expiration-warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
          color: #856404;
          font-size: 14px;
        }
        .security-note {
          background-color: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
          color: #004085;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          color: #fbbf24;
          text-decoration: none;
          margin: 0 10px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Exotic Cash</h1>
          <div class="logo">Investment Platform</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Welcome <strong>${userName}</strong>! 👋
          </div>
          
          <div class="message">
            Thank you for registering with Exotic Cash. To complete your account setup, 
            please verify your email address by clicking the button below.
          </div>
          
          <div class="button-container">
            <a href="${verificationLink}" class="verification-button">
              ✓ Verify Email Address
            </a>
          </div>
          
          <div class="message" style="text-align: center; color: #999; font-size: 14px;">
            or copy and paste this link:
          </div>
          
          <div class="link-section">
            <strong>Verification Link:</strong>
            <code>${verificationLink}</code>
          </div>
          
          <div class="expiration-warning">
            ⏱️ <strong>Important:</strong> This verification link will expire on <strong>${expirationTime}</strong>. 
            Please verify your email within this timeframe.
          </div>
          
          <div class="security-note">
            🔒 <strong>Security Reminder:</strong> Never share this link with anyone. 
            Exotic Cash staff will never ask for your verification link.
          </div>
          
          <div class="message">
            If you didn't create an account with Exotic Cash, please ignore this email or 
            contact our support team immediately.
          </div>
        </div>
        
        <div class="footer">
          <p>
            © 2025 Exotic Cash. All rights reserved.<br>
            This is an automated email. Please do not reply to this address.
          </p>
          <div class="social-links">
            <a href="https://test.investro.online">Website</a>
            <a href="mailto:support@exoticcash.com">Support</a>
          </div>
          <p style="margin-top: 15px; font-size: 11px; color: #ccc;">
            Exotic Cash Platform | Investment Solutions
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return {
    subject: 'Verify Your Exotic Cash Account Email',
    html,
  };
}

/**
 * Email template for password reset
 */
export function getPasswordResetEmailTemplate(
  userName: string,
  resetLink: string,
  tokenExpiration: Date
): { subject: string; html: string } {
  const expirationTime = new Date(tokenExpiration).toLocaleString();
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #fbbf24;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0f172a;
          margin: 0;
          font-size: 28px;
        }
        .alert {
          background-color: #ffe0e0;
          border-left: 4px solid #ff4444;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          color: #c00;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #fbbf24, #fde047);
          color: #000;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 25px 0;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .link-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          word-break: break-all;
        }
        .link-section code {
          color: #666;
          font-family: 'Courier New', monospace;
        }
        .expiration-warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <div class="alert">
          ⚠️ We received a request to reset your Exotic Cash account password.
        </div>
        
        <div style="margin: 20px 0;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Click the button below to reset your password:</p>
        </div>
        
        <div class="button-container">
          <a href="${resetLink}" class="reset-button">Reset Password</a>
        </div>
        
        <div class="link-section">
          <strong>Or copy this link:</strong><br>
          <code>${resetLink}</code>
        </div>
        
        <div class="expiration-warning">
          ⏱️ This link will expire on <strong>${expirationTime}</strong>.
        </div>
        
        <div style="margin: 20px 0; color: #666; font-size: 14px;">
          <p><strong>If you didn't request this,</strong> please ignore this email. 
          Your account remains secure.</p>
        </div>
        
        <div class="footer">
          © 2025 Exotic Cash. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  
  return {
    subject: 'Reset Your Exotic Cash Password',
    html,
  };
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  toEmail: string,
  userName: string,
  verificationToken: string
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const verificationLink = `${process.env.FRONTEND_URL || 'https://test.investro.online'}/verify-email?token=${verificationToken}`;
    const tokenExpiration = getTokenExpiration(24);
    
    const { subject, html } = getVerificationEmailTemplate(userName, verificationLink, tokenExpiration);
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@exoticcash.com',
      to: toEmail,
      subject,
      html,
    });
    
    console.log(`✅ Verification email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  userName: string,
  resetToken: string
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const resetLink = `${process.env.FRONTEND_URL || 'https://test.investro.online'}/reset-password?token=${resetToken}`;
    const tokenExpiration = getTokenExpiration(1); // 1 hour for password reset
    
    const { subject, html } = getPasswordResetEmailTemplate(userName, resetLink, tokenExpiration);
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@exoticcash.com',
      to: toEmail,
      subject,
      html,
    });
    
    console.log(`✅ Password reset email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return false;
  }
}

/**
 * Get approval email template
 */
export function getApprovalEmailTemplate(
  requestType: 'deposit' | 'withdrawal',
  amount: number,
  currency: string = 'USD'
): { subject: string; html: string } {
  const typeLabel = requestType === 'deposit' ? 'Deposit' : 'Withdrawal';
  const statusColor = '#10b981'; // green
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid ${statusColor};
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0f172a;
          margin: 0;
          font-size: 28px;
        }
        .status-badge {
          display: inline-block;
          background-color: ${statusColor};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-top: 10px;
          font-size: 14px;
        }
        .content {
          margin: 30px 0;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
          color: #333;
        }
        .amount-box {
          background-color: #f0fdf4;
          border-left: 4px solid ${statusColor};
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .amount-label {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .amount-value {
          font-size: 28px;
          font-weight: bold;
          color: ${statusColor};
        }
        .message {
          margin: 20px 0;
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ${typeLabel} Approved</h1>
          <div class="status-badge">APPROVED</div>
        </div>
        
        <div class="content">
          <p class="greeting">Great news!</p>
          
          <p class="message">
            Your ${requestType} request has been <strong>approved</strong> by our admin team.
          </p>
          
          <div class="amount-box">
            <div class="amount-label">Approved Amount</div>
            <div class="amount-value">${currency} ${amount.toFixed(2)}</div>
          </div>
          
          <p class="message">
            Your account balance has been updated accordingly. You can now check your account dashboard to verify the changes.
          </p>
          
          <p class="message">
            If you have any questions or concerns, please don't hesitate to contact our support team.
          </p>
          
          <div class="footer">
            © 2025 Exotic Cash. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return {
    subject: `Your ${typeLabel} Request Has Been Approved! 🎉`,
    html,
  };
}

/**
 * Get rejection email template
 */
export function getRejectionEmailTemplate(
  requestType: 'deposit' | 'withdrawal',
  amount: number,
  currency: string = 'USD',
  rejectionReason: string
): { subject: string; html: string } {
  const typeLabel = requestType === 'deposit' ? 'Deposit' : 'Withdrawal';
  const statusColor = '#ef4444'; // red
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid ${statusColor};
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0f172a;
          margin: 0;
          font-size: 28px;
        }
        .status-badge {
          display: inline-block;
          background-color: ${statusColor};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-top: 10px;
          font-size: 14px;
        }
        .content {
          margin: 30px 0;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
          color: #333;
        }
        .amount-box {
          background-color: #fef2f2;
          border-left: 4px solid ${statusColor};
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .amount-label {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .amount-value {
          font-size: 28px;
          font-weight: bold;
          color: ${statusColor};
        }
        .reason-box {
          background-color: #fef2f2;
          border-left: 4px solid ${statusColor};
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .reason-label {
          font-weight: 600;
          color: ${statusColor};
          margin-bottom: 10px;
        }
        .message {
          margin: 20px 0;
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ ${typeLabel} Request Declined</h1>
          <div class="status-badge">REJECTED</div>
        </div>
        
        <div class="content">
          <p class="greeting">Dear User,</p>
          
          <p class="message">
            Unfortunately, your ${requestType} request could not be approved at this time.
          </p>
          
          <div class="amount-box">
            <div class="amount-label">Requested Amount</div>
            <div class="amount-value">${currency} ${amount.toFixed(2)}</div>
          </div>
          
          <div class="reason-box">
            <div class="reason-label">Reason for Rejection:</div>
            <p style="margin: 0; color: #333;">${rejectionReason}</p>
          </div>
          
          <p class="message">
            If you believe this decision was made in error or have additional information to provide, please contact our support team immediately.
          </p>
          
          <p class="message">
            We're here to help! Don't hesitate to reach out if you have any questions.
          </p>
          
          <div class="footer">
            © 2025 Exotic Cash. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return {
    subject: `Your ${typeLabel} Request Has Been Declined`,
    html,
  };
}

/**
 * Send deposit/withdrawal approval email
 */
export async function sendApprovalEmail(
  userId: number,
  requestType: 'deposit' | 'withdrawal',
  amount: number,
  currency: string = 'USD'
): Promise<boolean> {
  try {
    // TODO: Get user email from database using userId
    // For now, we'll need to pass email as parameter or fetch from DB
    const transporter = createEmailTransporter();
    const { subject, html } = getApprovalEmailTemplate(requestType, amount, currency);
    
    console.log(`📧 Would send approval email for ${requestType} of ${currency} ${amount}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
    return false;
  }
}

/**
 * Send deposit/withdrawal rejection email
 */
export async function sendRejectionEmail(
  userId: number,
  requestType: 'deposit' | 'withdrawal',
  amount: number,
  currency: string = 'USD',
  rejectionReason: string
): Promise<boolean> {
  try {
    // TODO: Get user email from database using userId
    const transporter = createEmailTransporter();
    const { subject, html } = getRejectionEmailTemplate(requestType, amount, currency, rejectionReason);
    
    console.log(`📧 Would send rejection email for ${requestType} of ${currency} ${amount}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
    return false;
  }
}
