import nodemailer from 'nodemailer';

// ═══════════════════════════════════════════════════════════════
// EMAIL SERVICE - Gmail SMTP
// ═══════════════════════════════════════════════════════════════
// Handles: Registration OTP, Password Recovery, Support Inquiries
// Uses Gmail SMTP for reliable email delivery

let transporter = null;
let otpLogs = [];

/**
 * Log OTP for fallback use (when tracking OTP in console)
 */
const logOTP = (email, otp) => {
  otpLogs.push({ email, otp, timestamp: new Date().toISOString() });
  if (otpLogs.length > 100) otpLogs.shift();
  console.warn(`[EMAIL_FALLBACK] OTP for ${email}: ${otp}`);
};

/**
 * Initialize SMTP service with Gmail
 */
function initializeServices() {
  const email = process.env.EMAIL_USER || 'dbose272@gmail.com';
  const password = process.env.EMAIL_PASSWORD || 'your-app-password';

  console.log('[EMAIL_INIT] Starting SMTP email service initialization...');
  console.log(`[EMAIL_INIT] Email: ${email}`);
  console.log(`[EMAIL_INIT] Password: ${password ? '✅ SET' : '❌ NOT SET'}`);

  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: email,
        pass: password,
      },
    });

    console.log('[EMAIL] ✅ SMTP ENABLED and ready');
    console.log(`[EMAIL] Sender: ${email}`);
  } catch (err) {
    console.error('[EMAIL] ❌ SMTP initialization failed:', err.message);
    transporter = null;
  }
}

/**
 * Send email via Gmail SMTP
 */
async function sendViaSMTP(to, subject, html) {
  if (!transporter) {
    console.warn('[EMAIL_SEND] ⚠️  SMTP not configured, using console fallback');
    console.log(`[EMAIL_FALLBACK] Would send email to: ${to}`);
    console.log(`[EMAIL_FALLBACK] Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  const msg = {
    from: `ClickBazaar <${process.env.EMAIL_USER || 'dbose272@gmail.com'}>`,
    to,
    replyTo: process.env.REPLY_EMAIL || process.env.EMAIL_USER || 'dbose272@gmail.com',
    subject,
    html,
  };

  console.log(`[EMAIL_SEND] Attempting to send email:
  - To: ${to}
  - From: ${msg.from}
  - Subject: ${subject}`);

  try {
    const info = await transporter.sendMail(msg);
    console.log('[✅ EMAIL_SENT]');
    console.log(`  Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[❌ EMAIL_FAILED]');
    console.error(`  Error: ${error.message}`);
    logOTP(to, 'RETRY'); // Log for manual follow-up
    return { success: false, error: error.message };
  }
}

/**
 * Send registration OTP email
 */
export async function sendRegistrationOTP(email, name, otp) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media (max-width: 640px) {
          .email-container { padding: 20px !important; }
          .logo-box { padding: 8px !important; font-size: 16px !important; }
          .main-heading { font-size: 24px !important; }
          .content-box { padding: 20px !important; }
          .otp-box { padding: 24px !important; }
          .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <div class="email-container" style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="logo-box" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 12px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);">
            <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">CB</span>
          </div>
          <h1 class="main-heading" style="margin: 0; font-size: 28px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.02em; line-height: 1.2;">Welcome to <span style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ClickBazaar</span></h1>
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #64748b;">Verify your account in seconds</p>
        </div>
        
        <div class="content-box" style="background-color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <p style="font-size: 15px; line-height: 1.8; color: #334155; margin: 0 0 24px 0;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.8; color: #475569; margin: 0 0 24px 0;">Thank you for signing up! To complete your registration, please verify your email address using the code below.</p>
          
          <div class="otp-box" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #2563eb; border-radius: 12px; padding: 32px 24px; text-align: center; margin: 32px 0; width: 100%; max-width: 320px; margin-left: auto; margin-right: auto; box-sizing: border-box;">
            <img src="https://cdn-icons-png.flaticon.com/128/542/542689.png" alt="Mail Icon" style="width: 48px; height: 48px; margin: 0 auto 12px; display: block; text-align: center;" />
            <p style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Your Verification Code</p>
            <div class="otp-code" style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #1e40af; font-family: 'Courier New', Courier, monospace; margin: 0; word-spacing: 8px;">${otp}</div>
          </div>
          
          <div class="icon-text-container" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
            <img src="https://cdn-icons-png.flaticon.com/128/6834/6834351.png" alt="Timer Icon" style="width: 24px; height: 24px; margin: 0 auto 8px; display: block;" />
            <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.6;"><strong>EXPIRES IN 10 MINUTES.</strong> Please use this code soon.</p>
          </div>
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">If you didn't create this account, please ignore this email or contact support immediately.</p>
        </div>
        
        <div style="margin-top: 32px; text-align: center;">
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">&copy; 2026 ClickBazaar. All rights reserved.</p>
          <p style="font-size: 10px; color: #cbd5e1; margin: 8px 0 0 0;">Built for seamless shopping</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    return await sendViaSMTP(email, 'Confirm Your ClickBazaar Account', htmlContent);
  } catch (error) {
    console.error('[OTP_ERROR] Failed to send registration OTP:', error);
    logOTP(email, otp);
    return { success: true, simulated: true };
  }
}

