import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.warn("SMTP configuration is incomplete. Emails will be logged to console instead.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || siteConfig.email.support;

  const emailPayload = {
    from: `"${siteConfig.name}" <${from}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""), // simple fallback text
  };

  if (!transporter) {
    console.log("=== Dry Run Send Email ===");
    console.log(JSON.stringify(emailPayload, null, 2));
    return { messageId: "mock-message-id" };
  }

  try {
    const info = await transporter.sendMail(emailPayload);
    return info;
  } catch (error) {
    console.error("Failed to send email via SMTP transporter:", error);
    throw error;
  }
}

/**
 * Custom NextAuth.js Verification Request Handler
 */
export async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: { from: string };
}) {
  const subject = `Sign in to ${siteConfig.name}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111; background-color: #faf9f6;">
      <h2 style="font-size: 24px; font-weight: 600; letter-spacing: -0.02em; color: #082F27; margin-bottom: 24px;">${siteConfig.shortName}</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 32px;">Click the button below to sign in to your dashboard. This login link will expire in 24 hours.</p>
      
      <a href="${url}" target="_blank" style="display: inline-block; background-color: #082F27; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 14px; font-weight: 500; margin-bottom: 32px;">
        Sign In to ${siteConfig.name}
      </a>
      
      <p style="font-size: 14px; color: #666; line-height: 1.5;">If the button above does not work, copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; color: #666; word-break: break-all; margin-bottom: 32px;">${url}</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 24px;" />
      <p style="font-size: 12px; color: #999;">If you did not request this email, you can safely ignore it.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
}
