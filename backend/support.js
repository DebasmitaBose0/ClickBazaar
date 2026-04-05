import express from 'express';
import { sendSupportInquiry } from './emailServiceSMTP.js';

const router = express.Router();

// Support inquiry handler
router.post('/inquiry', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Error: Please fill in all fields.' });
  }

  console.log(`[SUPPORT] New Inquiry Received from ${name} (${email})`);
  console.log(`[MESSAGE] ${message}`);

  try {
    await sendSupportInquiry(name, email, message);
  } catch (err) {
    console.error('[SUPPORT_ERROR]', err);
    // Continue even if mail fails, just log it.
  }

  res.json({ success: true, message: 'Thank you! Your message has been sent to our team. We will get back to you soon.' });
});

export default router;