/**
 * Send password recovery/reset OTP email
 */
export async function sendPasswordRecoveryOTP(email, otp) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media (max-width: 640px) {
          .email-container { padding: 20px !important; }
          .logo-box { padding: 8px !important; font-size: 16px !important; }
          .main-heading { font-size: 24px !important; }
          .content-box { padding: 20px !important; }
          .otp-box { padding: 24px 20px !important; min-width: 240px !important; max-width: 280px !important; }
          .otp-code { font-size: 32px !important; letter-spacing: 8px !important; word-spacing: 4px !important; }
          .icon-text-container { gap: 12px !important; padding: 16px !important; text-align: center !important; }
          .warning-icon { width: 24px !important; height: 24px !important; margin: 0 auto 8px !important; display: block !important; }
          .warning-text { font-size: 13px !important; line-height: 1.5 !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <div class="email-container" style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 20px; border: 1px solid #fecaca; box-shadow: 0 10px 40px rgba(225, 29, 72, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="logo-box" style="display: inline-block; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 12px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);">
            <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">CB</span>
          </div>
          <h1 class="main-heading" style="margin: 0; font-size: 28px; font-weight: 900; color: #9f1239; letter-spacing: -0.02em; line-height: 1.2;">Password <span style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Reset</span></h1>
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #64748b;">Recover your account securely</p>
        </div>
        
        <div class="content-box" style="background-color: #fff1f2; padding: 32px; border-radius: 16px; border: 1px solid #ffe4e6;">
          <p style="font-size: 15px; line-height: 1.8; color: #9f1239; margin: 0 0 24px 0;">We received a request to reset your password.</p>
          <p style="font-size: 15px; line-height: 1.8; color: #be123c; margin: 0 0 24px 0;">Use the code below to create a new password. This code will expire in <strong>10 minutes</strong>.</p>
          
          <div class="otp-box" style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border: 2px solid #f43f5e; border-radius: 12px; padding: 32px 24px; text-align: center; margin: 32px 0; width: 100%; max-width: 320px; margin-left: auto; margin-right: auto; box-sizing: border-box;">
            <img src="https://cdn-icons-png.flaticon.com/128/11258/11258495.png" alt="Lock and Key Icon" style="width: 48px; height: 48px; margin: 0 auto 12px; display: block;" />
            <p style="font-size: 12px; font-weight: 800; color: #9f1239; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Recovery Code</p>
            <div class="otp-code" style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #9f1239; font-family: 'Courier New', Courier, monospace; margin: 0; word-spacing: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otp}</div>
          </div>
          
          <div class="icon-text-container" style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
            <img class="warning-icon" src="https://cdn-icons-png.flaticon.com/128/181/181534.png" alt="Lock Icon" style="width: 24px; height: 24px; margin: 0 auto 8px; display: block;" />
            <p class="warning-text" style="font-size: 12px; color: #7f1d1d; margin: 0; line-height: 1.6;"><strong>KEEP THIS CODE PRIVATE.</strong> Never share it with anyone.</p>
          </div>
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
        </div>
        
        <div style="margin-top: 32px; text-align: center;">
          <hr style="border: none; border-top: 1px solid #fecaca; margin: 24px 0;">
          <p style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">&copy; 2026 ClickBazaar. All rights reserved.</p>
          <p style="font-size: 10px; color: #cbd5e1; margin: 8px 0 0 0;">Your security is our priority</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    return await sendViaSMTP(email, 'Password Recovery Code', htmlContent);
  } catch (error) {
    console.error('[OTP_ERROR] Failed to send password recovery OTP:', error);
    logOTP(email, otp);
    return { success: true, simulated: true };
  }
}

