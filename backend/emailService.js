import sgMail from '@sendgrid/mail';

// ═══════════════════════════════════════════════════════════════
// EMAIL SERVICE - SendGrid Only
// ═══════════════════════════════════════════════════════════════
// Handles: Registration OTP, Password Recovery, Support Inquiries
// Local development only

let sendgridEnabled = false;
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
 * Initialize SendGrid service
 */
function initializeServices() {
  sendgridEnabled = false;

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  console.log('[EMAIL_INIT] Starting email service initialization...');
  console.log(`[EMAIL_INIT] API Key present: ${apiKey ? '✅ YES (length: ' + apiKey.length + ')' : '❌ NO'}`);
  console.log(`[EMAIL_INIT] From Email: ${fromEmail || 'NOT SET'}`);

  if (apiKey) {
    sgMail.setApiKey(apiKey);
    sendgridEnabled = true;
    console.log('[EMAIL] ✅ SendGrid ENABLED and ready');
    console.log(`[EMAIL] Sender: ${fromEmail}`);
  } else {
    console.warn('[EMAIL] ⚠️  CRITICAL: SendGrid API key not found in environment variables!');
    console.warn('[EMAIL] Using console logging fallback only.');
  }
}

// NOTE: initializeServices() is called from index.js AFTER dotenv.config() runs
// This ensures environment variables are loaded before initializing SendGrid

/**
 * Send email via SendGrid API
 */
async function sendViaSendGrid(to, subject, html) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'dbose272@gmail.com',
    replyTo: process.env.SENDGRID_REPLY_EMAIL || 'dbose272@gmail.com',
    subject,
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${html}</body></html>`,
  };

  console.log(`[EMAIL_SEND] Attempting to send email:`);
  console.log(`  - To: ${to}`);
  console.log(`  - From: ${msg.from}`);
  console.log(`  - Subject: ${subject}`);

  try {
    const response = await sgMail.send(msg);
    console.log(`[✅ EMAIL_SENT] Successfully sent! Response headers:`, response[0]?.headers?.['x-message-id']);
    return { success: true, provider: 'sendgrid', messageId: response[0]?.headers?.['x-message-id'] };
  } catch (error) {
    console.error(`[❌ EMAIL_FAILED]`);
    console.error(`  Error Code: ${error.code}`);
    console.error(`  Error Message: ${error.message}`);
    console.error(`  Full Error:`, JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Send registration/verification OTP email
 */
export async function sendRegistrationOTP(email, name, otp) {
  const htmlContent = `
    <div style="font-family: 'Cambria', Georgia, serif, 'Comic Sans MS', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fafafa; border-radius: 40px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 48px; margin-bottom: 16px; font-family: Arial, sans-serif;">✉️</div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.04em; line-height: 1; font-family: 'Comic Sans MS', system-ui, sans-serif;">Confirm your <span style="font-style: italic; color: #2563eb;">Account.</span></h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 32px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f1f5f9;">
        <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; font-family: 'Cambria', Georgia, serif;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; font-family: 'Cambria', Georgia, serif;">Welcome to ClickBazaar! To finish your sign-up, please use the <strong>6-digit verification code</strong> below.</p>
        
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px dashed #2563eb; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #1e40af; font-family: 'Courier New', 'Comic Sans MS', monospace; margin-bottom: 8px;">${otp}</div>
          <p style="font-size: 10px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-family: 'Comic Sans MS';">Your Verification Code</p>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; font-style: italic; font-family: 'Cambria', Georgia, serif;">This code will <strong>expire in 10 minutes</strong> for your safety.</p>
      </div>
      
      <div style="margin-top: 32px; text-align: center;">
        <p style="font-size: 11px; color: #cbd5e1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; font-family: 'Comic Sans MS';">&copy; 2026 ClickBazaar Global Team</p>
      </div>
    </div>
  `;

  if (!sendgridEnabled) {
    console.warn(`[FALLBACK] Registration OTP for ${email}: ${otp}`);
    logOTP(email, otp);
    return { success: true, simulated: true };
  }

  try {
    return await sendViaSendGrid(email, 'Confirm Your ClickBazaar Account', htmlContent);
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
          .main-heading { font-size: 24px !important; }
          .content-box { padding: 24px !important; }
          .otp-code { font-size: 36px !important; letter-spacing: 8px !important; }
          .warning-text { font-size: 13px !important; text-align: left !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fafafa;">
    <div class="email-container" style="font-family: 'Cambria', Georgia, serif, 'Comic Sans MS', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fafafa; border-radius: 40px; border: 1px solid #fecaca;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 48px; margin-bottom: 16px; font-family: Arial, sans-serif;">🔐</div>
        <h1 class="main-heading" style="margin: 0; font-size: 28px; font-weight: 900; color: #9f1239; letter-spacing: -0.04em; line-height: 1; font-family: 'Comic Sans MS', system-ui, sans-serif;">Secure <span style="font-style: italic; color: #ef4444;">Recovery.</span></h1>
      </div>
      
      <div class="content-box" style="padding: 32px; background-color: #fff1f2; border-radius: 24px; border: 1px solid #ffe4e6; box-shadow: 0 4px 6px -1px rgba(159, 18, 57, 0.05);">
        <h2 style="font-size: 18px; font-weight: 800; color: #9f1239; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Comic Sans MS', system-ui, sans-serif;">🔐 Reset your password</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #be123c; margin-bottom: 24px; font-family: 'Cambria', Georgia, serif;">We received a request to reset your password. Please use the <strong>recovery code</strong> below to set a new one.</p>
        
        <div style="background-color: #ffffff; border: 2px solid #f43f5e; border-radius: 16px; padding: 32px 24px; text-align: center; margin-bottom: 24px; width: 100%; max-width: 320px; margin-left: auto; margin-right: auto; box-sizing: border-box;">
          <div class="otp-code" style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #9f1239; font-family: 'Courier New', 'Comic Sans MS', monospace; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otp}</div>
          <p style="font-size: 10px; font-weight: 800; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-family: 'Comic Sans MS';">Recovery Code</p>
        </div>
        
        <p class="warning-text" style="font-size: 12px; color: #dc2626; text-align: center; font-style: italic; font-weight: 700; font-family: 'Comic Sans MS';">⚠️ If you didn't ask for this, you can safely ignore this email.</p>
      </div>
      
      <div style="margin-top: 32px; text-align: center;">
        <p style="font-size: 11px; color: #fda4af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; font-family: 'Comic Sans MS';">&copy; 2026 ClickBazaar Support Team</p>
      </div>
    </div>
    </body>
    </html>
  `;

  if (!sendgridEnabled) {
    console.warn(`[FALLBACK] Password recovery OTP for ${email}: ${otp}`);
    logOTP(email, otp);
    return { success: true, simulated: true };
  }

  try {
    return await sendViaSendGrid(email, 'ClickBazaar Account Recovery', htmlContent);
  } catch (error) {
    console.error('[RECOVERY_ERROR] Failed to send password recovery OTP:', error);
    logOTP(email, otp);
    return { success: true, simulated: true };
  }
}

