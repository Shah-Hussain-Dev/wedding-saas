import nodemailer from "nodemailer";

async function main() {
  const recipient = process.argv[2] || process.env.SMTP_USER;
  if (!recipient) {
    console.error("Please provide a recipient email address:");
    console.error("Usage: node --env-file=.env scripts/test-smtp.mjs recipient@example.com");
    process.exit(1);
  }

  const rawHost = process.env.SMTP_HOST || "smtp.titan.email";
  const rawPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASSWORD || "").trim();
  const from = process.env.EMAIL_FROM || `WedInvites <${user}>`;

  console.log("--------------------------------------------------");
  console.log(" WedInvites Multi-Host SMTP Diagnostic Tool");
  console.log("--------------------------------------------------");
  console.log(`Current Host:     ${rawHost}`);
  console.log(`Current Port:     ${rawPort}`);
  console.log(`User:             ${user}`);
  console.log(`Password length:  ${pass ? pass.length + " characters" : "(empty)"}`);
  console.log(`From:             ${from}`);
  console.log(`To:               ${recipient}`);
  console.log("--------------------------------------------------");

  if (!user || !pass) {
    console.error("❌ Error: SMTP_USER or SMTP_PASSWORD is not set in .env.");
    process.exit(1);
  }

  // Configurations to test (prioritize GoDaddy SecureServer SSL 465)
  const candidates = [
    { name: "GoDaddy SecureServer (SSL 465)", host: "smtpout.secureserver.net", port: 465, secure: true },
    { name: "GoDaddy SecureServer (STARTTLS 587)", host: "smtpout.secureserver.net", port: 587, secure: false },
    { name: "Titan Email (SSL 465)", host: "smtp.titan.email", port: 465, secure: true },
    { name: "Titan Email (STARTTLS 587)", host: "smtp.titan.email", port: 587, secure: false },
  ];

  let workingTransporter = null;
  let successfulConfig = null;

  for (const config of candidates) {
    process.stdout.write(`Testing ${config.name} (${config.host}:${config.port})... `);
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
      });

      await transporter.verify();
      console.log("✅ CONNECTED & AUTHENTICATED!");
      workingTransporter = transporter;
      successfulConfig = config;
      break;
    } catch (err) {
      console.log(`❌ Failed: ${err.message || err.code}`);
    }
  }

  if (!workingTransporter) {
    console.log("\n--------------------------------------------------");
    console.error("❌ All candidate servers rejected the login.");
    console.log("Common reasons for 'Invalid login: 535':");
    console.log("1. Password typo: Ensure SMTP_PASSWORD is the exact password you typed to log into secureserver.titan.email.");
    console.log("2. Quotes in .env: Ensure SMTP_PASSWORD=\"your_password\" has double quotes around it.");
    console.log("3. Trailing spaces: Make sure there are no spaces before or after the password.");
    console.log("--------------------------------------------------");
    process.exit(1);
  }

  console.log(`\n🎉 SUCCESS! Working configuration:`);
  console.log(`SMTP_HOST="${successfulConfig.host}"`);
  console.log(`SMTP_PORT=${successfulConfig.port}`);
  console.log(`SMTP_USER="${user}"`);
  console.log(`SMTP_PASSWORD="[verified]"`);

  console.log(`\nSending royal test confirmation email to ${recipient}...`);
  try {
    const info = await workingTransporter.sendMail({
      from,
      to: recipient,
      subject: "✨ Congratulations Ananya & Shubham! Your Royal Wedding Invitation is Live",
      html: `<!DOCTYPE html>
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
                Celestial Rose &bull; Official Keepsake Invitation
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              
              <!-- Couple Salutation -->
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: #18211E;">
                Dearest Ananya &amp; Shubham,
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
                      https://wedinvites.in/ananya-shubham
                    </div>

                    <!-- Primary Action Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 12px;">
                      <tr>
                        <td align="center" style="border-radius: 9999px; background: linear-gradient(135deg, #073D31 0%, #032A23 100%); box-shadow: 0 6px 20px rgba(7, 61, 49, 0.3);">
                          <a href="https://wedinvites.in/ananya-shubham" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 13px; font-weight: 700; color: #FAF8F2; text-decoration: none; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
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
                      Log in to your dashboard anytime using your email (<strong>${recipient}</strong>).
                    </div>
                    <a href="https://wedinvites.in/dashboard" target="_blank" style="display: inline-block; padding: 9px 20px; font-size: 12px; font-weight: 700; color: #073D31; background-color: #FFFFFF; border: 1px solid rgba(7, 61, 49, 0.2); border-radius: 9999px; text-decoration: none;">
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
                  <td align="right" style="padding: 4px 0; font-weight: 700; color: #073D31; font-size: 13px;">₹1,499</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Razorpay Payment ID:</strong></td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; color: #222;">pay_live_893kjd910</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Order Reference:</strong></td>
                  <td align="right" style="padding: 4px 0; font-family: monospace; color: #666;">order_live_wedding_776</td>
                </tr>
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
                Need help or custom changes? Reply directly to this email or WhatsApp us at <strong>+91 63949 42159</strong>
              </p>
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} WedInvites. All rights reserved. &bull; <a href="https://wedinvites.in" style="color: #073D31; text-decoration: underline;">wedinvites.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
    console.log("✅ Test email dispatched successfully! Message ID:", info.messageId);
    console.log("Check your inbox (or spam folder) for the verification email!");
  } catch (sendErr) {
    console.error("❌ Failed to send email:", sendErr.message);
  }
}

main();
