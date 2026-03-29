import nodemailer from 'nodemailer';

export default async ({ req, res, log }) => {
  try {
    const body = JSON.parse(req.body || "{}");
    const { to, subject, text, html } = body;

    if (!to || !subject || (!text && !html)) {
      return res.json({ success: false, error: "Missing required fields" });
    }

    const GMAIL_USER = process.env.GMAIL_MAIL;
    const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
    const EMAIL_FROM = process.env.EMAIL_FROM || GMAIL_USER;

    if (!GMAIL_USER || !GMAIL_PASSWORD) {
      log("Missing Gmail credentials in environment variables");
      return res.json({ 
        success: false, 
        error: "Email service not configured" 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD
      }
    });

    const msg = {
      to,
      from: EMAIL_FROM,
      subject,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
      html,
    };

    await transporter.sendMail(msg);

    return res.json({
      success: true,
      message: `Email sent successfully to ${to}`
    });
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    return res.json({ success: false, error: error.message });
  }
};