/**
 * Send support inquiry notification
 */
export async function sendSupportInquiry(name, email, message) {
  const adminEmail = process.env.EMAIL_USER || 'dbose272@gmail.com';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media (max-width: 640px) {
          .email-container { padding: 20px !important; }
          .logo-box { padding: 8px !important; font-size: 16px !important; }
          .main-heading { font-size: 24px !important; }
          .content-box { padding: 20px !important; }
          .user-info { flex-direction: column !important; }
          .info-item { width: 100% !important; margin-bottom: 16px !important; gap: 16px !important; padding: 20px !important; }
          .icon-text-container { gap: 16px !important; padding: 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <div class="email-container" style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 20px; border: 1px solid #d1fae5; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="logo-box" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 12px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
            <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">CB</span>
          </div>
          <h1 class="main-heading" style="margin: 0; font-size: 28px; font-weight: 900; color: #047857; letter-spacing: -0.02em; line-height: 1.2;">New Support <span style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Inquiry</span></h1>
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #64748b;">Customer assistance request received</p>
        </div>
        
        <div class="user-info" style="display: flex; gap: 32px; margin-bottom: 32px;">
          <div class="info-item" style="flex: 1; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #dcfce7; display: flex; align-items: flex-start; gap: 16px;">
            <svg style="width: 24px; height: 24px; margin-top: 4px; flex-shrink: 0; fill: #15803d;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M224 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64zm-45.7 48C161.6 304 0 404.3 0 544c0 46.1 14.6 89.3 39.6 125.2c11.5 15.3 29.4 25 49.9 25h246c20.5 0 38.4-9.7 49.9-25C429.4 633.3 544 533 544 400c0-11.7-7-21.7-17-27c-10.3-5.5-23-5.5-33 0c-15 8-34 8-49 0s-34-8-49 0c-15 8-34 8-49 0c-10-5.5-22.7-5.5-33 0C271 378.3 264 388.3 264 400c0 36.6-14.6 69.8-38.4 93.6c-9.2 9.2-24.2 9.2-33.4 0C177.6 469.8 160 437.2 160 400c0-57 42.3-104.5 97.4-112.5c-3.3-7.4-5.4-15.4-5.4-23.9c0-35.3 28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64c0 .1 0 .1 0 .2c0 .1 0 .1 0 .2h0c0 35.3-28.7 64-64 64s-64-28.7-64-64z"/></svg>
            <div>
              <p style="font-size: 11px; color: #15803d; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">FROM</p>
              <p style="font-size: 14px; color: #166534; font-weight: 700; margin: 0 0 4px 0;">${name}</p>
              <p style="font-size: 13px; color: #4b7c0f; margin: 0;"><a href="mailto:${email}" style="color: #059669; text-decoration: none; font-weight: 600;">${email}</a></p>
            </div>
          </div>
          <div class="info-item" style="flex: 1; background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 1px solid #dbeafe; display: flex; align-items: flex-start; gap: 16px;">
            <div style="flex-shrink: 0;">
              <svg style="width: 24px; height: 24px; fill: #0c4a6e; margin-bottom: 8px; margin-top: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 32C60.7 32 32 60.7 32 96V416c0 35.3 28.7 64 64 64H320v64H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320v-64H544c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H96zm0 64H544V416H96V96z"/></svg>
              <svg style="width: 24px; height: 24px; fill: #0c4a6e;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M224 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64zm92.7 57.6c26.9-13.3 56.1-20.6 87.3-20.6s60.4 7.3 87.3 20.6c24.9 12.3 40.8 27.2 48.9 40.5V160c0-8.8-7.2-16-16-16H192c-8.8 0-16 7.2-16 16v193.6c8.1-13.2 24-28.2 48.9-40.5zM352 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>
            </div>
            <div>
              <p style="font-size: 11px; color: #0c4a6e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">DATE & TIME</p>
              <p style="font-size: 14px; color: #0c4a6e; font-weight: 700; margin: 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              <p style="font-size: 13px; color: #075985; margin: 0;">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
          </div>
        </div>
        
        <div class="content-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 24px; border-radius: 16px; border: 2px solid #10b981; margin-bottom: 24px;">
          <div class="icon-text-container" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <svg style="width: 20px; height: 20px; fill: #166534; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"/></svg>
            <p style="font-size: 11px; color: #166534; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">CUSTOMER MESSAGE</p>
          </div>
          <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981;">
            <p style="font-size: 14px; line-height: 1.8; color: #166534; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        
        <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #0c4a6e; margin: 0; line-height: 1.6;"><strong>QUICK REPLY:</strong> Reply directly to this email to respond to the customer instantly.</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px;">
          <div class="icon-text-container" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <svg style="width: 20px; height: 20px; fill: #374151; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>
            <p style="font-size: 12px; color: #374151; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">RECOMMENDED ACTIONS</p>
          </div>
          <p style="font-size: 12px; color: #374151; margin: 0; line-height: 1.8;">
            <svg style="width: 14px; height: 14px; fill: #16a34a; display: inline-block; margin-right: 10px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>Review the customer message<br>
            <svg style="width: 14px; height: 14px; fill: #16a34a; display: inline-block; margin-right: 10px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>Check customer account history<br>
            <svg style="width: 14px; height: 14px; fill: #16a34a; display: inline-block; margin-right: 10px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>Respond within 24 hours<br>
            <svg style="width: 14px; height: 14px; fill: #16a34a; display: inline-block; margin-right: 10px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>Ensure issue resolution
          </p>
        </div>
        
        <div style="margin-top: 32px; text-align: center;">
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">&copy; 2026 ClickBazaar Support System</p>
          <p style="font-size: 10px; color: #cbd5e1; margin: 8px 0 0 0;">Customer satisfaction is our priority</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const msg = {
      from: `"${name}" <${adminEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Support Inquiry: ${name}`,
      html: htmlContent,
    };

    if (transporter) {
      await transporter.sendMail(msg);
      return { success: true };
    } else {
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error('[SUPPORT_ERROR] Failed to send support inquiry:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get simulated OTP (for development/fallback)
 */
export function getSimulatedOTP(email) {
  return otpLogs.find(log => log.email === email)?.otp || 'Check console logs';
}

/**
 * Get email service status
 */
export function getEmailServiceStatus() {
  return {
    enabled: !!transporter,
    type: 'SMTP',
    configured: !!transporter,
    email: process.env.EMAIL_USER || 'Not configured',
  };
}

/**
 * Initialize email service (called from index.js)
 */
export function initEmailService() {
  initializeServices();
}
