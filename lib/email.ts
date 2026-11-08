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
    tls: {
      rejectUnauthorized: false,
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

export interface PaymentSuccessEmailParams {
  to: string;
  brideName: string;
  groomName: string;
  templateName?: string;
  liveUrl: string;
  dashboardUrl?: string;
  amountInr?: number;
  paymentId?: string;
  orderId?: string;
}

export function renderPaymentSuccessHtml({
  to,
  brideName,
  groomName,
  templateName = "Royal Wedding Invitation",
  liveUrl,
  dashboardUrl,
  amountInr = 1499,
  paymentId,
  orderId,
}: PaymentSuccessEmailParams) {
  const fullLiveUrl = liveUrl.startsWith("http")
    ? liveUrl
    : `${siteConfig.url}${liveUrl.startsWith("/") ? liveUrl : `/${liveUrl}`}`;
  const fullDashboardUrl = dashboardUrl
    ? (dashboardUrl.startsWith("http") ? dashboardUrl : `${siteConfig.url}${dashboardUrl.startsWith("/") ? dashboardUrl : `/${dashboardUrl}`}`)
    : `${siteConfig.url}/dashboard`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Royal Wedding Invitation is Live</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF9F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FCFBF7; border: 1px solid rgba(200, 164, 94, 0.35); border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(7, 61, 49, 0.08);">
          
          <!-- Header: Deep Royal Emerald with Gold Foil Accent -->
          <tr>
            <td style="background-color: #073D31; padding: 36px 32px; text-align: center; border-bottom: 3px solid #C8A45E;">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: rgba(200, 164, 94, 0.15); border: 1px solid rgba(200, 164, 94, 0.4); margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #E1C98E;">
                  ✨ Official Activation &bull; WedInvites.in
                </span>
              </div>
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 500; color: #FAF8F2; letter-spacing: 0.02em; line-height: 1.3;">
                Your Royal Wedding Website is Live!
              </h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #B3CFC8; letter-spacing: 0.04em;">
                ${templateName} &bull; Official Keepsake Invitation
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              
              <!-- Couple Salutation -->
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: #18211E;">
                Dearest ${brideName} &amp; ${groomName},
              </h2>

              <!-- Heartfelt Wedding Blessing -->
              <div style="background-color: #F8F5EE; border-left: 3px solid #C8A45E; border-radius: 0 12px 12px 0; padding: 18px 20px; margin-bottom: 28px;">
                <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 15px; line-height: 1.65; color: #4A4438;">
                  &ldquo;May your union be blessed with eternal harmony, profound love, and joy that grows deeper with every passing sunrise. It is our greatest honor to present the royal digital portal to your once-in-a-lifetime celebration.&rdquo;
                </p>
              </div>

              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4E5954;">
                Your custom interactive wedding invitation is now officially activated, permanent, and open to guests worldwide. The preview watermark and demo timer have been completely removed.
              </p>

              <!-- Live Link Showcase Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(7, 61, 49, 0.04) 0%, rgba(200, 164, 94, 0.12) 100%); border: 1.5px solid rgba(200, 164, 94, 0.45); border-radius: 16px; padding: 24px; margin-bottom: 28px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #8B6914; margin-bottom: 6px;">
                      Your Official Shareable Link
                    </div>
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; color: #073D31; margin-bottom: 16px; word-break: break-all;">
                      ${fullLiveUrl}
                    </div>

                    <!-- Primary Action Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 12px;">
                      <tr>
                        <td align="center" style="border-radius: 9999px; background: linear-gradient(135deg, #073D31 0%, #032A23 100%); box-shadow: 0 6px 20px rgba(7, 61, 49, 0.3);">
                          <a href="${fullLiveUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 13px; font-weight: 700; color: #FAF8F2; text-decoration: none; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                            ✨ Open Live Invitation
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size: 11px; color: #76766F;">
                      Ready to share directly on WhatsApp, Instagram bio, or wedding cards.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- What is Now Active Checklist -->
              <h3 style="margin: 0 0 14px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #18211E;">
                Everything Unlocked for Your Wedding:
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; font-size: 13px; color: #3F4743; line-height: 1.6;">
                <tr>
                  <td style="padding: 6px 0; vertical-align: top; width: 24px;">💌</td>
                  <td style="padding: 6px 0;"><strong>Live Guest RSVP Portal</strong> &mdash; Collect attendance, guest counts, and personal blessings in real time.</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; vertical-align: top; width: 24px;">🎵</td>
                  <td style="padding: 6px 0;"><strong>Royal Audio &amp; Interactive Envelope</strong> &mdash; 3D wax seal opening, orchestral music, and animated ceremonies.</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; vertical-align: top; width: 24px;">✏️</td>
                  <td style="padding: 6px 0;"><strong>Unlimited Edits Anytime</strong> &mdash; Update venue maps, ceremony timings, photos, and itinerary from your dashboard without changing your link.</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; vertical-align: top; width: 24px;">📄</td>
                  <td style="padding: 6px 0;"><strong>Complimentary Printable PDFs</strong> &mdash; Two matching gold-styled printable stationery PDFs are ready in your dashboard.</td>
                </tr>
              </table>

              <!-- Manage In Dashboard CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F6F5EE; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 600; color: #18211E; margin-bottom: 4px;">
                      Track RSVPs &amp; Update Details
                    </div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 12px;">
                      Log in to your dashboard anytime using your email (<strong>${to}</strong>).
                    </div>
                    <a href="${fullDashboardUrl}" target="_blank" style="display: inline-block; padding: 9px 20px; font-size: 12px; font-weight: 700; color: #073D31; background-color: #FFFFFF; border: 1px solid rgba(7, 61, 49, 0.2); border-radius: 9999px; text-decoration: none;">
                      Go to Couple Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Payment Receipt Breakdown -->
              <h3 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #76766F;">
                Payment Receipt Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #EAE7DD; border-radius: 10px; padding: 14px 18px; margin-bottom: 28px; font-size: 12px; color: #555;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Amount Paid:</strong></td>
                  <td align="right" style="padding: 4px 0; font-weight: 700; color: #073D31; font-size: 13px;">₹${amountInr.toLocaleString("en-IN")}</td>
                </tr>
                ${paymentId ? `
                <tr>
                  <td style="padding: 4px 0;"><strong>Razorpay Payment ID:</strong></td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; color: #222;">${paymentId}</td>
                </tr>` : ""}
                ${orderId ? `
                <tr>
                  <td style="padding: 4px 0;"><strong>Order Reference:</strong></td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; color: #666;">${orderId}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 4px 0;"><strong>Website Status:</strong></td>
                  <td align="right" style="padding: 4px 0; font-weight: 700; color: #059669;">Verified &bull; Permanent Live</td>
                </tr>
              </table>

              <!-- Warm Sign-off -->
              <p style="margin: 0 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; color: #18211E;">
                With warmest blessings &amp; royal regards,
              </p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 700; color: #073D31;">
                The WedInvites Team
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F4F1E8; padding: 24px 32px; text-align: center; border-top: 1px solid #EAE5D8; font-size: 11px; color: #76766F; line-height: 1.6;">
              <p style="margin: 0 0 6px;">
                Need help or custom changes? Reply directly to this email or WhatsApp us at <strong>${siteConfig.phone}</strong>
              </p>
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved. &bull; <a href="${siteConfig.url}" style="color: #073D31; text-decoration: underline;">${siteConfig.domain}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPaymentSuccessEmail(params: PaymentSuccessEmailParams) {
  const subject = `✨ Congratulations ${params.brideName} & ${params.groomName}! Your Royal Wedding Invitation is Live`;
  const html = renderPaymentSuccessHtml(params);

  return sendEmail({
    to: params.to,
    subject,
    html,
  });
}