/**
 * Send support inquiry notification to admin
 */
export async function sendSupportInquiry(name, email, message) {
  const htmlContent = `
    <div style="font-family: 'Cambria', Georgia, serif, 'Comic Sans MS', system-ui, sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);">
        <div style="margin-bottom: 32px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px; font-family: Arial, sans-serif;">📞</div>
          <h1 style="margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; font-family: 'Comic Sans MS', system-ui, sans-serif;">Click<span style="color: #3b82f6;">Bazaar</span></h1>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-align: center; font-family: 'Comic Sans MS', system-ui, sans-serif;">📞 New Support Inquiry</h2>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 32px; text-align: center; font-family: 'Cambria', Georgia, serif;">You have received a new message through the ClickBazaar support form.</p>
        
        <div style="margin-bottom: 24px; padding: 20px; background-color: #f1f5f9; border-radius: 16px;">
          <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-family: 'Comic Sans MS', system-ui, sans-serif;">📧 From</p>
          <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; font-family: 'Cambria', Georgia, serif;">${name} <span style="font-weight: 400; color: #64748b; font-size: 14px;">(${email})</span></p>
        </div>
        
        <div style="padding: 24px; border-left: 4px solid #3b82f6; background-color: #eff6ff; border-radius: 0 16px 16px 0;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; font-family: 'Comic Sans MS', system-ui, sans-serif;">💬 Message</p>
          <p style="margin: 0; font-size: 15px; font-weight: 500; line-height: 1.6; color: #334155; white-space: pre-wrap; font-family: 'Cambria', Georgia, serif;">${message}</p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-family: 'Comic Sans MS';">ClickBazaar © 2026</p>
        </div>
      </div>
    </div>
  `;

  const adminEmail = process.env.ADMIN_EMAIL || 'support@clickbazaar.com';

  if (!sendgridEnabled) {
    console.warn(`[FALLBACK] Support inquiry from ${name} (${email}): ${message}`);
    return { success: true, simulated: true };
  }

  try {
    return await sendViaSendGrid(adminEmail, `[SUPPORT] New Message from ${name}`, htmlContent);
  } catch (error) {
    console.error('[SUPPORT_ERROR] Failed to send support inquiry:', error);
    return { success: true, simulated: true };
  }
}

/**
 * Get simulated OTP from log (for development/testing)
 */
export function getSimulatedOTP(email) {
  return otpLogs.find(log => log.email.toLowerCase() === email.toLowerCase())?.otp;
}

/**
 * Get email service status (for debugging)
 */
export function getEmailServiceStatus() {
  return {
    service: sendgridEnabled ? '✅ SendGrid Enabled' : '❌ SendGrid Disabled',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@clickbazaar.com',
    adminEmail: process.env.ADMIN_EMAIL || 'support@clickbazaar.com',
  };
}

/**
 * Initialize/reinitialize email service (called after dotenv.config())
 */
export function initEmailService() {
  initializeServices();
}
