import { Resend } from "resend";
import { getBaseUrl } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface ApplicationLinkEmailData {
  applicantEmail: string;
  token: string;
  recruiterName: string;
  expiresAt: Date;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: from || process.env.FROM_EMAIL || "TalentCore <noreply@talentcore.com>",
      to: [to],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

export async function sendApplicationLinkEmail({
  applicantEmail,
  token,
  recruiterName,
  expiresAt,
}: ApplicationLinkEmailData) {
  const baseUrl = getBaseUrl();
  const applicationUrl = `${baseUrl}/apply/${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Employment Application Invitation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1e40af;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #1e40af;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .info-box {
          background-color: #e0f2fe;
          border-left: 4px solid #0284c7;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎯 Employment Application Invitation</h1>
        <p>TalentCore Staffing Solutions</p>
      </div>
      
      <div class="content">
        <h2>Hello!</h2>
        
        <p>You've been invited by <strong>${recruiterName}</strong> to submit an employment application through our secure portal.</p>
        
        <div class="info-box">
          <h3>📋 What to expect:</h3>
          <ul>
            <li>Complete application form (7 steps)</li>
            <li>Upload required documents</li>
            <li>Complete a brief aptitude assessment</li>
            <li>Estimated completion time: 15-20 minutes</li>
          </ul>
        </div>
        
        <p>Click the button below to begin your application:</p>
        
        <div style="text-align: center;">
          <a href="${applicationUrl}" class="button">Start Application</a>
        </div>
        
        <div class="info-box">
          <h3>⚠️ Important Information:</h3>
          <ul>
            <li><strong>This link expires on:</strong> ${expiresAt.toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</li>
            <li><strong>Single use only:</strong> This link can only be used once</li>
            <li><strong>Secure:</strong> Your information is protected and encrypted</li>
          </ul>
        </div>
        
        <h3>📄 Documents to have ready:</h3>
        <ul>
          <li>Current resume</li>
          <li>Government-issued ID</li>
          <li>Work permit (if applicable)</li>
          <li>Any relevant certifications</li>
        </ul>
        
        <p>If you have any questions or need assistance, please contact our recruitment team.</p>
        
        <p>Best regards,<br>
        <strong>TalentCore Staffing Solutions</strong></p>
      </div>
      
      <div class="footer">
        <p>This is an automated email. Please do not reply directly to this message.</p>
        <p>If you did not expect this invitation, please ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} TalentCore Staffing Solutions. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: applicantEmail,
    subject: "Employment Application Invitation - TalentCore Staffing",
    html,
  });
}

export async function sendApplicationConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  applicationId: string
) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #16a34a;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .success-box {
          background-color: #dcfce7;
          border-left: 4px solid #16a34a;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Application Received</h1>
        <p>TalentCore Staffing Solutions</p>
      </div>
      
      <div class="content">
        <h2>Thank you, ${applicantName}!</h2>
        
        <div class="success-box">
          <h3>🎉 Your application has been successfully submitted!</h3>
          <p><strong>Application ID:</strong> ${applicationId}</p>
          <p><strong>Submitted on:</strong> ${new Date().toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</p>
        </div>
        
        <h3>📋 What happens next?</h3>
        <ol>
          <li>Our recruitment team will review your application</li>
          <li>We'll contact you within 3-5 business days</li>
          <li>If selected, we'll schedule an interview</li>
          <li>Background checks and reference verification</li>
          <li>Job placement and onboarding</li>
        </ol>
        
        <h3>📞 Contact Information</h3>
        <p>If you have any questions about your application status, please contact us:</p>
        <ul>
          <li>Email: recruitment@talentcore.com</li>
          <li>Phone: (555) 123-4567</li>
          <li>Office Hours: Monday-Friday, 8:00 AM - 6:00 PM</li>
        </ul>
        
        <p>Thank you for choosing TalentCore Staffing Solutions for your employment needs!</p>
        
        <p>Best regards,<br>
        <strong>TalentCore Recruitment Team</strong></p>
      </div>
      
      <div class="footer">
        <p>This is an automated confirmation email.</p>
        <p>&copy; ${new Date().getFullYear()} TalentCore Staffing Solutions. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: applicantEmail,
    subject: "Application Confirmation - TalentCore Staffing",
    html,
  });
}

// Template for sending application status updates
export async function sendApplicationStatusEmail(
  applicantEmail: string,
  applicantName: string,
  status: string,
  message?: string
) {
  const statusColors = {
    approved: { bg: '#dcfce7', border: '#16a34a', emoji: '✅' },
    rejected: { bg: '#fee2e2', border: '#dc2626', emoji: '❌' },
    reviewing: { bg: '#fef3c7', border: '#f59e0b', emoji: '🔍' },
  };

  const statusConfig = statusColors[status as keyof typeof statusColors] || statusColors.reviewing;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Status Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1e40af;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .status-box {
          background-color: ${statusConfig.bg};
          border-left: 4px solid ${statusConfig.border};
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${statusConfig.emoji} Application Status Update</h1>
        <p>TalentCore Staffing Solutions</p>
      </div>
      
      <div class="content">
        <h2>Hello ${applicantName},</h2>
        
        <div class="status-box">
          <h3>Application Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</h3>
          ${message ? `<p>${message}</p>` : ''}
        </div>
        
        <p>If you have any questions, please don't hesitate to contact our recruitment team.</p>
        
        <p>Best regards,<br>
        <strong>TalentCore Recruitment Team</strong></p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TalentCore Staffing Solutions. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: applicantEmail,
    subject: `Application Status Update - TalentCore Staffing`,
    html,
  });
}